<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Inventory Table
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('product');
            $table->string('warehouse');
            $table->decimal('qty', 15, 2)->default(0);
            $table->string('uom')->nullable();
            $table->decimal('unit_cost', 15, 2)->default(0);
            $table->timestamp('last_counted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['product', 'warehouse']);
        });

        // 2. Settings Table
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('inventories');
    }
};
