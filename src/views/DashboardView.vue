<template>
  <div class="container border rounded-5 p-3" id="taskmaster-container">
    <div class="row">
      <div class="col cols-3">
        <div class="col">
          <div class="col">
            <h5>Dashboard</h5>
          </div>
        </div>
        <div class="row border-row">
          <div class="col">
            <h5>Agenda</h5>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col">
                <h5>Your projects</h5>
              </div>
              <div class="col" style="text-align: right">
                <a href="#" @click="showModal">
                  <i class="fa fa-plus"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-for="(project, index) in projects" :key="project._id">
          <div class="col">
            <a
              class="project-link w-100 d-block rounded-2 text-decoration-none"
              href="#"
              @click="handleProjectRedirect($event, index)"
            >
              {{ project.name }}
            </a>
          </div>
        </div>
      </div>
      <div class="col cols-3" id="info">
        <h1>Welcome {{ userStore.username }}</h1>
        <h2>{{ date }}</h2>
        <h2>{{ time }}</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua...
      </div>

      <div class="col cols-3">
        <div class="row">
          <div class="col">
            <h5>My Tasks <i class="fa fa-arrow-down"></i></h5>
            <div
              class="card mb-3"
              v-for="task in userTasks"
              :key="task._id"
              style="cursor: pointer"
              data-bs-toggle="modal"
              data-bs-target=".task-modal"
              @click="selectedTaskId = task._id"
            >
              <task-component class="card-body" :task="task" :task-tags="taskTags"></task-component>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>My checklist</h5>
            <div class="rounded-2"><i class="fa fa-plus-circle"></i> Add...</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>Due today</h5>
            <div class="rounded-2">Lorem Ipsum...</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>Unscheduled</h5>
            <div style="border-radius: 5px">Lorem Ipsum...</div>
          </div>
        </div>
      </div>
      <div class="col cols-3">
        <div class="row">
          <div class="col">
            <h5>Your notifications</h5>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div style="border-radius: 5px; margin-top: 10px; margin-bottom: 10px">
              First notification
            </div>
            <div style="border-radius: 5px">Second notification</div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add project</h5>
          </div>
          <div class="modal-body">
            <div class="container">
              <div class="row mb-3">
                <div class="col">Project name</div>
                <div class="col">
                  <input id="project-name-input" class="w-100 form-control" v-model="projectName" />
                  <div class="invalid-feedback">
                    Project name must be at least 4 characters long.
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col">Project background</div>
                <div class="col">
                  <div class="container">
                    <div class="row gy-2 row-cols-4">
                      <a
                        class="col d-flex justify-content-center rounded-5 text-decoration-none"
                        href="#"
                        @click="setSelected(index)"
                        v-for="(colour, index) in colours"
                        :key="index"
                      >
                        <div
                          class="w-75"
                          :class="{ 'focus-ring': colour === selectedColour }"
                          style="
                            border-radius: 50%;
                            --bs-focus-ring-width: 2px;
                            --bs-focus-ring-color: black;
                          "
                          :style="styles[index]"
                          tabindex="-1"
                        >
                          &nbsp;
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" class="btn btn-primary" @click="createProject">OK</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal modal-lg task-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body pt-3 p-0">
          <show-task-component
            :id="selectedTaskId"
            @taskChanged="updateTask"
            @taskTagsChanged="updateTaskTags"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { Modal } from 'bootstrap';
import moment from 'moment';
import type { Project, Section, Tag, Task, User } from 'taskmaster-client';
import { reactive, ref } from 'vue';
import Client from 'taskmaster-client';
import { inject } from 'vue';
import { onMounted } from 'vue';
import type { ShowErrorMessageFunction } from '@/types/ShowError.types';
import { useRouter } from 'vue-router';
import TaskComponent from '@/components/TaskComponent.vue';
import ShowTaskComponent from '@/components/ShowTaskComponent.vue';

const userStore = useUserStore();

const colours = [
  '#ff0000',
  '#0000ff',
  '#008000',
  '#ffd700',
  '#008080',
  '#ffa500',
  '#00008b',
  '#483d8b',
];

const styles = ref(
  colours.map((c) => {
    return reactive({
      background: c,
      border: '',
    });
  }),
);

const apiClient: Client = inject('$apiClient')!;
const showError: ShowErrorMessageFunction = inject('showError')!;

const router = useRouter();

let projects = ref<Project[]>([]);
let userTasks = ref<Task[]>([]);
let taskTags = ref<Record<string, Tag[]>>({});

// map taskId to parent section
const taskSections = ref<Record<string, Section>>({});

const selectedTaskId = ref('');

let projectName = '';
let selectedColour = '';

let date = ref(moment().format('dddd DD/MM/YYYY'));
let time = ref(moment().format('HH:mm:ss'));

function showModal() {
  const modal = Modal.getOrCreateInstance(document.querySelector('.modal')!);
  modal.show();
}

function hideModal() {
  const modal = Modal.getOrCreateInstance(document.querySelector('.modal')!);
  modal.hide();
}

function setSelected(idx: number) {
  for (let i = 0; i < styles.value.length; ++i) {
    if (i !== idx) {
      styles.value[i]['border'] = '';
    }
  }

  selectedColour = colours[idx];
}

async function createProject() {
  const result = await apiClient.createProject(projectName, selectedColour);
  if (result.type === 'success') {
    console.log('Project created successfully');
    projects.value.push(result.data);
    hideModal();
  } else {
    if (result.error.message.includes('name')) {
      document.querySelector('#project-name-input')!.classList.add('is-invalid');
    } else {
      showError(result.error.message);
    }
  }
}

function handleProjectRedirect(event: Event, index: number) {
  event.preventDefault();
  event.stopPropagation();
  router.push(`/projects/${projects.value[index]._id}`);
}

function updateTask() {}

function updateTaskTags() {}

function getUsersForTask(taskId: string) {
  const section = taskSections.value[taskId];
  const project = projects.value.find((p) => p._id === section._id)!;
  return project.users;
}

onMounted(async () => {
  try {
    const projectsResult = await apiClient.getProjects();
    if (projectsResult.type === 'error') {
      throw projectsResult.error.message;
    }

    projects.value = projectsResult.data;

    const getTasksResult = await apiClient.getTasks();
    if (getTasksResult.type === 'error') {
      throw getTasksResult.error.message;
    }

    userTasks.value = getTasksResult.data;

    const taskPromises = userTasks.value.map(async (t) => {
      const sectionResult = await apiClient.getSection(t.section);
      if (sectionResult.type === 'success') {
        return { taskId: t._id, section: sectionResult.data };
      }

      return Promise.reject(sectionResult);
    });

    const tasks = await Promise.all(taskPromises);

    tasks.forEach(({ taskId, section }) => {
      taskSections.value[taskId] = section;
    });

    const tagPromises = userTasks.value.map(async (task) => {
      const getTagsDataResult = await apiClient.getTagsData(task.tags);
      if (getTagsDataResult.type === 'error') {
        return Promise.reject(getTagsDataResult);
      }

      return { taskId: task._id, tags: getTagsDataResult.data };
    });

    (await Promise.all(tagPromises)).forEach(({ taskId, tags }) => {
      taskTags.value[taskId] = tags;
    });
  } catch (error) {
    showError(error as string);
  }
});

// setInterval(() => {
//   time.value = moment().format('HH:mm:ss');
//   date.value = moment().format('dddd DD/MM/YYYY');
// }, 1000);
</script>

<style scoped>
.project-link:hover {
  background-color: var(--bs-gray-300);
}

#taskmaster-container {
  background-color: var(--bs-gray-400);
}
</style>
