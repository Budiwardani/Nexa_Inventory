<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('wo_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->string('product');
            $table->string('variant')->nullable();
            $table->string('work_center')->nullable();
            $table->string('machine')->nullable();
            $table->decimal('target_qty', 10, 2);
            $table->string('uom')->default('PCS');
            $table->decimal('completed_qty', 10, 2)->default(0);
            $table->decimal('reject_qty', 10, 2)->default(0);
            $table->timestamp('scheduled_start')->nullable();
            $table->timestamp('scheduled_end')->nullable();
            $table->timestamp('actual_start')->nullable();
            $table->timestamp('actual_end')->nullable();
            $table->string('status')->default('Draft'); // Draft, Released, In Progress, Completed, Closed
            $table->text('notes')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('work_order_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_order_id')->constrained('work_orders')->onDelete('cascade');
            $table->integer('operation_seq');
            $table->string('operation_name');
            $table->string('work_center')->nullable();
            $table->string('machine')->nullable();
            $table->decimal('setup_time', 10, 2)->default(0);
            $table->decimal('run_time', 10, 4)->default(0);
            $table->decimal('actual_time', 10, 4)->default(0);
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_order_operations');
        Schema::dropIfExists('work_orders');
    }
};
