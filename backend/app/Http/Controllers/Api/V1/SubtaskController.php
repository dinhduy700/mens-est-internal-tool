<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

use App\Http\Requests\SubtaskRequest;
use App\Http\Requests\UpdateSubtaskRequest;
use App\Http\Requests\UpdateSubtaskStatusRequest;
use App\Services\SubtaskService;
use App\Http\Resources\SubtaskResource;

class SubtaskController extends Controller
{
	protected $subtaskService;

	public function __construct(SubtaskService $subtaskService)
	{
		$this->subtaskService = $subtaskService;
	}

	/**
	 * Lưu subtask mới
	 */
	public function store(SubtaskRequest $request)
	{
		$data = $request->validated();

		$subtask = $this->subtaskService->createSubtask($data);

		return $this->successResponse(new SubtaskResource($subtask), 'Thêm subtask thành công', 201);
	}

	public function update(UpdateSubtaskRequest $request, $taskId, $id)
	{
		$data = $request->all();

		$subtask = $this->subtaskService->updateSubtask($taskId, $id, $data);

		if (!$subtask) {
			return $this->errorResponse('Không tìm thấy subtask để cập nhật', 404);
		}

		// Tái sử dụng SubtaskResource để bung Enum trạng thái ra
		return $this->successResponse(new SubtaskResource($subtask), 'Cập nhật subtask thành công');
	}

	/**
	 * Xóa 1 subtask
	 */
	public function destroy($taskId, $id)
	{
		$isDeleted = $this->subtaskService->deleteSubtask($taskId, $id);

		if (!$isDeleted) {
			return $this->errorResponse('Không tìm thấy subtask để xóa', 404);
		}

		// Trả về data là null kèm câu thông báo thành công
		return $this->successResponse(null, 'Xóa subtask thành công');
	}

	/**
	 * Cập nhật nhanh trạng thái của subtask (Inline Edit)
	 */
	public function updateStatus(UpdateSubtaskStatusRequest $request, $taskId, $id)
	{
		// Lấy status an toàn đã qua validate
		$data = $request->validated();

		$subtask = $this->subtaskService->updateStatus($taskId, $id, $data['status']);

		if (!$subtask) {
			return $this->errorResponse('Không tìm thấy subtask để cập nhật', 404);
		}

		// Trả về data đã qua Resource để format Enum
		return $this->successResponse(new SubtaskResource($subtask), 'Cập nhật trạng thái subtask thành công');
	}
}