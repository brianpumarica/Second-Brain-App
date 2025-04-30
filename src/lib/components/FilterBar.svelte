<script lang="ts">
  import { activeFilter } from '$lib/store';
  import { fly } from 'svelte/transition';
  
  const filters = [
    { id: 'all', label: 'Todo' },
    { id: 'actions', label: 'Acciones' },
    { id: 'ideas', label: 'Ideas' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'someday', label: 'Algún día' }
  ];
</script>

<div 
  in:fly={{ y: 10, duration: 300 }}
  class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm mb-6 overflow-x-auto"
>
  <div class="flex space-x-2 min-w-max">
    {#each filters as filter}
      <button 
        class="filter-btn {$activeFilter === filter.id ? 'filter-btn-active' : 'filter-btn-inactive'}"
        on:click={() => activeFilter.set(filter.id)}
        aria-pressed={$activeFilter === filter.id}
      >
        {filter.label}
      </button>
    {/each}
  </div>
</div>