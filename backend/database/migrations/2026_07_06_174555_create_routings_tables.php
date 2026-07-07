<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('routings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('routing_no')->unique();
            $table->string('product'); // Should be foreign key to products table ideally
            $table->text('description')->nullable();
            $table->string('status')->default('Draft');
            
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('routing_operations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('routing_id')->constrained('routings')->onDelete('cascade');
            $table->integer('operation_seq');
            $table->string('operation_name');
            $table->string('work_center')->nullable();
            $table->string('machine_group')->nullable();
            
            $table->decimal('setup_time', 10, 2)->default(0); // in minutes
            $table->decimal('run_time', 10, 4)->default(0); // in minutes per unit
            $table->decimal('move_time', 10, 2)->default(0); // in minutes
            
            $table->timestamps();
            
            $table->unique(['routing_id', 'operation_seq']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routing_operations');
        Schema::dropIfExists('routings');
    }
};
