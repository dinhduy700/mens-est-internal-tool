<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

use App\Enums\TaskStatus;
use App\Enums\Blocker;
use App\Enums\Priority;


class TaskRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'title'          => ['required', 'string', 'max:255'],
			'redmine_url'    => ['nullable', 'url'],
			'status'         => ['required', 'integer', Rule::enum(TaskStatus::class)],
			'priority'         => ['required', 'integer', Rule::enum(Priority::class)],
			'planned_dev_up' => ['nullable', 'string', 'date_format:d/m/Y'],
			'actual_dev_up'  => ['nullable', 'string', 'date_format:d/m/Y'],
			'planned_start'  => ['nullable', 'string', 'date_format:d/m/Y'],
			'actual_start'   => ['nullable', 'string', 'date_format:d/m/Y'],
			'actual_end'     => ['nullable', 'string', 'date_format:d/m/Y'],
			'release_date'   => ['nullable', 'string', 'date_format:d/m/Y'],
			'blocker'        => ['nullable', 'integer', Rule::enum(Blocker::class)],
			'subtasks_text' => ['nullable', 'string'],
		];
	}
}