<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

use App\Enums\TaskStatus;
use App\Enums\Blocker;

class TaskResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		$statusEnum = TaskStatus::tryFrom($this->status);
		$blockerEnum = $this->blocker !== null ? Blocker::tryFrom($this->blocker) : null;

		return [
			'id'             => $this->id,
			'title'          => $this->title,
			'redmine_url'    => $this->redmine_url,
			'status'         => [
				'value' => $this->status,
				'label' => $statusEnum ? $statusEnum->label() : 'Unknown',
			],
			'blocker'        => [
				'value' => $this->blocker,
				'label' => $blockerEnum ? ($blockerEnum === Blocker::YES ? 'Yes' : 'No') : null,
			],
			'priority'        => $this->priority,
			'planned_dev_up' => $this->planned_dev_up ? Carbon::parse($this->planned_dev_up)->format('d/m/Y') : null,
			'actual_dev_up'  => $this->actual_dev_up  ? Carbon::parse($this->actual_dev_up)->format('d/m/Y') : null,
			'planned_start'  => $this->planned_start  ? Carbon::parse($this->planned_start)->format('d/m/Y') : null,
			'actual_start'   => $this->actual_start   ? Carbon::parse($this->actual_start)->format('d/m/Y') : null,
			'actual_end'     => $this->actual_end     ? Carbon::parse($this->actual_end)->format('d/m/Y') : null,
			'release_date'   => $this->release_date   ? Carbon::parse($this->release_date)->format('d/m/Y') : null,
			'created_at'     => $this->created_at ? Carbon::parse($this->created_at)->format('d/m/Y') : null,

			'subtasks'       => $this->subtasks ?? [],
		];
	}
}