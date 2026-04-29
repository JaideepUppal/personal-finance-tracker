<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();

            //  for multi-user support
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('category')->default('other');
            $table->decimal('amount', 10, 2);
            $table->unsignedTinyInteger('due_day'); // 1-31
            $table->string('frequency')->default('monthly');

            // JSON storing { "2025-11": "paid", "2025-12": "due", ... }
            $table->json('status_overrides')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bills');
    }
};