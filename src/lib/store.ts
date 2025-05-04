import { writable, derived } from 'svelte/store';
import type { Task, TaskCategory, Filter } from './types';
import { subDays, parseISO } from 'date-fns';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Load tasks from localStorage if available
const storedTasks = isBrowser ? localStorage.getItem('tasks') : null;
const initialTasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

// Theme store
export const isDarkMode = writable(isBrowser ? localStorage.getItem('theme') === 'dark' : false);

if (isBrowser) {
  isDarkMode.subscribe(value => {
    localStorage.setItem('theme', value ? 'dark' : 'light');
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
}

// Create the tasks store
export const tasks = writable<Task[]>(initialTasks);

// Create active filter store
export const activeFilter = writable<Filter>('all');

// Create a derived store for filtered tasks
export const filteredTasks = derived(
  [tasks, activeFilter],
  ([$tasks, $activeFilter]) => {
    if ($activeFilter === 'all') {
      return $tasks;
    }
    return $tasks.filter(task => task.category === $activeFilter);
  }
);

// Create a derived store for weekly review (tasks unclassified for more than 7 days)
export const weeklyReviewTasks = derived(tasks, ($tasks) => {
  const sevenDaysAgo = subDays(new Date(), 7);

  return $tasks.filter(task => {
    const taskDate = parseISO(task.createdAt);
    return task.category === 'unclassified' && taskDate < sevenDaysAgo;
  });
});

// Save tasks to localStorage whenever they change
if (isBrowser) {
  tasks.subscribe($tasks => {
    localStorage.setItem('tasks', JSON.stringify($tasks));
  });
}

// Create a store for task count
export const taskCount = derived(tasks, $tasks => $tasks.length);

// Task actions
export function addTask(content: string) {
  const newTask: Task = {
    id: generateId(),
    content,
    category: 'unclassified',
    createdAt: new Date().toISOString(),
  };

  tasks.update(tasks => [newTask, ...tasks]);
}

export function deleteTask(id: string) {
  tasks.update(tasks => tasks.filter(task => task.id !== id));
}

export function updateTaskCategory(id: string, category: TaskCategory) {
  tasks.update(tasks =>
    tasks.map(task =>
      task.id === id
        ? { ...task, category }
        : task
    )
  );
}

export function updateTaskContent(id: string, content: string) {
  tasks.update(tasks =>
    tasks.map(task =>
      task.id === id
        ? { ...task, content }
        : task
    )
  );
}
export function updateTaskNotification(id: string, datetime: string | null) {
  tasks.update(tasks => 
    tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            notification: datetime ? {
              datetime,
              enabled: true
            } : undefined
          } 
        : task
    )
  );
}
// Helper function to generate a unique ID
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}