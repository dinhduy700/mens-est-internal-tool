<?php

namespace App\Services;

use App\Repositories\SubtaskRepository;

class SubtaskService
{
	protected $subtaskRepository;

	public function __construct(SubtaskRepository $subtaskRepository)
	{
		$this->subtaskRepository = $subtaskRepository;
	}

	/**
	 * Xử lý logic tạo Subtask
	 */
	public function createSubtask(array $data)
	{
		// Nhờ rule 'exists:tasks,id' ở Request, ta chắc chắn task_id hợp lệ
		// Bạn có thể đẩy thẳng xuống Repository
		return $this->subtaskRepository->create($data);
	}

	/**
	 * Xử lý logic cập nhật Subtask
	 */
	public function updateSubtask(int $id, array $data)
	{
		// 1. Kiểm tra subtask có tồn tại không
		$subtask = $this->subtaskRepository->findById($id);

		if (!$subtask) {
			return null; // Trả về null để Controller biết là lỗi 404
		}

		// 2. Chuyển xuống Repository để lưu
		return $this->subtaskRepository->update($id, $data);
	}

	public function deleteSubtask(int $id): bool
	{
		// 1. Kiểm tra subtask có tồn tại không
		$subtask = $this->subtaskRepository->findById($id);

		if (!$subtask) {
			return false; // Báo lỗi không tìm thấy
		}

		// 2. Thực hiện xóa
		return $this->subtaskRepository->delete($id);
	}

	/**
	 * Xử lý logic cập nhật trạng thái Subtask
	 */
	public function updateStatus(int $id, int $status)
	{
		// 1. Kiểm tra xem subtask có tồn tại không
		$subtask = $this->subtaskRepository->findById($id);

		if (!$subtask) {
			return null;
		}

		// 2. Chuyển xuống Repository để lưu
		return $this->subtaskRepository->updateStatus($id, $status);
	}
}