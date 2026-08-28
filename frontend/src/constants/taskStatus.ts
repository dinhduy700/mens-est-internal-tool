export enum TaskStatus {
  NEW = 1,
  IN_PROGRESS = 2,
  IN_REVIEW = 3,
  NEED_FIX = 4,
  REVIEW_DONE = 5,
  DEV_UP = 6,
  RELEASE = 7,
}

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.NEW, label: 'New', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: TaskStatus.NEED_FIX, label: 'Need Fix', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: TaskStatus.REVIEW_DONE, label: 'Review Done', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { value: TaskStatus.DEV_UP, label: 'DevUp', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { value: TaskStatus.RELEASE, label: 'Release', color: 'bg-green-100 text-green-800 border-green-300' },
] as const;

export const getStatusBadgeConfig = (status: number | string | undefined | null): StatusBadgeConfig => {
  const numStatus = Number(status);

  // Tìm option khớp với status
  const matched = TASK_STATUS_OPTIONS.find((item) => item.value === numStatus);

  if (matched) {
    // Trích xuất class màu nền (bg-xxx-100) để làm màu cho dotColor
    const bgClass = matched.color.split(' ').find((c) => c.startsWith('bg-')) || 'bg-gray-400';
    // Đổi độ đậm màu từ bg-xxx-100 thành bg-xxx-500 cho chấm tròn nổi bật
    const dotColor = bgClass.replace('-100', '-500');

    return {
      badgeClass: matched.color,
      dotColor: dotColor,
      label: matched.label,
    };
  }

  // Fallback mặc định nếu status không tồn tại hoặc bị null/undefined
  return {
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
    dotColor: 'bg-gray-400',
    label: 'Unknown',
  };
};
