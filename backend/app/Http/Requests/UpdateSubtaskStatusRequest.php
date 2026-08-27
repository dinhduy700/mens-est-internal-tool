<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubtaskStatusRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			// Chỉ yêu cầu duy nhất trường status
			'status' => ['required', 'integer'],
		];
	}
}