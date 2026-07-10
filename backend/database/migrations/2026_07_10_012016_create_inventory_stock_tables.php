<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products'); // Assuming 'products' table exists from Master Data
            $table->foreignId('warehouse_id')->constrained('warehouses');
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations');
            $table->string('batch_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->decimal('quantity_on_hand', 15, 4)->default(0);
            $table->decimal('quantity_reserved', 15, 4)->default(0);
            $table->decimal('quantity_available', 15, 4)->storedAs('quantity_on_hand - quantity_reserved');
            $table->foreignId('unit_id')->nullable()->constrained('units');
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['product_id', 'location_id', 'batch_number', 'serial_number'], 'idx_stock_unique');
        });

        // Stock Ledger (Immutable History)
        Schema::create('stock_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('warehouse_id')->constrained('warehouses');
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations');
            $table->string('batch_number')->nullable();
            $table->string('transaction_type'); // 'receipt', 'issue', 'transfer', 'adjustment'
            $table->string('reference_type'); // Morph type e.g., 'App\\Models\\PurchaseOrder'
            $table->unsignedBigInteger('reference_id'); // Morph ID
            $table->decimal('quantity_in', 15, 4)->default(0);
            $table->decimal('quantity_out', 15, 4)->default(0);
            $table->decimal('balance', 15, 4); // Snapshot of balance after this transaction
            $table->decimal('unit_cost', 15, 4)->nullable(); // For costing
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Master records for grouped movements
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->string('movement_number')->unique(); // e.g., MV-2026-07-001
            $table->string('movement_type'); // 'adjustment', 'transfer', 'receipt', 'issue'
            $table->foreignId('source_warehouse_id')->nullable()->constrained('warehouses');
            $table->foreignId('destination_warehouse_id')->nullable()->constrained('warehouses');
            $table->string('status')->default('draft'); // 'draft', 'posted', 'cancelled'
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('posted_by')->nullable()->constrained('users');
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
        Schema::dropIfExists('stock_cards');
        Schema::dropIfExists('stocks');
    }
};
