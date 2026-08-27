export type TaskStatus = 'TODO' | 'DOING' | 'DONE' | 'BLOCKED';

export interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
  assignee?: string;
  notes?: string;
  createdAt: string;
}

export type DateFieldType = 
  | 'planDevUp'
  | 'actDevUp'
  | 'createdAt'
  | 'actStart'
  | 'actEnd'
  | 'releaseDate';

export interface Task {
  id: string;
  taskCode: string;
  title: string;
  redmineUrl: string;
  subtasks: SubTask[];
  status: TaskStatus;
  planDevUp: string;       // YYYY-MM-DD format (empty string if not set)
  actDevUp: string;        // YYYY-MM-DD format
  createdAt: string;       // YYYY-MM-DD format
  actStart: string;        // YYYY-MM-DD format
  actEnd: string;          // YYYY-MM-DD format
  releaseDate: string;     // YYYY-MM-DD format
  hasBlocker: boolean;
  blockerDescription: string;
  note: string;
  assignee?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export type SortField = 'createdAt' | 'releaseDate' | 'taskCode' | 'title' | 'status' | 'planDevUp' | 'actDevUp';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  status: TaskStatus | 'ALL';
  hasBlocker: boolean | 'ALL';
  sortField: SortField;
  sortOrder: SortOrder;
  currentTab: 'overview' | 'myTasks' | 'teamBacklog' | 'milestones' | 'archive';
}

export interface DateEditModalState {
  isOpen: boolean;
  taskId: string;
  taskCode: string;
  fieldName: DateFieldType;
  fieldLabel: string;
  currentValue: string;
}

export interface TaskEditModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  targetFocus?: 'redmine' | 'all';
}

export interface SubtaskModalState {
  isOpen: boolean;
  parentTaskId: string;
  parentTaskCode: string;
  subtask?: SubTask;
  mode: 'add' | 'edit';
}

export interface BlockerModalState {
  isOpen: boolean;
  taskId: string;
  taskCode: string;
  hasBlocker: boolean;
  blockerDescription: string;
}

export interface NoteModalState {
  isOpen: boolean;
  taskId: string;
  taskCode: string;
  note: string;
}
