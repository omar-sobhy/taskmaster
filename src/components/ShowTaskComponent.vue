<template>
  <div class="container">
    <!-- Header -->
    <div class="row justify-content-between border-bottom border-dark">
      <div class="col">
        <textarea
          class="form-control border-0 overflow-hidden taskmaster-textarea"
          :value="task.name"
          style="resize: none"
          @change="(e: Event) => { task.name = (e.currentTarget as HTMLInputElement).value; }"
          @keydown="
            (event) => {
              updateTextAreaHeight();
            }
          "
        ></textarea>
      </div>
      <div class="col col-4">
        <select class="form-select" v-model="task.assignee">
          <option :value="undefined" :selected="!!task.assignee">N/A</option>
          <option
            v-for="user in users"
            :value="user._id"
            :selected="user._id === task.assignee"
            :key="user._id"
          >
            {{ user.username }}
          </option>
        </select>
      </div>
    </div>
    <div class="row">
      <!-- Task description / activity pane -->
      <div class="col-7 border-end border-dark">
        <textarea
          placeholder="This task has no description."
          class="form-control overflow-hidden taskmaster-textarea border-0 my-2"
          style="resize: none"
          :value="task.description"
          @change="(event) => { task.description = (event.target as HTMLInputElement).value }"
          @keydown="(event) => { 
            if ((event as KeyboardEvent).code === 'Enter' && !(event as KeyboardEvent).ctrlKey) {
              task.description = (event.target as HTMLInputElement).value;
              (event.target as HTMLElement).blur();
            } else if ((event as KeyboardEvent).code === 'Enter' && (event as KeyboardEvent).ctrlKey) {
              (event.target as HTMLInputElement).value += '\n';
              updateTextAreaHeight();
            }
          }"
        ></textarea>
        <span>Activity <i class="fas fa-caret-down"></i></span>
        <textarea
          class="form-control overflow-hidden taskmaster-textarea border-0"
          style="resize: none"
          v-model="newComment"
          placeholder="Add comment"
        >
        </textarea>
      </div>
      <!-- Task information pane (due date, watchers, tags, create/updated, id) -->
      <div class="col">
        <div class="container g-0">
          <div class="row align-items-center border-bottom border-dark">
            <div class="col-5">
              <i class="far fa-calendar"></i>
              <label for="task-due-date">Due date</label>
            </div>
            <div class="col-7">
              <VueDatePicker
                id="task-due-date"
                v-model="task.dueDate"
                @update:model-value="updateDueDate"
                :format="formatDate"
                :clearable="true"
              >
              </VueDatePicker>
            </div>
          </div>
          <!-- Tags -->
          <div class="row border-bottom border-dark">
            <button
              class="btn container pb-2"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              data-bs-target="#tags-dropdown"
              style="border: none"
            >
              <div class="row pb-2">
                <div class="col d-flex align-items-center">
                  <i class="fa fa-tag"></i>
                  <div class="dropdown" id="tags-dropdown">
                    Tags
                    <i class="fas fa-caret-down"></i>
                    <ul class="dropdown-menu" style="width: 290px">
                      <li>
                        <a class="dropdown-item" href="#">Add tags</a>
                      </li>
                      <li v-for="tag in projectTags" :key="tag._id">
                        <a class="dropdown-item text-truncate" href="#" @click="toggleTag(tag._id)">
                          {{ tag.name }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!-- Badges -->
              <div class="row ps-2">
                <div
                  class="col col-auto badge badge-pill me-2 mb-2 text-truncate"
                  v-for="tag in tags"
                  :key="tag._id"
                  style="max-width: 10rem"
                  :style="{
                    'background-color': tag.colour,
                    color: tag.colour ? 'white' : 'black',
                  }"
                >
                  {{ tag.name }}
                </div>
              </div>
            </button>
          </div>
          <!-- Watchers -->
          <div class="row border-bottom border-dark">
            <button
              class="btn col d-flex align-items-center"
              style="border: none"
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              data-bs-target="#watchers-dropdown"
            >
              <i class="far fa-eye"></i>
              <div class="dropdown" id="watchers-dropdown">
                Watchers
                <i class="fas fa-caret-down"></i>
                <ul class="dropdown-menu px-2" style="width: 290px">
                  <li>
                    <input
                      type="text"
                      class="form-control border-info mb-3"
                      placeholder="Find person"
                    />
                  </li>
                  <li v-for="user in users" :key="user._id">
                    <a class="dropdown-item" href="#">{{ user.username }}</a>
                  </li>
                </ul>
              </div>
              <div>
                <div
                  class="badge badge-pill badge-primary"
                  v-for="watcher in watchers"
                  :key="watcher._id"
                >
                  {{ watcher.username }}
                </div>
              </div>
            </button>
          </div>
          <div class="row">
            <div class="col d-flex flex-column">
              <span>{{ section.name }}</span>
              <div class="container p-0">
                <div class="row">
                  <div class="col col-1 d-flex flex-row align-items-center">
                    <i class="fa fa-plus-circle"></i>
                  </div>
                  <div class="col"><strong>Created</strong></div>
                </div>
                <div class="row">
                  <div class="col offset-1">
                    {{ formatDate(task.created) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col offset-1">
                    {{ formatTime(task.created) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col col-1 d-flex flex-row align-items-center">
                    <i class="fa fa-pen"></i>
                  </div>
                  <div class="col"><strong>Updated</strong></div>
                </div>
                <div class="row">
                  <div class="col offset-1">
                    {{ formatDate(task.updated) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col offset-1">
                    {{ formatTime(task.updated) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col col-1 d-flex flex-row align-items-center">
                    <i class="fas fa-link"></i>
                  </div>
                  <div class="col"><strong>Task ID</strong></div>
                </div>
                <div class="row">
                  <div class="col offset-1">
                    {{ task._id }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Client from 'taskmaster-client';
import type { Section, Tag, Task, User } from 'taskmaster-client';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { inject } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import moment from 'moment';
import type { ShowErrorMessageFunction } from 'src/types/ShowError.types';
import { Dropdown } from 'bootstrap';

const props = defineProps<{
  id: string;
}>();

const emit = defineEmits(['taskChanged', 'taskTagsChanged']);

const apiClient: Client = inject('$apiClient')!;
const showError: ShowErrorMessageFunction = inject('showError')!;

const task = ref<Partial<Task>>({
  _id: '',
  assignee: '',
  checklistItems: [],
  comments: [],
  created: undefined,
  description: '',
  dueDate: undefined,
  historyItems: [],
  name: '',
  tags: [],
  updated: undefined,
  watchers: [],
});

const tags = ref<Tag[]>([]);

const watchers = ref<User[]>([]);

const section = ref<Partial<Section>>({});

const projectTags = ref<Tag[]>([]);

const users = ref<User[]>([]);

const newComment = ref('');

function showTagDropdown(e: Event) {
  const el = e.target as HTMLElement;
  if (el.dataset.bsToggle !== 'dropdown') {
    const el = document.getElementById('tags-dropdown')!;
    const dropdown = Dropdown.getOrCreateInstance(el);
    dropdown.toggle();
  }
}

async function updateDueDate(modelData: any) {
  const result = await apiClient.updateTask(props.id, {
    dueDate: modelData ? moment(modelData).format('YYYY-MM-DD') : null,
  });

  if (result.type !== 'success') {
    showError(result.error.message);
  }
}

function formatDate(date?: Date) {
  return moment(date).format('DD/MM/YYYY');
}

function formatTime(date?: Date) {
  return moment(date).format('hh:mm a');
}

async function toggleTag(id: string) {
  const newTags = tags.value.map((t) => t._id);

  const type = task.value.tags?.find((t) => t === id) ? 'remove' : 'add';

  if (type === 'remove') {
    const index = newTags.findIndex((t) => t === id);
    newTags.splice(index, 1);
  } else {
    newTags.push(id);
  }

  const result = await apiClient.updateTask(props.id, {
    tags: newTags,
  });

  if (result.type === 'success') {
    if (type === 'remove') {
      const index = tags.value.findIndex((t) => t._id === id);
      tags.value.splice(index, 1);
      task.value.tags?.splice(index, 1);
    } else {
      const tag = projectTags.value.find((t) => t._id === id)!;
      tags.value.push(tag);
      task.value.tags?.push(id);
    }

    emit('taskTagsChanged', {
      taskId: props.id,
      tags: tags,
    });
  } else {
    showError(`An error occurred while toggling tag: ${result.error.message}`);
  }
}

watch(
  () => task.value.assignee as string,
  async (assignee: string) => {
    const updateTaskResult = await apiClient.updateTask(props.id, {
      assignee: assignee === '' || assignee === undefined ? null : assignee,
    });

    if (updateTaskResult.type !== 'success') {
      showError(updateTaskResult.error.message);
    }
  },
);

watch(
  () => task.value.name as string,
  async (name: string) => {
    const updateTaskResult = await apiClient.updateTask(props.id, {
      name,
    });

    if (updateTaskResult.type !== 'success') {
      showError(updateTaskResult.error.message);
    } else {
      emit('taskChanged', {
        task,
      });
    }
  },
);

watch(
  () => task.value as Task,
  async (task: Task) => {
    emit('taskChanged', {
      task,
    });
  },
);

watch(
  () => task.value.description,
  async (description?: string) => {
    const updateTaskResult = await apiClient.updateTask(props.id, {
      description,
    });

    if (updateTaskResult.type !== 'success') {
      showError(updateTaskResult.error.message);
    } else {
      emit('taskChanged', {
        task,
      });
    }
  },
);

watch(
  () => props.id,
  async (id: string) => {
    if (id && id !== '') {
      try {
        const getTasksDataResult = await apiClient.getTaskData(props.id);
        if (getTasksDataResult.type !== 'success') {
          throw getTasksDataResult.error.message;
        }

        task.value = getTasksDataResult.data;

        const getSectionResult = await apiClient.getSection(getTasksDataResult.data.section);
        if (getSectionResult.type === 'error') {
          throw getSectionResult.error;
        }

        section.value = getSectionResult.data;

        const getProjectResult = await apiClient.getProject(getSectionResult.data.project);
        if (getProjectResult.type === 'error') {
          throw getProjectResult.error.message;
        }

        const getUsersResult = await apiClient.getUserData(getProjectResult.data.users);
        if (getUsersResult.type === 'error') {
          throw getUsersResult.error.message;
        }

        users.value = getUsersResult.data;

        const getProjectTagsResult = await apiClient.getTagsData(getProjectResult.data.tags);
        if (getProjectTagsResult.type === 'error') {
          throw getProjectTagsResult.error.message;
        }

        projectTags.value = getProjectTagsResult.data;

        const getTaskTagsDataResult = await apiClient.getTagsData(task.value.tags!);
        if (getTaskTagsDataResult.type !== 'success') {
          throw getTaskTagsDataResult.error.message;
        }

        tags.value = getTaskTagsDataResult.data;

        const getWatchersResult = await apiClient.getUserData(task.value.watchers!);
        if (getWatchersResult.type !== 'success') {
          throw getWatchersResult.error.message;
        }

        watchers.value = getWatchersResult.data;

        updateTextAreaHeight();
      } catch (error) {
        showError(error as string);
      }
    }
  },
);

function updateTextAreaHeight() {
  const textAreas = document.querySelectorAll('.taskmaster-textarea');
  textAreas.forEach((t) => {
    t.setAttribute(
      'style',
      `height: ${t.scrollHeight}px; overflow-y: hidden; resize: none; width: 100%;`,
    );
  });
}

onMounted(() => {
  const textAreas = document.querySelectorAll('.taskmaster-textarea');
  textAreas.forEach((t) => {
    t.addEventListener(
      'input',
      function (this: HTMLTextAreaElement) {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      },
      false,
    );
  });
});
</script>

<style>
.dp__input {
  height: 4rem;
}

.taskmaster-textarea:focus {
  outline: 1px solid grey;
}

.taskmaster-textarea:hover {
  background-color: var(--bs-gray-200);
}
</style>
