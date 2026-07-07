<?php

namespace App\Modules\Core\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RoutingResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'routing_no' => $this->routing_no,
            'product' => $this->product,
            'description' => $this->description,
            'status' => $this->status,
            'operations' => $this->whenLoaded('operations', function () {
                return $this->operations->map(function ($op) {
                    return [
                        'id' => $op->id,
                        'operation_seq' => $op->operation_seq,
                        'operation_name' => $op->operation_name,
                        'work_center' => $op->work_center,
                        'machine_group' => $op->machine_group,
                        'setup_time' => (float) $op->setup_time,
                        'run_time' => (float) $op->run_time,
                        'move_time' => (float) $op->move_time,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
