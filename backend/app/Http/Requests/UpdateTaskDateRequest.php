<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskDateRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'field' => [
				'required',
				'string',
				Rule::in([
					'planned_dev_up',
					'actual_dev_up',
					'planned_start',
					'actual_start',
					'actual_end',
					'release_date',
				])
			],

			'date_value' => ['nullable', 'string', 'date_format:d/m/Y'],
		];
	}
}