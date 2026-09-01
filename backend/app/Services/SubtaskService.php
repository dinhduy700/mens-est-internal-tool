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
	public function updateSubtask(int $taskId, int $id, array $data)
	{
		$subtask = $this->subtaskRepository->findByIdAndTaskId($taskId, $id);

		if (!$subtask) {
			return null;
		}

		return $this->subtaskRepository->update($taskId, $id, $data);
	}

	public function deleteSubtask(int $taskId, int $id): bool
	{
		$subtask = $this->subtaskRepository->findByIdAndTaskId($taskId, $id);

		if (!$subtask) {
			return false;
		}

		// 2. Thực hiện xóa
		return $this->subtaskRepository->delete($taskId, $id);
	}

	/**
	 * Xử lý logic cập nhật trạng thái Subtask
	 */
	public function updateStatus(int $taskId, int $id, int $status)
	{
		$subtask = $this->subtaskRepository->findByIdAndTaskId($taskId, $id);

		if (!$subtask) {
			return null;
		}

		if ((int)$subtask->status === $status) {
			return $subtask;
		}

		$this->subtaskRepository->updateStatus($taskId, $id, $status);

		$subtask->status = $status;
		$subtask->updated_at = now()->toDateTimeString();

		return $subtask;
	}

}