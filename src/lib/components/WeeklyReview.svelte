<script lang="ts">
  import { weeklyReviewTasks } from '$lib/store';
  import TaskItem from './TaskItem.svelte';
  import { fade } from 'svelte/transition';
</script>

<div class="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
  <h3 class="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3">
    Revisión Semanal
  </h3>
  
  <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
    Tareas sin clasificar por más de 7 días. Es buen momento para revisarlas y organizarlas.
  </p>
  
  {#if $weeklyReviewTasks.length === 0}
    <div in:fade={{ duration: 300 }} class="py-4 text-center text-gray-500 dark:text-gray-400">
      ¡Bien hecho! No tienes tareas sin clasificar por más de 7 días.
    </div>
  {:else}
    <ul class="space-y-3 mt-4">
      {#each $weeklyReviewTasks as task (task.id)}
        <li in:fade={{ duration: 300 }}>
          <TaskItem {task} />
        </li>
      {/each}
    </ul>
  {/if}
</div>