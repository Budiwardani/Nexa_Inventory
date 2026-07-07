<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Quality Control
        Schema::create('qc_inspections', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('qc_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->string('inspection_type')->default('In-Process'); // Incoming, In-Process, Final
            $table->string('product');
            $table->date('inspection_date');
            $table->decimal('sample_qty', 10, 2)->default(1);
            $table->decimal('pass_qty', 10, 2)->default(0);
            $table->decimal('fail_qty', 10, 2)->default(0);
            $table->string('result')->default('Pending'); // Pending, Pass, Fail, Conditional
            $table->text('notes')->nullable();
            $table->string('inspector')->nullable();
            $table->string('status')->default('Draft'); // Draft, Completed, Approved
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Scrap Management
        Schema::create('production_scraps', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('scrap_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->string('product');
            $table->date('scrap_date');
            $table->decimal('scrap_qty', 10, 2);
            $table->string('uom')->default('PCS');
            $table->string('scrap_reason');
            $table->decimal('unit_cost', 15, 4)->default(0);
            $table->decimal('total_cost', 15, 4)->default(0);
            $table->text('notes')->nullable();
            $table->string('status')->default('Draft');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Rework
        Schema::create('production_reworks', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('rework_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->string('product');
            $table->date('rework_date');
            $table->decimal('rework_qty', 10, 2);
            $table->string('uom')->default('PCS');
            $table->string('failure_reason');
            $table->string('rework_action');
            $table->decimal('rework_cost', 15, 4)->default(0);
            $table->integer('rework_cycle')->default(1);
            $table->string('status')->default('Draft'); // Draft, In Rework, Completed, Scrapped
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Machines
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('machine_code')->unique();
            $table->string('machine_name');
            $table->string('machine_group')->nullable();
            $table->string('work_center')->nullable();
            $table->string('production_line')->nullable();
            $table->string('status')->default('Active'); // Active, Under Maintenance, Inactive
            $table->date('last_maintenance_date')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Machine Maintenance
        Schema::create('machine_maintenance_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('maintenance_no')->unique();
            $table->foreignId('machine_id')->nullable()->constrained('machines')->nullOnDelete();
            $table->string('maintenance_type')->default('Preventive'); // Preventive, Corrective, Emergency
            $table->date('scheduled_date')->nullable();
            $table->date('actual_date')->nullable();
            $table->string('technician')->nullable();
            $table->decimal('duration_hours', 8, 2)->default(0);
            $table->decimal('maintenance_cost', 15, 4)->default(0);
            $table->text('description')->nullable();
            $table->text('findings')->nullable();
            $table->string('status')->default('Scheduled'); // Scheduled, In Progress, Completed, Cancelled
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // Machine Downtime
        Schema::create('machine_downtimes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('downtime_no')->unique();
            $table->foreignId('machine_id')->nullable()->constrained('machines')->nullOnDelete();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->decimal('duration_hours', 8, 2)->default(0);
            $table->string('downtime_reason');
            $table->string('downtime_category')->default('Unplanned'); // Planned, Unplanned, Breakdown
            $table->text('root_cause')->nullable();
            $table->text('corrective_action')->nullable();
            $table->string('status')->default('Open'); // Open, Resolved
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Capacity Plans
        Schema::create('capacity_plans', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('plan_no')->unique();
            $table->string('work_center');
            $table->date('plan_date');
            $table->string('shift')->default('Shift A');
            $table->decimal('available_hours', 8, 2)->default(8);
            $table->decimal('planned_hours', 8, 2)->default(0);
            $table->decimal('actual_hours', 8, 2)->default(0);
            $table->integer('headcount')->default(1);
            $table->string('status')->default('Draft');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Production Costs
        Schema::create('production_costs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('cost_no')->unique();
            $table->foreignId('production_order_id')->nullable()->constrained('production_orders')->nullOnDelete();
            $table->string('product');
            $table->decimal('material_cost', 15, 4)->default(0);
            $table->decimal('labor_cost', 15, 4)->default(0);
            $table->decimal('machine_cost', 15, 4)->default(0);
            $table->decimal('overhead_cost', 15, 4)->default(0);
            $table->decimal('total_cost', 15, 4)->default(0);
            $table->decimal('standard_cost', 15, 4)->default(0);
            $table->decimal('variance', 15, 4)->default(0);
            $table->string('status')->default('Draft'); // Draft, Posted
            $table->date('posting_date')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('message');
            $table->string('type')->default('Info'); // Info, Warning, Alert, Success
            $table->string('channel')->default('Web'); // Web, Email, WhatsApp
            $table->string('recipient')->nullable();
            $table->boolean('is_read')->default(false);
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('production_costs');
        Schema::dropIfExists('capacity_plans');
        Schema::dropIfExists('machine_downtimes');
        Schema::dropIfExists('machine_maintenance_logs');
        Schema::dropIfExists('machines');
        Schema::dropIfExists('production_reworks');
        Schema::dropIfExists('production_scraps');
        Schema::dropIfExists('qc_inspections');
    }
};
