<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;

Route::get('/', function () {
    return view('welcome');
});


// Route::post('/broadcasting/auth', '\Illuminate\Broadcasting\BroadcastController@authenticate')
//     ->middleware('auth:api');


Broadcast::routes(['middleware' => ['auth:sanctum']]);
