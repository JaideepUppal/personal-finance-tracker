<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavingGoal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'saved_amount',
        'deadline',
    ];

    protected $casts = [
        'deadline'      => 'date',
        'target_amount' => 'decimal:2',
        'saved_amount'  => 'decimal:2',
    ];
}
