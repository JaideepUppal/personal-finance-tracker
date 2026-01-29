<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'category',
        'amount',
        'due_day',
        'frequency',
        'status_overrides',
    ];

    protected $casts = [
        'status_overrides' => 'array',
        'amount' => 'decimal:2',
    ];
}