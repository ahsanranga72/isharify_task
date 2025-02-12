<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('products', ProductController::class)->except(['create', 'edit']);
Route::post('/products/bulk-upload', [ProductController::class, 'bulkUpload']);
