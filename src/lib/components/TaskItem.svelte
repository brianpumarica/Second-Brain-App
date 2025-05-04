<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import type { Task } from "$lib/types";
  import {
    deleteTask,
    updateTaskCategory,
    updateTaskNotification,
  } from "$lib/store";
  import { formatDistanceToNow, format } from "date-fns";
  import { es } from "date-fns/locale";
  import flatpickr from "flatpickr";
  import Flatpickr from "svelte-flatpickr";
  import "flatpickr/dist/flatpickr.css";
  import { onMount } from "svelte";

  export let task: Task;

  let showCategoryOptions = false;
  let showNotificationPicker = false;
  let datePickerInput: HTMLInputElement;
  let flatpickrInstance: any;
  let selectedDate: Date | null = null;
  let isDeleting = false;

  onMount(() => {
    if (isBrowser) {
      requestNotificationPermission();

      // Eliminar notificación si ya pasó
      if (
        task.notification?.datetime &&
        isNotificationExpired(task.notification.datetime)
      ) {
        updateTaskNotification(task.id, null);
        task.notification = null; // actualizar en memoria también
      }
    }
  });

  const isBrowser = typeof window !== "undefined";

  async function requestNotificationPermission() {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  }

  function isNotificationExpired(timestamp: number): boolean {
    return timestamp < Date.now();
  }

  function setupNotification(
    timestamp: number,
    task: { id: string; content: string },
  ) {
    if (!("Notification" in window)) {
      console.warn("Este navegador no soporta notificaciones");
      return;
    }
    if (!task || !task.id || !task.content) {
      console.warn("No se proporcionó una tarea válida");
      return;
    }

    const now = Date.now();
    const delay = timestamp - now;

    if (delay > 0) {
      setTimeout(() => {
        // Solicitar permiso y luego ejecutar la notificación
        Notification.requestPermission().then((permission) => {
          if (permission !== "granted") {
            console.warn("No se otorgó permiso para notificaciones.");
            return;
          }

          const notification = new Notification("Recordatorio de tarea", {
            body: task.content,
            icon: "/vite.svg",
            badge: "/vite.svg",
            tag: task.id,
            renotify: true,
            requireInteraction: true,
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        });
      }, delay);
    }
  }

  function handleNotificationUpdate(selectedDates: Date[]) {
    const selectedDate = selectedDates[0];
    if (selectedDate) {
      const datetime = selectedDate.getTime(); // guardas como timestamp local
      updateTaskNotification(task.id, datetime);
      setupNotification(datetime, task);
    }
    showNotificationPicker = false;
  }

  function initDatePicker() {
    if (datePickerInput && !flatpickrInstance) {
      flatpickrInstance = flatpickr(datePickerInput, {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        minDate: "today",
        defaultDate: task.notification?.datetime,
        onChange: handleNotificationUpdate,
        appendTo: datePickerInput.parentElement,
      });
    }
  }

  function handleDelete() {
    isDeleting = true;
    setTimeout(() => deleteTask(task.id), 300); // Espera la duración del fade
  }

  function getRelativeTime(dateString: string): string {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: es,
    });
  }

  function getCategoryLabel(category: string): string {
    const labels = {
      ideas: "Idea",
      actions: "Acción",
      projects: "Proyecto",
      someday: "Algún día",
      unclassified: "Sin clasificar",
    };
    return labels[category] || "Sin clasificar";
  }

  function getCategoryColor(category: string): string {
    const colors = {
      ideas: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      actions:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      projects:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      someday:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      unclassified:
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100",
    };
    return colors[category] || colors.unclassified;
  }
</script>

<div class="task-card relative group">
  <!-- Task Content -->
  <div class="flex items-start">
    <button
      on:click={handleDelete}
      class="mt-1 mr-2 flex-shrink-0 h-5 w-5 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500
      {isDeleting
        ? 'bg-primary-500 border-primary-500'
        : 'border-gray-300 dark:border-gray-600'} "
      aria-label="Eliminar tarea"
    >
      {#if isDeleting}
        <span class="flex items-center justify-center text-white text-xs"
          >✓</span
        >
      {/if}
    </button>
    <div
      class="flex-1 {isDeleting
        ? 'line-through text-gray-500 dark:text-gray-400'
        : ''}"
    >
      <p class="break-words">{task.content}</p>
    </div>
  </div>

  <!-- Task Metadata -->
  <div class="mt-3 flex flex-wrap items-center justify-between text-xs">
    <div class="flex items-center space-x-2 mb-2 sm:mb-0">
      <span class="text-gray-500 dark:text-gray-400">
        {getRelativeTime(task.createdAt)}
      </span>

      <button
        on:click={() => (showCategoryOptions = !showCategoryOptions)}
        class="px-2 py-1 rounded-full text-xs font-medium {getCategoryColor(
          task.category,
        )}"
      >
        {getCategoryLabel(task.category)}
      </button>

      {#if task.notification?.datetime && !isNotificationExpired(task.notification.datetime)}
        <span class="text-primary-600 dark:text-primary-400">
          🔔 {format(new Date(task.notification.datetime), "dd/MM/yyyy HH:mm")}
        </span>
      {/if}
    </div>

    <!-- Action Buttons -->
    <div class="flex space-x-2">
      <button
        on:click={() => {
          showNotificationPicker = !showNotificationPicker;
          if (showNotificationPicker) {
            setTimeout(initDatePicker, 0);
          }
        }}
        class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        aria-label="Set notification"
      >
        {task.notification?.enabled
          ? "Editar recordatorio"
          : "Agregar recordatorio"}
      </button>
    </div>
  </div>

  <!-- Notification Picker -->
  {#if showNotificationPicker}
    <div
      transition:fade={{ duration: 150 }}
      class="absolute z-50 mt-2 right-0 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
    >
      <Flatpickr
        bind:value={selectedDate}
        options={{
          enableTime: true,
          dateFormat: "Y-m-d H:i",
          minDate: "today",
          defaultDate: task.notification?.datetime,
          onClose: handleNotificationUpdate,
        }}
        class="input"
        placeholder="Selecciona fecha y hora"
      />
      <button
        class="mt-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        on:click={() => {
          updateTaskNotification(task.id, null);
          selectedDate = null;
          showNotificationPicker = false;
        }}
      >
        🗑️ Borrar recordatorio
      </button>
    </div>
  {/if}

  <!-- Category Selection Dropdown -->
  {#if showCategoryOptions}
    <div
      transition:fade={{ duration: 150 }}
      class="absolute z-50 mt-2 left-0 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 p-1"
    >
      <div class="py-1 grid grid-cols-1 gap-1">
        {#each ["ideas", "actions", "projects", "someday", "unclassified"] as category}
          <button
            class="px-4 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {task.category ===
            category
              ? 'bg-gray-100 dark:bg-gray-700 font-medium'
              : ''}"
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
