<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Modules\Purchasing\Infrastructure\Repositories\SupplierRepositoryInterface;
use App\Modules\Purchasing\Infrastructure\Repositories\SupplierRepository;
use App\Modules\Purchasing\Infrastructure\Repositories\PurchaseOrderRepositoryInterface;
use App\Modules\Purchasing\Infrastructure\Repositories\PurchaseOrderRepository;
use App\Modules\Purchasing\Infrastructure\Repositories\GoodsReceiptRepositoryInterface;
use App\Modules\Purchasing\Infrastructure\Repositories\GoodsReceiptRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(SupplierRepositoryInterface::class, SupplierRepository::class);
        $this->app->bind(PurchaseOrderRepositoryInterface::class, PurchaseOrderRepository::class);
        $this->app->bind(GoodsReceiptRepositoryInterface::class, GoodsReceiptRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
