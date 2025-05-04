export type TaskCategory = 'ideas' | 'actions' | 'projects' | 'someday' | 'unclassified';

export interface Task {
  id: string;
  content: string;
  category: TaskCategory;
  createdAt: string;
}

export type Filter = TaskCategory | 'all';