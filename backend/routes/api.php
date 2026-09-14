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
	Route::get('/tasks/stats', [TaskController::class, 'getStats']);
	Route::get('/tasks/quick-view', [TaskController::class, 'quickView']);
	Route::get('/tasks/{id}', [TaskController::class, 'show']);
	Route::put('/tasks/{id}', [TaskController::class, 'update']);
	Route::patch('/tasks/{id}/update-date', [TaskController::class, 'updateDate']);
	Route::delete('/tasks/{taskId}', [TaskController::class, 'destroy']);
	Route::patch('/tasks/{id}/update-note', [TaskController::class, 'updateNote']);


	/* subtasks */
	Route::post('/subtasks', [SubtaskController::class, 'store']);
	Route::put('/tasks/{taskId}/subtasks/{subtaskId}', [SubtaskController::class, 'update']);
	Route::delete('/tasks/{taskId}/subtasks/{subtaskId}', [SubtaskController::class, 'destroy']);
	Route::patch('/tasks/{taskId}/subtasks/{subtaskId}/status', [SubtaskController::class, 'updateStatus']);
});