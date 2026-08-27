<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use App\Repositories\TaskRepository;
use App\Repositories\SubtaskRepository;

class TaskService
{
	protected $taskRepository;
	protected $subtaskRepository;

	public function __construct(TaskRepository $taskRepository, SubtaskRepository $subtaskRepository)
	{
		$this->taskRepository = $taskRepository;
		$this->subtaskRepository = $subtaskRepository;
	}

	public function getListTasks(array $filters)
	{
		$perPage = $filters['per_page'] ?? 10;

		return $this->taskRepository->getList($filters, $perPage);
	}

	public function createTask(array $data)
	{
		// Bắt đầu Transaction: An toàn tuyệt đối
		DB::beginTransaction();

		try {
			// 1. Lưu Task chính trước (để lấy ra task_id)
			$data['planned_dev_up'] = !empty($data['planned_dev_up']) ? Carbon::createFromFormat('d/m/Y', $data['planned_dev_up'])->format('Y-m-d') : null;
			$data['actual_dev_up'] = !empty($data['actual_dev_up']) ? Carbon::createFromFormat('d/m/Y', $data['actual_dev_up'])->format('Y-m-d') : null;
			$data['planned_start'] = !empty($data['planned_start']) ? Carbon::createFromFormat('d/m/Y', $data['planned_start'])->format('Y-m-d') : null;
			$data['actual_start'] = !empty($data['actual_start']) ? Carbon::createFromFormat('d/m/Y', $data['actual_start'])->format('Y-m-d') : null;
			$data['actual_end'] = !empty($data['actual_end']) ? Carbon::createFromFormat('d/m/Y', $data['actual_end'])->format('Y-m-d') : null;
			$data['release_date'] = !empty($data['release_date']) ? Carbon::createFromFormat('d/m/Y', $data['release_date'])->format('Y-m-d') : null;
			$task = $this->taskRepository->create($data);

			// 2. Xử lý Subtasks nếu người dùng có nhập vào Textarea
			if (!empty($data['subtasks_text'])) {

				// Tách chuỗi thành mảng dựa trên dấu xuống dòng (\n hoặc \r\n)
				$lines = preg_split('/\r\n|\r|\n/', $data['subtasks_text']);
				$subtasksToInsert = [];
				$now = now(); // Lấy thời gian chung cho tất cả

				// Lặp qua từng dòng để chuẩn bị data
				foreach ($lines as $line) {
					$title = trim($line); // Xóa khoảng trắng thừa ở 2 đầu

					// Bỏ qua những dòng trống (người dùng lỡ bấm Enter dư)
					if (!empty($title)) {
						$subtasksToInsert[] = [
							'task_id'    => $task->id, // Lấy ID của task vừa tạo
							'title'      => $title,
							'status'     => 1, // Mặc định status là To Do (hoặc số tương ứng của bạn)
							'created_at' => $now,
							'updated_at' => $now,
						];
					}
				}

				// Nếu có mảng subtask hợp lệ thì đẩy xuống Repo để insert 1 lượt
				if (!empty($subtasksToInsert)) {
					$this->subtaskRepository->insertMultiple($subtasksToInsert);
				}
			}

			// Mọi thứ hoàn hảo, lưu vĩnh viễn vào DB
			DB::commit();

			// Trả về task (nếu muốn trả về kèm subtask, bạn có thể gọi lại hàm getById có join subtask)
			return $task;

		} catch (\Exception $e) {
			// Nếu có bất kỳ lỗi gì (sai kiểu dữ liệu, rớt mạng DB...), Hủy toàn bộ!
			DB::rollBack();
			throw $e;
		}
	}

	public function getTask($id)
	{
		return $this->taskRepository->findById($id);
	}

	public function updateTaskDate(int $id, array $data)
	{
		$task = $this->taskRepository->findById($id);

		if (!$task) {
			return null;
		}

		return $this->taskRepository->updateField($id, $data['field'], Carbon::createFromFormat('d/m/Y', $data['date_value'])->format('Y-m-d'));
	}

	public function updateTask(int $id, array $data)
	{
		// 1. Kiểm tra task có tồn tại trong DB không
		$task = $this->taskRepository->findById($id);
		if (!$task) {
			return null; // Trả về null nếu không tìm thấy
		}

		// 2. Nếu tồn tại, đẩy dữ liệu xuống Repository để update
		$data['planned_dev_up'] = !empty($data['planned_dev_up']) ? Carbon::createFromFormat('d/m/Y', $data['planned_dev_up'])->format('Y-m-d') : null;
		$data['actual_dev_up'] = !empty($data['actual_dev_up']) ? Carbon::createFromFormat('d/m/Y', $data['actual_dev_up'])->format('Y-m-d') : null;
		$data['planned_start'] = !empty($data['planned_start']) ? Carbon::createFromFormat('d/m/Y', $data['planned_start'])->format('Y-m-d') : null;
		$data['actual_start'] = !empty($data['actual_start']) ? Carbon::createFromFormat('d/m/Y', $data['actual_start'])->format('Y-m-d') : null;
		$data['actual_end'] = !empty($data['actual_end']) ? Carbon::createFromFormat('d/m/Y', $data['actual_end'])->format('Y-m-d') : null;
		$data['release_date'] = !empty($data['release_date']) ? Carbon::createFromFormat('d/m/Y', $data['release_date'])->format('Y-m-d') : null;

		return $this->taskRepository->update($id, $data);
	}
}