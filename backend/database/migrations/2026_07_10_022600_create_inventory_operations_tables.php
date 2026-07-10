<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Stock Adjustments
        Schema::create('stock_adjustments', function (Blueprint $table) {
            $table->id();
            $table->string('adjustment_number')->unique(); // e.g., ADJ-2026-07-001
            $table->foreignId('warehouse_id')->constrained('warehouses');
            $table->string('status')->default('draft'); // draft, posted, cancelled
            $table->text('reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('posted_by')->nullable()->constrained('users');
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('stock_adjustment_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_adjustment_id')->constrained('stock_adjustments')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('location_id')->nullable()->constrained('warehouse_locations');
            $table->string('batch_number')->nullable();
            $table->decimal('quantity_adjusted', 15, 4); // can be positive or negative
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Stock Transfers
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->string('transfer_number')->unique(); // e.g., TRF-2026-07-001
            $table->foreignId('source_warehouse_id')->constrained('warehouses');
            $table->foreignId('destination_warehouse_id')->constrained('warehouses');
            $table->string('status')->default('draft'); // draft, intransit, received, cancelled
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('shipped_by')->nullable()->constrained('users');
            $table->timestamp('shipped_at')->nullable();
            $table->foreignId('received_by')->nullable()->constrained('users');
            $table->timestamp('received_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('stock_transfer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_transfer_id')->constrained('stock_transfers')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('source_location_id')->nullable()->constrained('warehouse_locations');
            $table->foreignId('destination_location_id')->nullable()->constrained('warehouse_locations');
            $table->string('batch_number')->nullable();
            $table->decimal('quantity', 15, 4); // Positive amount
            $table->decimal('quantity_received', 15, 4)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_transfer_items');
        Schema::dropIfExists('stock_transfers');
        Schema::dropIfExists('stock_adjustment_items');
        Schema::dropIfExists('stock_adjustments');
    }
};
