<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('account_code')->unique();
            $table->string('account_name');
            $table->string('account_type'); // Asset, Liability, Equity, Revenue, Expense
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('journal_headers', function (Blueprint $table) {
            $table->id();
            $table->string('journal_number')->unique();
            $table->date('journal_date');
            $table->string('reference_type')->nullable(); // e.g., 'MaterialIssue', 'FinishedGoodsReceipt'
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->text('description')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->timestamps();
        });

        Schema::create('journal_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('journal_header_id')->constrained('journal_headers')->onDelete('cascade');
            $table->foreignId('chart_of_account_id')->constrained('chart_of_accounts');
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
            $table->string('cost_center')->nullable();
            $table->string('project_code')->nullable();
            $table->string('department')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_details');
        Schema::dropIfExists('journal_headers');
        Schema::dropIfExists('chart_of_accounts');
    }
};
