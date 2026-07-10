<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->nullable(); // e.g., 'main', 'transit', 'production'
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
        });

        Schema::create('warehouse_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['warehouse_id', 'code']);
        });

        Schema::create('warehouse_racks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('zone_id')->constrained('warehouse_zones')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['zone_id', 'code']);
        });

        Schema::create('warehouse_bins', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rack_id')->constrained('warehouse_racks')->onDelete('cascade');
            $table->string('code');
            $table->string('name');
            $table->decimal('max_weight', 10, 2)->nullable();
            $table->decimal('max_volume', 10, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['rack_id', 'code']);
        });

        // Denormalized/flattened locations for easier querying
        Schema::create('warehouse_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');
            $table->foreignId('zone_id')->nullable()->constrained('warehouse_zones')->onDelete('cascade');
            $table->foreignId('rack_id')->nullable()->constrained('warehouse_racks')->onDelete('cascade');
            $table->foreignId('bin_id')->nullable()->constrained('warehouse_bins')->onDelete('cascade');
            $table->string('location_code')->unique(); // e.g., WH1-Z1-R1-B1
            $table->string('barcode')->nullable()->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_locations');
        Schema::dropIfExists('warehouse_bins');
        Schema::dropIfExists('warehouse_racks');
        Schema::dropIfExists('warehouse_zones');
        Schema::dropIfExists('warehouses');
    }
};
