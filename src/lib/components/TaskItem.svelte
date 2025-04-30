<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import type { Task } from '$lib/types';
  import { deleteTask, updateTaskCategory, toggleTaskCompletion, updateTaskContent } from '$lib/store';
  import { formatDistanceToNow } from 'date-fns';
  import { es } from 'date-fns/locale';
  
  export let task: Task;
  
  let isEditing = false;
  let editedContent = task.content;
  let showCategoryOptions = false;
  
  function handleEdit() {
    isEditing = true;
    editedContent = task.content;
    // Focus the input after a short delay to allow the DOM to update
    setTimeout(() => {
      const editInput = document.getElementById(`edit-${task.id}`) as HTMLInputElement;
      editInput?.focus();
    }, 10);
  }
  
  function handleUpdate() {
    if (editedContent.trim()) {
      updateTaskContent(task.id, editedContent.trim());
      isEditing = false;
    }
  }
  
  function handleDelete() {
    // Show a small confirmation before deleting
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      deleteTask(task.id);
    }
  }
  
  function getRelativeTime(dateString: string): string {
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: es
    });
  }
  
  function getCategoryLabel(category: string): string {
    const labels = {
      'ideas': 'Idea',
      'actions': 'Acción',
      'projects': 'Proyecto',
      'someday': 'Algún día',
      'unclassified': 'Sin clasificar'
    };
    return labels[category] || 'Sin clasificar';
  }
  
  function getCategoryColor(category: string): string {
    const colors = {
      'ideas': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      'actions': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      'projects': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      'someday': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      'unclassified': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'
    };
    return colors[category] || colors.unclassified;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleUpdate();
    } else if (event.key === 'Escape') {
      isEditing = false;
    }
  }
</script>

<div class="task-card relative group">
  <!-- Task Content -->
  {#if isEditing}
    <div in:fade={{ duration: 200 }} class="mb-2">
      <input 
        id="edit-{task.id}"
        type="text" 
        bind:value={editedContent}
        on:keydown={handleKeydown}
        on:blur={handleUpdate}
        class="input"
      />
    </div>
  {:else}
    <div class="flex items-start">
      <button 
        on:click={() => toggleTaskCompletion(task.id)}
        class="mt-1 mr-2 flex-shrink-0 h-5 w-5 rounded-full border-2 {task.completed ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-600'} transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {#if task.completed}
          <span class="flex items-center justify-center text-white text-xs">✓</span>
        {/if}
      </button>
      
      <div class="flex-1 {task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}">
        <p class="break-words">{task.content}</p>
      </div>
    </div>
  {/if}
  
  <!-- Task Metadata -->
  <div class="mt-3 flex flex-wrap items-center justify-between text-xs">
    <div class="flex items-center space-x-2 mb-2 sm:mb-0">
      <span class="text-gray-500 dark:text-gray-400">
        {getRelativeTime(task.createdAt)}
      </span>
      
      <button 
        on:click={() => showCategoryOptions = !showCategoryOptions}
        class="px-2 py-1 rounded-full text-xs font-medium {getCategoryColor(task.category)}"
      >
        {getCategoryLabel(task.category)}
      </button>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex space-x-2">
      {#if !isEditing}
        <button 
          on:click={handleEdit}
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          aria-label="Edit task"
        >
          Editar
        </button>
      {/if}
      
      <button 
        on:click={handleDelete}
        class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        aria-label="Delete task"
      >
        Eliminar
      </button>
    </div>
  </div>
  
  <!-- Category Selection Dropdown -->
  {#if showCategoryOptions}
    <div 
      transition:fade={{ duration: 150 }}
      class="absolute z-10 mt-2 left-0 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 p-1"
    >
      <div class="py-1 grid grid-cols-1 gap-1">
        {#each ['ideas', 'actions', 'projects', 'someday', 'unclassified'] as category}
          <button
            class="px-4 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {task.category === category ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}"
            on:click={() => {
              updateTaskCategory(task.id, category);
              showCategoryOptions = false;
            }}
          >
            {getCategoryLabel(category)}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>