<?php

namespace App\Traits;

trait ApiResponse
{
	protected function successResponse(mixed $data = null, string $message = 'Success', int $statusCode = 200)
	{
		return response()->json([
			'success' => true,
			'message' => $message,
			'data'    => $data,
		], $statusCode);
	}

	protected function errorResponse(string $message, int $statusCode = 400, $errors = null)
	{
		$response = [
			'success' => false,
			'message' => $message,
		];

		if ($errors) {
			$response['errors'] = $errors;
		}

		return response()->json($response, $statusCode);
	}
}