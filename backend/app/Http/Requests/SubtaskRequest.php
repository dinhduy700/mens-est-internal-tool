<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubtaskRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'task_id' => ['required', 'integer', 'exists:tasks,id'],
			'title'   => ['required', 'string', 'max:255'],
			'status'  => ['required', 'integer'],
			'note'    => ['nullable', 'string'],
		];
	}
}