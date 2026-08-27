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
	public function update(int $id, array $data)
	{
		$updateData = [
			'title'      => $data['title'],
			'status'     => $data['status'],
			'note'       => $data['note'] ?? null,
			'updated_at' => now(), // Cập nhật thời gian sửa
		];

		DB::table('subtasks')->where('id', $id)->update($updateData);

		// Lấy lại dữ liệu mới nhất để trả về
		return $this->findById($id);
	}

	public function delete(int $id): bool
	{
		// Hàm delete() của Query Builder sẽ trả về số lượng dòng bị xóa
		// Nếu > 0 nghĩa là xóa thành công
		return DB::table('subtasks')->where('id', $id)->delete() > 0;
	}

	/**
	 * Cập nhật riêng trạng thái của 1 subtask
	 */
	public function updateStatus(int $id, int $status)
	{
		DB::table('subtasks')
			->where('id', $id)
			->update([
				'status'     => $status,
				'updated_at' => now(), // Luôn nhớ cập nhật thời gian sửa
			]);

		// Lấy lại dữ liệu subtask mới nhất để trả về
		return $this->findById($id);
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