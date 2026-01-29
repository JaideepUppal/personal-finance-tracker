<?php

use Illuminate\Support\Facades\Route;

/*

    API Routes (unused for this project)

    This file stays empty because our dashboard uses session-based auth.
    All API endpoints live inside web.php under /api/... with 'auth' middleware.

*/

Route::middleware('auth:sanctum')->get('/user', function ($request) {
    return $request->user();
});