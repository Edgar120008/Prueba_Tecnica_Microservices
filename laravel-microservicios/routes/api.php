<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::apiResource('products', ProductController::class);
Route::patch('products/{id}/restore', [ProductController::class, 'restore']);
