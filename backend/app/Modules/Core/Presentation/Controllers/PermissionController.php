<?php

namespace App\Modules\Core\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Core\Repositories\Contracts\PermissionRepositoryInterface;
use App\Modules\Core\Resources\PermissionResource;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    public function __construct(
        private PermissionRepositoryInterface $permissionRepository
    ) {}

    public function index(): JsonResponse
    {
        $permissions = $this->permissionRepository->all();

        return response()->json([
            'success' => true,
            'data'    => PermissionResource::collection($permissions),
        ]);
    }
}
