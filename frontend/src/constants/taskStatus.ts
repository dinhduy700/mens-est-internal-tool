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
  { value: TaskStatus.NEW, label: 'New', color: 'bg-gray-100 text-gray-800 border-gray-300', dotColor: 'bg-slate-400' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-300', dotColor: 'bg-blue-400' },
  { value: TaskStatus.IN_REVIEW, label: 'In Review', color: 'bg-purple-100 text-purple-800 border-purple-300', dotColor: 'bg-purple-400' },
  { value: TaskStatus.NEED_FIX, label: 'Need Fix', color: 'bg-red-100 text-red-800 border-red-300', dotColor: 'bg-red-400' },
  { value: TaskStatus.REVIEW_DONE, label: 'Review Done', color: 'bg-teal-100 text-teal-800 border-teal-300', dotColor: 'bg-teal-400' },
  { value: TaskStatus.DEV_UP, label: 'DevUp', color: 'bg-orange-100 text-orange-800 border-orange-300', dotColor: 'bg-orange-400' },
  { value: TaskStatus.RELEASE, label: 'Release', color: 'bg-green-100 text-green-800 border-green-300', dotColor: 'bg-green-400' },
] as const;

export const getStatusBadgeConfig = (status: number | string | undefined | null) => {
  const numStatus = Number(status);
  const matched = TASK_STATUS_OPTIONS.find((item) => item.value === numStatus);

  if (matched) {
    return {
      badgeClass: matched.color,
      dotColor: matched.dotColor,
      label: matched.label,
    };
  }

  return {
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
    dotColor: 'bg-gray-400',
    label: 'Unknown',
  };
};

