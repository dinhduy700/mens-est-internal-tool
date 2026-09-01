import { apiClient } from './api';
import { TaskStatus } from '../constants/taskStatus';
import { Priority } from '../constants/priority';

// Dữ liệu truyền lên khi tạo Task mới
export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
}

export interface UpdateTaskDto {
  title: string;
  redmine_url?: string;
  status: TaskStatus | number;
  priority: Priority | number;
  planned_dev_up?: string;
  actual_dev_up?: string;
  actual_start?: string;
  actual_end?: string;
  release_date?: string;
  blocker?: boolean;
  note?: string;
}

// Dữ liệu truyền lên khi tạo Subtask mới
export interface CreateSubtaskDto {
  task_id: number | string; // ID của task cha
  title: string;
  status?: TaskStatus | number;
  note?: string;
}

export interface UpdateSubtaskDto {
  title?: string;
  status?: number | string;
  notes?: string;
}

// Dữ liệu truyền lên khi cập nhật Status của Subtask
export interface UpdateSubtaskStatusDto {
  status: TaskStatus | number;
}

// Dữ liệu truyền lên khi cập nhật Ngày của Task
export interface UpdateTaskDateDto {
  field: string;      // Tên cột ngày (ví dụ: 'planned_dev_up', 'release', ...)
  date_value: string; // Giá trị ngày (định dạng 'YYYY-MM-DD' hoặc '' nếu xóa)
}

export const taskService = {
  getTasks: async () => {
    const response = await apiClient.get('/tasks');
    return response.data; // Trả về data từ Backend
  },

  // Hàm tạo Task mới
  createTask: async (data: CreateTaskDto) => {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  // Hàm cập nhật toàn bộ thông tin Task (PUT hoặc PATCH /tasks/{id})
  updateTask: async (taskId: number | string, data: UpdateTaskDto) => {
    const response = await apiClient.put(`/tasks/${taskId}`, data);
    return response.data;
  },

  // Hàm tạo mới Subtask (POST /subtasks)
  createSubtask: async (data: CreateSubtaskDto) => {
    const response = await apiClient.post('/subtasks', data);
    return response.data;
  },

  // Hàm cập nhật toàn bộ Subtask (PUT /tasks/{taskId}/subtasks/{subtaskId})
  updateSubtask: async (
      taskId: number | string,
      subtaskId: number | string,
      data: UpdateSubtaskDto
  ) => {
    const response = await apiClient.put(
        `/tasks/${taskId}/subtasks/${subtaskId}`,
        data
    );
    return response.data;
  },

  // Hàm xóa Subtask (DELETE /tasks/{taskId}/subtasks/{subtaskId})
  deleteSubtask: async (taskId: number | string, subtaskId: number | string) => {
    const response = await apiClient.delete(
        `/tasks/${taskId}/subtasks/${subtaskId}`
    );
    return response.data;
  },

  // Hàm cập nhật trạng thái Subtask (PATCH /tasks/{taskId}/subtasks/{subtaskId}/status)
  updateSubtaskStatus: async (
      taskId: number | string,
      subtaskId: number | string,
      status: TaskStatus | number
  ) => {
    const response = await apiClient.patch(
        `/tasks/${taskId}/subtasks/${subtaskId}/status`,
        { status }
    );
    return response.data;
  },

  // Hàm cập nhật ngày của Task (PATCH /tasks/{taskId}/update-date)
  updateTaskDate: async (
      taskId: number | string,
      field: string,
      dateValue: string
  ) => {
    const response = await apiClient.patch(`/tasks/${taskId}/update-date`, {
      field: field,
      date_value: dateValue,
    });
    return response.data;
  },
};