import { Task, TaskStatus } from '../types';

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '' || dateStr === '-') {
    return '-';
  }
  
  // Accept YYYY-MM-DD or DD/MM/YYYY or ISO
  try {
    if (dateStr.includes('/')) {
      return dateStr;
    }
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1];
      const day = parts[2].substring(0, 2);
      const shortYear = year.length === 4 ? year.substring(2) : year;
      return `${day}/${month}/${shortYear}`;
    }
  } catch {
    return dateStr;
  }
  return dateStr;
}

export function formatDateForInput(dateStr: string): string {
  if (!dateStr || dateStr === '-') return '';
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // If DD/MM/YY or DD/MM/YYYY
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      let year = parts[2];
      if (year.length === 2) {
        year = '20' + year;
      }
      return `${year}-${month}-${day}`;
    }
  }
  return dateStr;
}

export function getStatusBadgeConfig(status: TaskStatus) {
  switch (status) {
    case 'DONE':
      return {
        label: 'Hoàn thành',
        shortLabel: 'Done',
        bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-500',
        badgeClass: 'bg-emerald-100/70 text-emerald-800 border border-emerald-300/60',
      };
    case 'DOING':
      return {
        label: 'Đang làm',
        shortLabel: 'Doing',
        bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-600',
        badgeClass: 'bg-blue-100/80 text-blue-800 border border-blue-300/60',
      };
    case 'BLOCKED':
      return {
        label: 'Bị chặn',
        shortLabel: 'Blocked',
        bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
        dotColor: 'bg-rose-600',
        badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300/60',
      };
    case 'TODO':
    default:
      return {
        label: 'Chưa làm',
        shortLabel: 'To Do',
        bgColor: 'bg-slate-100 text-slate-700 border-slate-200',
        dotColor: 'bg-slate-400',
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300/60',
      };
  }
}

export function computeTaskStats(tasks: Task[]) {
  let todoCount = 0;
  let doingCount = 0;
  let doneCount = 0;
  let blockedCount = 0;
  let nearDeadlineCount = 0;

  const today = new Date().toISOString().split('T')[0];

  tasks.forEach((t) => {
    if (t.status === 'DONE') {
      doneCount++;
    } else if (t.status === 'DOING') {
      doingCount++;
    } else if (t.status === 'BLOCKED') {
      blockedCount++;
    } else {
      todoCount++;
    }

    if (t.hasBlocker && t.status !== 'BLOCKED') {
      blockedCount++;
    }

    // Check near deadline (within 3 days of releaseDate or planDevUp)
    if (t.releaseDate && t.status !== 'DONE') {
      const release = new Date(t.releaseDate).getTime();
      const now = new Date(today).getTime();
      const diffDays = (release - now) / (1000 * 3600 * 24);
      if (diffDays >= 0 && diffDays <= 4) {
        nearDeadlineCount++;
      }
    }
  });

  return {
    todoCount,
    doingCount,
    doneCount,
    blockedCount,
    nearDeadlineCount,
    total: tasks.length,
  };
}

export const formatDateToDMY = (dateStr: string | null | undefined): string => {
  // 1. Kiểm tra nếu rỗng, null hoặc undefined
  if (!dateStr || dateStr.trim() === '') return '';

  // 2. Nếu ĐÃ LÀ dạng "DD/MM/YYYY" sẵn rồi (chứa dấu /) -> Giữ nguyên, trả về luôn
  if (dateStr.includes('/')) {
    return dateStr;
  }

  // 3. Nếu là dạng "YYYY-MM-DD" từ input date (chứa dấu -) -> Convert sang "DD/MM/YYYY"
  if (dateStr.includes('-')) {
    // Tách phần ngày bỏ phần giờ ISO (nếu có)
    const cleanDate = dateStr.split('T')[0];
    const parts = cleanDate.split('-');

    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
  }

  return dateStr;
};
