<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bill_of_materials', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('bom_no')->unique();
            $table->string('product'); // Should be foreign key to products table ideally, but product is string in other tables for now
            $table->string('variant')->nullable();
            $table->string('uom');
            $table->decimal('base_qty', 10, 2)->default(1);
            $table->text('description')->nullable();
            $table->string('status')->default('Draft');
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('bom_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bom_id')->constrained('bill_of_materials')->onDelete('cascade');
            $table->integer('version_number');
            $table->date('effective_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('change_notes')->nullable();
            $table->string('status')->default('Draft'); // Draft, Active, Obsolete
            
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            
            $table->unique(['bom_id', 'version_number']);
        });

        Schema::create('bom_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bom_version_id')->constrained('bom_versions')->onDelete('cascade');
            $table->string('component_item');
            $table->decimal('quantity', 10, 4);
            $table->string('uom')->nullable();
            $table->decimal('scrap_percentage', 5, 2)->default(0);
            $table->boolean('is_critical')->default(false);
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bom_items');
        Schema::dropIfExists('bom_versions');
        Schema::dropIfExists('bill_of_materials');
    }
};
