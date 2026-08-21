<?php

namespace App\Modules\Core\Contracts;

interface AiPredictionServiceInterface
{
    /**
     * Predict future inventory demand / reorder levels.
     *
     * @param string $productCode
     * @param int $horizonDays
     * @param array $historicalContext
     * @return array
     */
    public function predictStockDemand(string $productCode, int $horizonDays = 30, array $historicalContext = []): array;

    /**
     * Analyze machine sensor/log data for predictive maintenance anomalies.
     *
     * @param int $machineId
     * @param array $recentLogs
     * @return array
     */
    public function detectMaintenanceAnomalies(int $machineId, array $recentLogs = []): array;

    /**
     * Generate smart ERP summary insights.
     *
     * @param string $domainContext
     * @param array $metrics
     * @return string
     */
    public function generateInsightsSummary(string $domainContext, array $metrics = []): string;
}
