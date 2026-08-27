<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubtaskRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			// Không cần task_id ở đây
			'title'   => ['required', 'string', 'max:255'],
			'status'  => ['required', 'integer'],
			'note'    => ['nullable', 'string'],
		];
	}
}