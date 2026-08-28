import { apiClient } from './api';
import { TaskStatus } from '../constants/taskStatus';
import { Priority } from '../constants/priority';

// Dữ liệu truyền lên khi tạo Task mới
export interface CreateTaskDto {
  taskCode: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
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
};