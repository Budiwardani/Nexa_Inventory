<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('production_order_no')->unique();
            $table->date('production_date');
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('plant')->nullable();
            $table->string('warehouse')->nullable();
            $table->string('production_plan')->nullable();
            $table->string('bom')->nullable();
            $table->string('bom_version')->nullable();
            $table->string('routing')->nullable();
            $table->string('production_type')->nullable();
            $table->string('priority')->default('Normal');
            $table->string('status')->default('Draft');
            $table->string('approval_stage')->default('Draft');
            $table->date('due_date')->nullable();
            $table->text('description')->nullable();
            $table->text('remarks')->nullable();
            $table->jsonb('items')->nullable();
            $table->jsonb('material_requirements')->nullable();
            $table->jsonb('machine_assignments')->nullable();
            $table->jsonb('operator_assignments')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_id', 'branch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_orders');
    }
};
