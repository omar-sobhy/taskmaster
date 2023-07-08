<template>
  <div class="container">
    <!-- Header -->
    <div class="row justify-content-between border-bottom border-dark">
      <div class="col-2">
        <input
          class="form-control border-0"
          :value="task.name"
          @change="(e: Event) => { task.name = (e.currentTarget as HTMLInputElement).value; }"
        />
      </div>
      <div class="col-4">
        <select class="form-select" v-model="task.assignee">
          <option :value="undefined" :selected="!!task.assignee">N/A</option>
          <option v-for="user in users" :value="user._id" :selected="user._id === task.assignee">
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
          class="form-control overflow-hidden taskmaster-textarea border-0"
          style="resize: none"
          v-model="task.description"
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
          <div class="row border-bottom border-dark">
            <div
              id="tags-dropdown-wrapper"
              class="col"
              @click="showTagDropdown"
              style="cursor: pointer"
            >
              <div class="container pb-2">
                <div class="row">
                  <div class="col d-flex align-items-center">
                    <i class="fa fa-tag"></i>
                    <div class="dropdown" id="tags-dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        aria-expanded="false"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="outside"
                      >
                        Tags
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#">Add tags</a>
                        </li>
                        <li v-for="tag in projectTags">
                          <a class="dropdown-item" href="#" @click="toggleTag(tag._id)">{{
                            tag.name
                          }}</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div>
                      <div
                        class="badge badge-pill"
                        v-for="tag in tags"
                        :style="{
                          'background-color': tag.colour,
                          color: tag.colour ? 'white' : 'black',
                        }"
                      >
                        {{ tag.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row border-bottom border-dark">
            <div class="col d-flex align-items-center">
              <i class="far fa-eye"></i>
              <span>Watchers</span>
              <div>
                <div class="badge badge-pill badge-primary" v-for="watcher in watchers">
                  {{ watcher.username }}
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col d-flex flex-column">
              <strong>{{ task.name }}</strong>
              <span>{{ sectionName }}</span>
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
import type { Tag, Task, User } from 'taskmaster-client';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { inject } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import moment from 'moment';
import type { ShowErrorMessageFunction } from 'src/types/ShowError.types';
import { Dropdown } from 'bootstrap';

const props = defineProps<{
  users: User[];
  id: string;
  projectTags: Tag[];
  sectionName: string;
}>();

const emit = defineEmits(['taskChanged']);

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

const newComment = ref('');

function showTagDropdown(e: Event) {
  const el = e.target as HTMLElement;
  if (el.dataset.bsToggle !== 'dropdown') {
    const dropdown = Dropdown.getOrCreateInstance('#tags-dropdown');
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
    } else {
      const tag = props.projectTags.find((t) => t._id === id)!;
      tags.value.push(tag);
    }
  } else {
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
  () => props.id,
  async (id: string) => {
    if (id && id !== '') {
      try {
        const getTasksDataResult = await apiClient.getTaskData(props.id);
        if (getTasksDataResult.type !== 'success') {
          throw getTasksDataResult.error.message;
        }

        task.value = getTasksDataResult.data;

        const getTagsDataResult = await apiClient.getTagsData(task.value.tags!);
        if (getTagsDataResult.type !== 'success') {
          throw getTagsDataResult.error.message;
        }

        tags.value = getTagsDataResult.data;

        const getUsersResult = await apiClient.getUserData(task.value.watchers!);
        if (getUsersResult.type !== 'success') {
          throw getUsersResult.error.message;
        }

        watchers.value = getUsersResult.data;
      } catch (error) {
        showError(error as string);
      }
    }
  },
);

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
</style>
