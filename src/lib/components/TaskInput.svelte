<script lang="ts">
  import { onMount } from 'svelte';
  import { addTask } from '$lib/store';
  
  let taskInput = '';
  let inputElement: HTMLInputElement;
  
  function handleSubmit() {
    if (taskInput.trim()) {
      addTask(taskInput.trim());
      taskInput = '';
      // Re-focus the input after submission
      setTimeout(() => {
        inputElement?.focus();
      }, 0);
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      taskInput = '';
    }
  }
  
  onMount(() => {
    // Auto-focus the input when the component mounts
    inputElement?.focus();
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="task-input" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Captura rápida
      </label>
      <input
        bind:this={inputElement}
        id="task-input"
        type="text"
        bind:value={taskInput}
        on:keydown={handleKeydown}
        placeholder="¿Qué hay en tu mente? Presiona Enter para capturar"
        class="input"
        autocomplete="off"
      />
    </div>
    
    <div class="flex justify-between items-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        <span class="hidden sm:inline">Enter: Agregar</span>
        <span class="hidden sm:inline ml-2">| Esc: Cancelar</span>
      </p>
      
      <button 
        type="submit" 
        class="btn btn-primary"
        disabled={!taskInput.trim()}
      >
        Agregar tarea
      </button>
    </div>
  </form>
</div>