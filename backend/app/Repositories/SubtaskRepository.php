<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class SubtaskRepository
{
	/**
	 * Tạo subtask mới bằng Query Builder
	 */
	public function create(array $data)
	{
		$now = now();

		$insertData = [
			'task_id'    => $data['task_id'],
			'title'      => $data['title'],
			'status'     => $data['status'],
			'note'       => $data['note'] ?? null,
			'created_at' => $now,
			'updated_at' => $now,
		];

		// Thực thi insert và lấy ID
		$id = DB::table('subtasks')->insertGetId($insertData);

		// Gắn ID vào mảng data và ép kiểu thành object để truyền qua Resource (giống Task)
		$insertData['id'] = $id;

		return (object) $insertData;
	}

	/**
	 * Lấy chi tiết 1 subtask theo ID
	 */
	public function findById($id)
	{
		return DB::table('subtasks')->find($id);
	}

	/**
	 * Cập nhật thông tin subtask
	 */
	public function update(int $taskId, int $id, array $data)
	{
		$updateData = [
			'title'      => $data['title'],
			'status'     => $data['status'],
			'note'       => $data['note'] ?? null,
			'updated_at' => now(),
		];

		DB::table('subtasks')
			->where('task_id', $taskId)
			->where('id', $id)
			->update($updateData);

		// Lấy lại dữ liệu mới nhất để trả về
		return $this->findById($id);
	}

	public function delete(int $taskId, int $id): bool
	{
		return DB::table('subtasks')
				->where('task_id', $taskId)
				->where('id', $id)
				->delete() > 0;
	}

	public function findByIdAndTaskId(int $taskId, int $subtaskId)
	{
		return DB::table('subtasks')
			->where('id', $subtaskId)
			->where('task_id', $taskId)
			->first();
	}

	public function updateStatus(int $taskId, int $subtaskId, int $status): bool
	{
		return DB::table('subtasks')
				->where('id', $subtaskId)
				->where('task_id', $taskId)
				->update([
					'status'     => $status,
					'updated_at' => now(),
				]) > 0;
	}

	/**
	 * Insert nhiều subtasks cùng lúc (Tối ưu hiệu năng)
	 */
	public function insertMultiple(array $subtasks): bool
	{
		if (empty($subtasks)) {
			return false;
		}

		return DB::table('subtasks')->insert($subtasks);
	}
}