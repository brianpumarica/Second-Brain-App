<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import TaskInput from '$lib/components/TaskInput.svelte';
  import TaskItem from '$lib/components/TaskItem.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';
  import WeeklyReview from '$lib/components/WeeklyReview.svelte';
  import { filteredTasks, taskCount, activeFilter } from '$lib/store';

  let showWeeklyReview = false;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
  <header class="mb-8 text-center">
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
      Libera tu mente. Organiza tu segundo cerebro.
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Captura rápidamente tus pensamientos e ideas
    </p>
    
    {#if mounted}
      <div in:fly={{ y: -20, duration: 500 }} class="mt-4">
        <p class="text-sm text-primary-600 dark:text-primary-400">
          Has capturado <span class="font-semibold">{$taskCount}</span> {$taskCount === 1 ? 'pensamiento' : 'pensamientos'}
        </p>
      </div>
    {/if}
  </header>
  
  <main>
    <section class="mb-8">
      <TaskInput />
    </section>
    
    <section class="mb-6">
      <FilterBar />
    </section>
    
    <section>
      {#if $filteredTasks.length === 0}
        <div class="text-center py-12" in:fade={{ duration: 300 }}>
          <p class="text-gray-500 dark:text-gray-400">
            {$activeFilter === 'all' 
              ? 'No hay tareas aún. ¡Agrega una!'
              : `No hay tareas en la categoría "${$activeFilter}"`}
          </p>
        </div>
      {:else}
        <ul class="space-y-3">
          {#each $filteredTasks as task (task.id)}
            <li 
              class="animate-fadeIn"
              in:fly={{ y: 10, duration: 300, delay: 50 }}
              out:fade={{ duration: 200 }}
            >
              <TaskItem {task} />
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  </main>
  
  <footer class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
    <div class="flex justify-between items-center">
      <button 
        class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
        on:click={() => showWeeklyReview = !showWeeklyReview}
      >
        {showWeeklyReview ? 'Ocultar revisión semanal' : 'Mostrar revisión semanal'}
      </button>
      
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Second Brain © {new Date().getFullYear()}
      </p>
    </div>
    
    {#if showWeeklyReview}
      <div transition:fade={{ duration: 300 }} class="mt-4">
        <WeeklyReview />
      </div>
    {/if}
  </footer>
</div>