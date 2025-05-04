<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import TaskInput from "$lib/components/TaskInput.svelte";
  import TaskItem from "$lib/components/TaskItem.svelte";
  import FilterBar from "$lib/components/FilterBar.svelte";
  import WeeklyReview from "$lib/components/WeeklyReview.svelte";
  import {
    filteredTasks,
    taskCount,
    activeFilter,
    isDarkMode,
  } from "$lib/store";

  let showWeeklyReview = false;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<div class="container mx-auto px-4 py-8 max-w-3xl">
  <header class="mb-8 text-center relative">
    <button
      class="absolute right-0 top-0 p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/90 dark:hover:bg-gray-700/90 backdrop-blur-sm transition-all transform hover:scale-105"
      on:click={() => isDarkMode.update((v) => !v)}
      aria-label="Cambiar tema"
    >
      {#if $isDarkMode}
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          />
        </svg>
      {:else}
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          />
        </svg>
      {/if}
    </button>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
      Libera tu mente.
    </h1>
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">
      Organiza tu segundo cerebro.
    </h1>
    <p class="text-gray-600 dark:text-gray-400">
      Captura rápidamente tus pensamientos e ideas
    </p>

    {#if mounted}
      <div in:fly={{ y: -20, duration: 500 }} class="mt-4">
        <p class="text-sm text-primary-600 dark:text-primary-400">
          Has capturado <span class="font-semibold">{$taskCount}</span>
          {$taskCount === 1 ? "pensamiento" : "pensamientos"}
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
            {$activeFilter === "all"
              ? "No hay tareas aún. ¡Agrega una!"
              : `No hay tareas en la categoría "${$activeFilter}"`}
          </p>
        </div>
      {:else}
        <ul class="space-y-3">
          {#each $filteredTasks as task (task.id)}
            <li
              class="animate-fadeIn"
              in:fly={{ y: 10, duration: 300, delay: 50 }}
              out:fade={{ duration: 300 }}
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
        on:click={() => (showWeeklyReview = !showWeeklyReview)}
      >
        {showWeeklyReview
          ? "Ocultar revisión semanal"
          : "Mostrar revisión semanal"}
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
