<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'type',       // income or expense
        'title',
        'amount',
        'category',
        'date',       
    ];

    protected $casts = [
        'date'   => 'datetime',
        'amount' => 'decimal:2',
    ];


    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}