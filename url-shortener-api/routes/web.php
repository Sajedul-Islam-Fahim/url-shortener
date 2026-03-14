<?php

use App\Http\Controllers\RedirectController;
use Illuminate\Support\Facades\Route;

Route::get('/{code}', [RedirectController::class, 'redirect'])
    ->where('code', '[a-zA-Z0-9_-]+');
