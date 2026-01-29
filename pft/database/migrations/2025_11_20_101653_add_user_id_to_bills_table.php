<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        
        if (!Schema::hasColumn('bills', 'user_id')) {
            Schema::table('bills', function (Blueprint $table) {
                $table->unsignedBigInteger('user_id')->after('id');
            });
        }
    }

   
    public function down(): void
    {
        // Only drop the column if it exists
        if (Schema::hasColumn('bills', 'user_id')) {
            Schema::table('bills', function (Blueprint $table) {
                $table->dropColumn('user_id');
            });
        }
    }
};