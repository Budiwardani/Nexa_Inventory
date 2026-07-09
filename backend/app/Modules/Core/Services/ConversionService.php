<?php

namespace App\Modules\Core\Services;

use App\Modules\Core\Domain\Models\UnitConversion;
use Illuminate\Support\Facades\Log;
use Exception;

class ConversionService
{
    /**
     * Convert quantity from source unit to target unit.
     */
    public function convert(int $sourceUnitId, int $targetUnitId, float $quantity): float
    {
        if ($sourceUnitId === $targetUnitId) {
            return $quantity;
        }

        // Try direct forward conversion
        $conversion = UnitConversion::where('source_unit_id', $sourceUnitId)
            ->where('target_unit_id', $targetUnitId)
            ->where('is_active', true)
            ->first();

        if ($conversion) {
            return $this->calculate($quantity, $conversion->conversion_factor, $conversion);
        }

        // Try reverse conversion
        $reverseConversion = UnitConversion::where('source_unit_id', $targetUnitId)
            ->where('target_unit_id', $sourceUnitId)
            ->where('is_active', true)
            ->first();

        if ($reverseConversion) {
            $factor = $reverseConversion->reverse_factor ?: (1 / $reverseConversion->conversion_factor);
            return $this->calculate($quantity, $factor, $reverseConversion);
        }

        throw new Exception("No active conversion rule found between units {$sourceUnitId} and {$targetUnitId}");
    }

    /**
     * Split a material into smaller units (e.g. 1 pipe -> 3 pipes of 2m)
     */
    public function splitMaterial(int $sourceUnitId, int $targetUnitId, float $sourceQuantity): array
    {
        $totalTargetQuantity = $this->convert($sourceUnitId, $targetUnitId, $sourceQuantity);
        
        return [
            'source_deducted' => $sourceQuantity,
            'target_added' => $totalTargetQuantity,
            'source_unit_id' => $sourceUnitId,
            'target_unit_id' => $targetUnitId
        ];
    }

    /**
     * Merge materials into a larger unit
     */
    public function mergeMaterial(int $sourceUnitId, int $targetUnitId, float $sourceQuantity): array
    {
        // This is conceptually the same as convert, but logically represents a merge operation
        $totalTargetQuantity = $this->convert($sourceUnitId, $targetUnitId, $sourceQuantity);

        return [
            'source_deducted' => $sourceQuantity,
            'target_added' => $totalTargetQuantity,
            'source_unit_id' => $sourceUnitId,
            'target_unit_id' => $targetUnitId
        ];
    }

    /**
     * Apply conversion factor, loss/yield, and rounding rules.
     */
    private function calculate(float $quantity, float $factor, UnitConversion $rule): float
    {
        // Apply factor
        $result = $quantity * $factor;

        // Apply Yield and Loss
        // e.g. yield 95% means we get 95% of expected. loss 5% means we lose 5%
        // Actually, if yield is used, result * yield/100
        $result = $result * ($rule->yield_percentage / 100);
        $result = $result - ($result * ($rule->loss_percentage / 100));

        // Apply precision and rounding
        switch ($rule->rounding_method) {
            case 'Round Up':
                $multiplier = pow(10, $rule->precision);
                $result = ceil($result * $multiplier) / $multiplier;
                break;
            case 'Round Down':
                $multiplier = pow(10, $rule->precision);
                $result = floor($result * $multiplier) / $multiplier;
                break;
            case 'Round Half Up':
            default:
                $result = round($result, $rule->precision);
                break;
        }

        if (!$rule->allow_fraction) {
            $result = floor($result);
        }

        return $result;
    }
}
