<?php

namespace App\Repositories;

use App\Enums\TaskStatus;
use Illuminate\Support\Facades\DB;

use App\Models\Task;

class TaskRepository
{
	public function getList(array $filters, int $perPage = 10, int $page = 1)
	{
		$query = clone $this->getBaseQuery();

		// 1. Áp dụng bộ lọc
		$this->applyFilters($query, $filters);

		// 2. Áp dụng sắp xếp
		$this->applyOrderBy($query, $filters);

		// 3. Phân trang
		$paginator = $query->paginate(
			perPage: $perPage,
			columns: ['*'],
			pageName: 'page',
			page: $page
		);

		// 4. Gắn subtasks và trả về
		return $this->loadSubtasks($paginator);
	}

	private function getBaseQuery()
	{
		return DB::table('tasks');
	}

	private function applyFilters($query, array $filters): void
	{
		if (isset($filters['status']) && $filters['status'] !== 'All') {
			$query->where('status', $filters['status']);
		}

		if (isset($filters['blocker']) && $filters['blocker'] !== 'All') {
			$query->where('blocker', $filters['blocker']);
		}

		if (!empty($filters['search_query'])) {
			$query->where('title', 'LIKE', '%' . $filters['search_query'] . '%');
		}
	}

	private function applyOrderBy($query, array $filters): void
	{
		// Lấy field và hướng sắp xếp từ query string (nếu không có thì gán mặc định)
		$sortBy  = $filters['sort_by'] ?? 'id';
		$sortDir = $filters['sort_dir'] ?? 'desc';

		// Danh sách các cột cho phép (Whitelist) để chống SQL Injection
		$allowedSortFields = [
			'id', 'title', 'status', 'blocker', 'planned_dev_up', 'created_at'
		];

		// Kiểm tra xem cột gửi lên có hợp lệ không, tránh lỗi vỡ query
		if (in_array($sortBy, $allowedSortFields)) {
			// Đảm bảo direction chỉ được là 'asc' hoặc 'desc'
			$validSortDir = strtolower($sortDir) === 'asc' ? 'asc' : 'desc';

			$query->orderBy($sortBy, $validSortDir);
		} else {
			// Nếu truyền bậy, fallback về mặc định an toàn nhất
			$query->orderBy('id', 'desc');
		}
	}

	private function loadSubtasks($paginator)
	{
		$items = $paginator->items();

		if (empty($items)) {
			return $paginator;
		}

		// Lấy array ID siêu tốc (như đã trao đổi ở phần trước)
		$taskIds = array_column($items, 'id');

		$subtasks = DB::table('subtasks')
			->whereIn('task_id', $taskIds)
			->get()
			->groupBy('task_id');

		foreach ($items as $task) {
			$taskSubtasks = $subtasks->get($task->id);
			$task->subtasks = $taskSubtasks ? $taskSubtasks->toArray() : [];
		}

		return $paginator;
	}

	public function create(array $data)
	{
		$now = now();

		$insertData = [
			'title'          => $data['title'],
			'redmine_url'    => $data['redmine_url'] ?? null,
			'status'         => $data['status'],
			'priority'       => $data['priority'],
			'note'	         => $data['note'],
			'planned_dev_up' => $data['planned_dev_up'] ?? null,
			'actual_dev_up'  => $data['actual_dev_up'] ?? null,
			'planned_start'  => $data['planned_start'] ?? null,
			'actual_start'   => $data['actual_start'] ?? null,
			'actual_end'     => $data['actual_end'] ?? null,
			'release_date'   => $data['release_date'] ?? null,
			'blocker'        => $data['blocker'] ?? null,
			'created_at'     => $now,
			'updated_at'     => $now,
		];

		$id = DB::table('tasks')->insertGetId($insertData);

		$insertData['id'] = $id;

		return (object) $insertData;
	}

	public function findById($id)
	{
		return DB::table('tasks')->find($id);
	}

	public function updateField(int $id, string $field, ?string $value)
	{
		DB::table('tasks')
			->where('id', $id)
			->update([
				$field       => $value,
				'updated_at' => now(),
			]);

		return $this->findById($id);
	}

	public function updateNote(int $id, string $note)
	{
		DB::table('tasks')
			->where('id', $id)
			->update([
				'note' => $note,
			]);

		return $this->findById($id);
	}

	public function update(int $id, array $data)
	{
		$updateData = [
			'title'          => $data['title'],
			'redmine_url'    => $data['redmine_url'] ?? null,
			'status'         => $data['status'],
			'priority'       => $data['priority'],
			'note'           => $data['note'],
			'planned_dev_up' => $data['planned_dev_up'] ?? null,
			'actual_dev_up'  => $data['actual_dev_up'] ?? null,
			'planned_start'  => $data['planned_start'] ?? null,
			'actual_start'   => $data['actual_start'] ?? null,
			'actual_end'     => $data['actual_end'] ?? null,
			'release_date'   => $data['release_date'] ?? null,
			'blocker'        => $data['blocker'] ?? null,

			// Chỉ cập nhật updated_at, giữ nguyên created_at
			'updated_at'     => now(),
		];

		// Thực thi update
		DB::table('tasks')->where('id', $id)->update($updateData);

		// Lấy lại data mới nhất sau khi update để trả về (Dùng lại hàm findById đã tạo lúc trước)
		return $this->findById($id);
	}

	public function delete(int $taskId): bool
	{
		return DB::table('tasks')
				->where('id', $taskId)
				->delete() > 0;
	}

	public function getTaskStats(array $filters = [])
	{
		$query = $this->getBaseQuery();

		$qb = $query->select(
			DB::raw("SUM(CASE WHEN status = '" . TaskStatus::NEW->value . "' THEN 1 ELSE 0 END) as todo_count"),
			DB::raw("SUM(CASE WHEN status = '" . TaskStatus::IN_PROGRESS->value . "' THEN 1 ELSE 0 END) as in_progress_count"),
			DB::raw("SUM(CASE WHEN status = '" . TaskStatus::RELEASE->value . "' THEN 1 ELSE 0 END) as release_count"),

			DB::raw("
				SUM(
					CASE
						WHEN status = '" . TaskStatus::DEV_UP->value . "'
						AND release_date IS NOT NULL
						AND DATEDIFF(release_date, NOW()) <= 3
						THEN 1
						ELSE 0
					END
				) as near_release_count
			"),

			DB::raw("COUNT(id) as total")
		)->first();

		return $qb;
	}

	public function getTaskToShowQuickView($filters = [])
	{
		return DB::table('tasks')
				->select('id', 'title')
				->where('status', $filters['status'])
				->get();
	}
}