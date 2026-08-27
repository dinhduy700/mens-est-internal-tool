<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('admin/user', function () {
	return view('admin.user.index');
});