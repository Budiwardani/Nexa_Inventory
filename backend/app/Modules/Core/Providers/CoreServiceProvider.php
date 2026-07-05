<?php

namespace App\Modules\Core\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Core\Repositories\Contracts\UserRepositoryInterface;
use App\Modules\Core\Repositories\Contracts\RoleRepositoryInterface;
use App\Modules\Core\Repositories\Contracts\PermissionRepositoryInterface;
use App\Modules\Core\Repositories\Eloquent\EloquentUserRepository;
use App\Modules\Core\Repositories\Eloquent\EloquentRoleRepository;
use App\Modules\Core\Repositories\Eloquent\EloquentPermissionRepository;

class CoreServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );

        $this->app->bind(
            RoleRepositoryInterface::class,
            EloquentRoleRepository::class
        );

        $this->app->bind(
            PermissionRepositoryInterface::class,
            EloquentPermissionRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}
