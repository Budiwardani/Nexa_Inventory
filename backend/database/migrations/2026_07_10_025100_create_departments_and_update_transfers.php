<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Departments / Unit / Bagian
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('type')->default('production'); // production, qc, maintenance, assembly, logistics, warehouse, admin
            $table->text('description')->nullable();
            $table->foreignId('branch_id')->nullable()->constrained('branches');
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        // Add destination columns to stock_transfers
        Schema::table('stock_transfers', function (Blueprint $table) {
            $table->string('destination_type')->default('warehouse')->after('destination_warehouse_id'); // warehouse | department
            $table->foreignId('destination_department_id')->nullable()->constrained('departments')->after('destination_type');
        });
    }

    public function down(): void
    {
        Schema::table('stock_transfers', function (Blueprint $table) {
            $table->dropForeign(['destination_department_id']);
            $table->dropColumn(['destination_type', 'destination_department_id']);
        });
        Schema::dropIfExists('departments');
    }
};
