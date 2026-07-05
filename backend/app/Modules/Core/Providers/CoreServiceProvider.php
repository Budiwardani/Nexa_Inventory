<?php

namespace App\Modules\Core\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Core\Repositories\Contracts\UserRepositoryInterface;
use App\Modules\Core\Repositories\Eloquent\EloquentUserRepository;

class CoreServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}
