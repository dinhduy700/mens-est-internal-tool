<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Task;
use App\Http\Resources\TaskResource;
use App\Http\Requests\TaskRequest;
use App\Http\Requests\UpdateTaskDateRequest;
use App\Services\TaskService;

class TaskController extends Controller
{
	protected $taskService;

	public function __construct(TaskService $taskService)
	{
		$this->taskService = $taskService;
	}

	public function index(Request $request)
	{
		$filters = $request->all();

		$paginatedData = $this->taskService->getListTasks($filters);

		$responsePayload = TaskResource::collection($paginatedData)->response()->getData(true);

		return $this->successResponse($responsePayload, 'Lấy danh sách thành công');
	}

	public function store(TaskRequest $request)
	{
		$data = $request->validated();
		$task = $this->taskService->createTask($data);

		return $this->successResponse(new TaskResource($task), 'Tạo task thành công', 201);
	}

	public function show($id)
	{
		$task = $this->taskService->getTask($id);

		if (!$task) {
			return $this->errorResponse('Không tìm thấy task này', 404);
		}

		return $this->successResponse(new TaskResource($task), 'Chi tiết task');
	}

	public function updateDate(UpdateTaskDateRequest $request, $id)
	{
		$validatedData = $request->validated();

		$task = $this->taskService->updateTaskDate($id, $validatedData);

		if (!$task) {
			return $this->errorResponse('Không tìm thấy task', 404);
		}

		return $this->successResponse(
			new TaskResource($task),
			'Đã cập nhật cột ' . $validatedData['field'] . ' thành công!'
		);
	}

	public function update(TaskRequest $request, $id)
	{
		// 1. Lấy dữ liệu an toàn đã qua kiểm duyệt (và đã được tự động convert ngày tháng)
		$data = $request->validated();

		// 2. Chuyển cho Service xử lý
		$task = $this->taskService->updateTask($id, $data);

		// 3. Xử lý trường hợp không tìm thấy ID
		if (!$task) {
			return $this->errorResponse('Không tìm thấy task để cập nhật', 404);
		}

		// 4. Trả về Response thành công kèm data mới
		return $this->successResponse(new TaskResource($task), 'Cập nhật task thành công');
	}
}
