<template>
  <div class="container">
    <div class="row" :class="{ 'mb-3': taskTags[task._id]?.length !== 0 }">
      <div class="col col-auto text-start">{{ task.name }}</div>
    </div>
    <div class="row">
      <div class="col col-auto px-1" v-for="tag in taskTags[task._id]" :key="tag._id">
        <div
          class="badge text-truncate"
          style="max-width: 100px"
          :style="{
            'background-color': tag.colour,
            color: tag.colour ? undefined : 'black',
          }"
        >
          {{ tag.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, Tag } from 'taskmaster-client';

defineProps<{ task: Task; taskTags: Record<string, Tag[]> }>();
</script>
