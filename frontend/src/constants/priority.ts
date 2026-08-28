export enum Priority {
  LOW = 1,
  HIGH = 2,
  URGENT = 3,
}

export const PRIORITY_OPTIONS = [
  {
    value: Priority.LOW,
    label: 'Thấp',
    color: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  {
    value: Priority.HIGH,
    label: 'Cao',
    color: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    value: Priority.URGENT,
    label: 'Khẩn cấp',
    color: 'bg-rose-100 text-rose-800 border-rose-300'
  },
] as const;

export const getPriorityInfo = (priority: number | string | undefined) => {
  if (!priority) return null;

  // Nếu Backend trả về string dạng 'Urgent' / 'High' / 'Low' hoặc '1' / '2' / '3'
  const found = PRIORITY_OPTIONS.find((item) => {
    if (typeof priority === 'number') {
      return item.value === priority;
    }
    // So sánh linh hoạt theo Enum Key, Value hoặc Label string từ API
    return (
        item.value === Number(priority) ||
        item.label.toLowerCase() === priority.toLowerCase() ||
        Priority[item.value]?.toLowerCase() === priority.toLowerCase()
    );
  });

  return found || null;
};
