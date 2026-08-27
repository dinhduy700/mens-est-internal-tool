<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\SubtaskController;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
	/* tasks */
	Route::get('/tasks', [TaskController::class, 'index']);
	Route::post('/tasks', [TaskController::class, 'store']);
	Route::get('/tasks/{id}', [TaskController::class, 'show']);
	Route::put('/tasks/{id}', [TaskController::class, 'update']);
	Route::patch('/tasks/{id}/update-date', [TaskController::class, 'updateDate']);

	/* subtasks */
	Route::post('/subtasks', [SubtaskController::class, 'store']);
	Route::put('/subtasks/{id}', [SubtaskController::class, 'update']);
	Route::delete('/subtasks/{id}', [SubtaskController::class, 'destroy']);
	Route::patch('/subtasks/{id}/status', [SubtaskController::class, 'updateStatus']);
});