<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Enums\TaskStatus; // Giả sử dùng chung Enum với Task

class SubtaskResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$statusEnum = TaskStatus::tryFrom($this->status);

		return [
			'id'         => $this->id,
			'task_id'    => $this->task_id,
			'title'      => $this->title,
			'status'     => [
				'value' => $this->status,
				'label' => $statusEnum ? $statusEnum->label() : 'Unknown',
			],
			'note'       => $this->note,
		];
	}
}