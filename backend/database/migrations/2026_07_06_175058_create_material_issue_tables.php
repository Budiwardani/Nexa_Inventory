<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_issue_headers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('mi_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->foreignId('work_order_id')->nullable()->constrained('work_orders')->nullOnDelete();
            $table->string('warehouse')->nullable();
            $table->date('issue_date');
            $table->string('status')->default('Draft'); // Draft, Issued, Partial, Completed
            $table->text('notes')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('material_issue_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mi_header_id')->constrained('material_issue_headers')->onDelete('cascade');
            $table->string('material_code');
            $table->string('material_name');
            $table->string('warehouse')->nullable();
            $table->decimal('required_qty', 10, 4);
            $table->decimal('issued_qty', 10, 4)->default(0);
            $table->string('uom')->nullable();
            $table->string('batch_no')->nullable();
            $table->string('serial_no')->nullable();
            $table->timestamps();
        });

        Schema::create('material_return_headers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('mr_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->foreignId('mi_header_id')->nullable()->constrained('material_issue_headers')->nullOnDelete();
            $table->string('warehouse')->nullable();
            $table->date('return_date');
            $table->string('status')->default('Draft');
            $table->text('notes')->nullable();

            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('material_return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mr_header_id')->constrained('material_return_headers')->onDelete('cascade');
            $table->string('material_code');
            $table->string('material_name');
            $table->decimal('return_qty', 10, 4);
            $table->string('uom')->nullable();
            $table->string('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_return_items');
        Schema::dropIfExists('material_return_headers');
        Schema::dropIfExists('material_issue_items');
        Schema::dropIfExists('material_issue_headers');
    }
};
