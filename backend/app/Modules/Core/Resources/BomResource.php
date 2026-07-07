<?php

namespace App\Modules\Core\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BomResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'bom_no' => $this->bom_no,
            'product' => $this->product,
            'variant' => $this->variant,
            'uom' => $this->uom,
            'base_qty' => (float) $this->base_qty,
            'description' => $this->description,
            'status' => $this->status,
            'versions' => $this->whenLoaded('versions', function () {
                return $this->versions->map(function ($version) {
                    return [
                        'id' => $version->id,
                        'version_number' => $version->version_number,
                        'effective_date' => $version->effective_date,
                        'end_date' => $version->end_date,
                        'status' => $version->status,
                        'items' => $version->items ? $version->items->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'component_item' => $item->component_item,
                                'quantity' => (float) $item->quantity,
                                'uom' => $item->uom,
                                'scrap_percentage' => (float) $item->scrap_percentage,
                                'is_critical' => (bool) $item->is_critical,
                            ];
                        }) : [],
                    ];
                });
            }),
            'active_version' => $this->whenLoaded('activeVersion', function () {
                return [
                    'id' => $this->activeVersion->id,
                    'version_number' => $this->activeVersion->version_number,
                    'items' => $this->activeVersion->items,
                ];
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
