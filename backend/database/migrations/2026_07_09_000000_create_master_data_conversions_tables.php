<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Core Products Table (Master)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_code')->unique();
            $table->string('product_name');
            $table->string('product_type')->default('Standard'); // Standard, Assembly, Service
            $table->boolean('is_active')->default(true);
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Unit Groups (e.g., Length, Weight, Volume)
        Schema::create('unit_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_code')->unique();
            $table->string('group_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 3. Units Master
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('unit_code')->unique();
            $table->string('unit_name');
            $table->foreignId('group_id')->nullable()->constrained('unit_groups')->nullOnDelete();
            $table->boolean('is_base_unit')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 4. Packaging Types
        Schema::create('packaging_types', function (Blueprint $table) {
            $table->id();
            $table->string('packaging_code')->unique(); // e.g., BOX, CTN, PALLET
            $table->string('packaging_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Conversion Groups
        Schema::create('conversion_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_code')->unique();
            $table->string('group_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        // 6. Unit Conversions (The Core Matrix)
        Schema::create('unit_conversions', function (Blueprint $table) {
            $table->id();
            $table->string('conversion_code')->unique();
            $table->string('conversion_name')->nullable();
            
            $table->foreignId('source_unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('target_unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('conversion_group_id')->nullable()->constrained('conversion_groups')->nullOnDelete();
            
            $table->decimal('conversion_factor', 18, 6);
            $table->decimal('reverse_factor', 18, 6)->nullable();
            
            $table->integer('precision')->default(2);
            $table->string('rounding_method')->default('Round Half Up'); // Round Half Up, Round Down, Round Up
            $table->boolean('allow_fraction')->default(true);
            $table->boolean('auto_conversion')->default(true);
            
            $table->decimal('loss_percentage', 5, 2)->default(0);
            $table->decimal('yield_percentage', 5, 2)->default(100);
            
            $table->decimal('min_quantity', 18, 4)->nullable();
            $table->decimal('max_quantity', 18, 4)->nullable();
            
            $table->date('effective_date')->nullable();
            $table->date('expired_date')->nullable();
            
            $table->text('remarks')->nullable();
            $table->boolean('is_active')->default(true);
            
            // Audit fields
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['source_unit_id', 'target_unit_id'], 'uc_source_target_unique');
        });

        // 7. Product Unit Mappings (Product specific configs)
        Schema::create('product_unit_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            $table->foreignId('base_unit_id')->constrained('units');
            $table->foreignId('purchase_unit_id')->nullable()->constrained('units');
            $table->foreignId('sales_unit_id')->nullable()->constrained('units');
            $table->foreignId('inventory_unit_id')->nullable()->constrained('units');
            $table->foreignId('production_unit_id')->nullable()->constrained('units');
            $table->foreignId('weight_unit_id')->nullable()->constrained('units');
            $table->foreignId('volume_unit_id')->nullable()->constrained('units');
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique('product_id');
        });

        // 8. Product Packaging Hierarchy
        Schema::create('product_packaging', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('packaging_type_id')->constrained('packaging_types');
            
            $table->integer('hierarchy_level'); // 1 = lowest (e.g. Pack), 2 = Box, 3 = Carton
            $table->foreignId('base_unit_id')->constrained('units');
            $table->decimal('qty_in_base_unit', 18, 6);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['product_id', 'hierarchy_level']);
        });

        // 9. Conversion Logs / Audit History
        Schema::create('conversion_logs', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // 'UnitConversion', 'ProductUnitMapping'
            $table->unsignedBigInteger('entity_id');
            $table->string('action'); // 'Created', 'Updated', 'Deleted', 'Approved'
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            
            $table->string('ip_address')->nullable();
            $table->string('device')->nullable();
            $table->text('reason')->nullable();
            
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversion_logs');
        Schema::dropIfExists('product_packaging');
        Schema::dropIfExists('product_unit_mappings');
        Schema::dropIfExists('unit_conversions');
        Schema::dropIfExists('conversion_groups');
        Schema::dropIfExists('packaging_types');
        Schema::dropIfExists('units');
        Schema::dropIfExists('unit_groups');
        Schema::dropIfExists('products');
    }
};
