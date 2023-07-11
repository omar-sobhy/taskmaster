<template>
  <div class="overflow-x">
    <div class="d-flex flex-column">
      <div>
        <div class="col-6">
          <div class="dropdown">
            <button
              class="btn dropdown-toggle"
              type="button"
              role="button"
              data-bs-toggle="dropdown"
            >
              {{ project.name }}
            </button>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item container" href="#">
                  <div
                    class="row gx-1"
                    data-bs-target=".project-settings-modal"
                    data-bs-toggle="modal"
                  >
                    <div class="col-auto"><i class="fa fa-cog"></i></div>
                    <span class="col">Project settings...</span>
                  </div>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item container" href="#">
                  <div class="row gx-1">
                    <div class="col-auto">
                      <i class="fa fa-trash"></i>
                    </div>
                    <span class="col">Deleted tasks...</span>
                  </div>
                </a>
              </li>
              <li>
                <a class="dropdown-item container" href="#">
                  <div class="row gx-1">
                    <div class="col-auto">
                      <i class="fa fa-archive"></i>
                    </div>
                    <span class="col">Archived tasks...</span>
                  </div>
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item container" href="#">
                  <div class="row gx-1">
                    <div class="col-auto">
                      <i class="fa fa-smile"></i>
                    </div>
                    <span class="col">Change icon...</span>
                  </div>
                </a>
              </li>
              <li>
                <a class="dropdown-item container" href="#">
                  <div class="row gx-1">
                    <div class="col-auto">
                      <i class="fa fa-image"></i>
                    </div>
                    <span class="col">Change background...</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Section -->
      <div class="d-flex sections-container">
        <div
          v-for="(section, index) in sections"
          class="container tasks-container"
          v-bind:key="section._id"
        >
          <!-- Section header -->
          <div
            class="row mb-2 section-header text-light"
            :style="{ background: section.colour }"
            @mouseenter="hoveringOver = index"
            @mouseleave="hoveringOver = -1"
          >
            <div class="col d-flex justify-content-between align-items-center" style="width: 300px">
              <span class="fs-5 my-2">{{ section.name }}</span>
              <div class="dropdown" :class="hoveringOver === index ? '' : 'd-none'">
                <a href="#" class="text-decoration-none text-light" data-bs-toggle="dropdown">
                  <i class="fas fa-ellipsis-h"></i>
                </a>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      <i class="fa fa-smile"></i>
                      Change icon
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      <i class="fa fa-pen"></i>
                      Add description</a
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item text-danger text-center"
                      href="#"
                      @click="showDeleteSectionModal(section)"
                    >
                      Delete section
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Section body -->
          <div class="h-100">
            <!-- Task row -->
            <div v-if="section.tasks.length !== 0">
              <div
                class="row d-flex justify-content-center"
                v-for="task in sectionTasks[section._id]"
                :key="task._id"
              >
                <!-- Task card -->
                <div
                  class="col col-auto card w-75 mb-2"
                  style="cursor: pointer"
                  data-bs-toggle="modal"
                  data-bs-target=".task-modal"
                  @click="
                    selectedTaskId = task._id;
                    selectedSectionName = section.name;
                  "
                >
                  <task-component
                    class="card-body"
                    :task="task"
                    :taskTags="taskTags"
                  ></task-component>
                </div>
              </div>
            </div>
            <div class="row" v-else>
              <div class="col d-flex flex-column text-center">
                <strong>No tasks</strong>
                Drag tasks here or click +<br />
                to add new tasks.<br />
              </div>
            </div>
            <div class="text-center">
              <a
                href="#"
                data-bs-toggle="modal"
                data-bs-target=".add-task-modal"
                @click="sectionIdForCreateTask = section._id"
              >
                <i class="fa fa-plus-circle"></i>
              </a>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col" style="width: 300px">
              <h5>
                <a
                  href="#"
                  class="text-decoration-none"
                  data-bs-toggle="modal"
                  data-bs-target=".create-section-modal"
                >
                  <i class="fa fa-plus me-2"></i>
                  Add section
                </a>
              </h5>
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
    <div class="modal project-settings-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Project settings</h5>
          </div>
          <div class="modal-body">
            <project-settings-component
              :project="project"
              :tags="tags"
              @tag-added="addTag"
              @tag-deleted="removeTag"
              @tag-updated="updateTag"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="modal add-task-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new task</h5>
          </div>
          <form>
            <div class="modal-body container">
              <div class="row mb-3">
                <label for="input-task-name" class="col-4 col-form-label">Task name</label>
                <div class="col-8">
                  <input
                    id="input-task-name"
                    class="form-control"
                    type="text"
                    required
                    v-model="newTask.name"
                  />
                  <div class="invalid-feedback">Task name cannot be empty.</div>
                </div>
              </div>
              <div class="row mb-3">
                <label for="input-duedate" class="col-4 col-form-label">Due date</label>
                <div class="col-8">
                  <input
                    id="input-duedate"
                    class="form-control"
                    type="date"
                    v-model="newTask.dueDate"
                  />
                </div>
              </div>
              <div class="row mb-3">
                <label for="input-assignee" class="col-4 col-form-label">Assignee</label>
                <div class="col-8">
                  <select id="input-assignee" class="form-control" v-model="newTask.assignee">
                    <option :value="undefined">N/A</option>
                    <option v-for="user in users" :value="user._id" :key="user._id">
                      {{ user.username }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" type="reset" data-bs-dismiss="modal">Cancel</button>
              <button
                class="btn btn-primary"
                type="submit"
                @click="
                  createTask($event, sectionIdForCreateTask, newTask.name, {
                    dueDate: newTask.dueDate,
                    assignee: newTask.assignee,
                  })
                "
              >
                Create task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal create-section-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create section</h5>
          </div>
          <div class="modal-body m-0 px-0">
            <create-section-component :project-id="project._id" @created="addSection" />
          </div>
        </div>
      </div>
    </div>
    <div class="modal delete-section-modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete section</h5>
          </div>
          <div class="modal-body text-danger"></div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-danger" @click="deleteSection" data-bs-dismiss="modal">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Client from 'taskmaster-client';
import type { Project, Section, Tag, Task, User } from 'taskmaster-client';
import { inject, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import ShowTaskComponent from '@/components/ShowTaskComponent.vue';
import type { ShowErrorMessageFunction } from 'src/types/ShowError.types';
import ProjectSettingsComponent from '@/components/ProjectSettingsComponent.vue';
import CreateSectionComponent from '@/components/CreateSectionComponent.vue';
import TaskComponent from '@/components/TaskComponent.vue';

import moment from 'moment';
import { Modal } from 'bootstrap';

const route = useRoute();

const apiClient: Client = inject('$apiClient')!;
const showError: ShowErrorMessageFunction = inject('showError')!;

const project = ref<Project>({
  _id: '',
  background: '',
  name: '',
  sections: [],
  tags: [],
  users: [],
});

const sections = ref<Section[]>([]);

const sectionTasks = ref<Record<string, Task[]>>({});

const taskTags = ref<Record<string, Tag[]>>({});

const users = ref<User[]>([]);

const tags = ref<Tag[]>([]);

const newTask = ref<{ name: string; assignee?: string; dueDate?: Date }>({
  name: '',
  assignee: undefined,
  dueDate: undefined,
});

const selectedTaskId = ref('');

const selectedSectionName = ref('');

const sectionIdForCreateTask = ref('');

const hoveringOver = ref(-1);

function updateTask({ task }: { task: Task }) {
  Object.entries(sectionTasks.value).forEach(([sectionId, tasks]) => {
    tasks.forEach((task_, index) => {
      if (task_._id === task._id) {
        sectionTasks.value[sectionId][index] = task;
      }
    });
  });
}

function addTag({ tag }: { tag: Tag }) {
  project.value.tags.push(tag._id);
  tags.value.push(tag);
}

function removeTag({ tag }: { tag: Tag }) {
  const idx = project.value.tags.findIndex((t) => t === tag._id);
  project.value.tags.splice(idx, 1);
}

function updateTag({ tag }: { tag: Tag }) {
  const idx = tags.value.findIndex((t) => t._id === tag._id);
  tags.value[idx] = tag;

  Object.values(taskTags.value).forEach((tags) => {
    tags.forEach((tag_) => {
      if (tag_._id === tag._id) {
        Object.assign(tag_, tag);
      }
    });
  });
}

function updateTaskTags({ taskId, tags }: { taskId: string; tags: Ref<Tag[]> }) {
  taskTags.value[taskId] = tags.value;
}

async function createTask(
  event: Event,
  sectionId: string,
  name: string,
  { dueDate, assignee }: Partial<{ dueDate: Date; assignee: string }>,
) {
  const nameEl = document.getElementById('input-task-name') as HTMLInputElement;

  if (!nameEl.checkValidity()) {
    return;
  }

  event.preventDefault();

  const date = dueDate ? moment(dueDate).format('YYYY-DD-MM') : undefined;

  try {
    const createTaskResult = await apiClient.createTask(sectionId, name, date, assignee);
    if (createTaskResult.type !== 'success') {
      throw createTaskResult.error.message;
    }

    sectionTasks.value[sectionId].push(createTaskResult.data);
  } catch (error) {
    showError(error as string);
  }
}

function addSection({ section }: { section: Section }) {
  project.value.sections.push(section._id);
  sections.value.push(section);

  const modalEl = document.querySelector('.create-section-modal')!;

  Modal.getOrCreateInstance(modalEl).hide();
}

function showDeleteSectionModal(section: Section) {
  const modalEl = document.querySelector('.delete-section-modal')!;

  const bodyEl = modalEl.querySelector('.modal-dialog > .modal-content > div.modal-body')!;

  bodyEl.textContent = `${section.tasks.length} active tasks will be deleted.`;

  Modal.getOrCreateInstance(modalEl).show();

  modalEl.setAttribute('data-section-id', section._id);
}

async function deleteSection() {
  try {
    const modalEl = document.querySelector('.delete-section-modal')!;

    const sectionId = modalEl.getAttribute('data-section-id')!;

    const result = await apiClient.deleteSection(sectionId);

    if (result.type === 'success') {
      const projectSectionIdx = project.value.sections.findIndex((s) => s === sectionId);
      project.value.sections.splice(projectSectionIdx, 1);

      const idx = sections.value.findIndex((s) => s._id === sectionId);
      sections.value.splice(idx, 1);
    }
  } catch (error) {
    showError(error as string);
  }
}

onMounted(async () => {
  try {
    const getProjectResult = await apiClient.getProject(route.params.projectId as string);
    if (getProjectResult.type === 'error') {
      throw `Error getting project information: '${getProjectResult.error.message}'`;
    }
    project.value = getProjectResult.data;

    const getSectionsResult = await apiClient.getProjectSections(route.params.projectId as string);
    if (getSectionsResult.type === 'error') {
      throw `Error getting sections information: '${getSectionsResult.error.message}'`;
    }

    sections.value = getSectionsResult.data;

    const tasksPromises = getSectionsResult.data.map(async (s) => {
      const tasks = await apiClient.getTasks(s._id);
      if (tasks.type === 'success') {
        sectionTasks.value[s._id] = tasks.data;
      }
    });

    const getUserDataResult = await apiClient.getUserData(project.value.users);
    if (getUserDataResult.type === 'error') {
      throw `Error getting user information: '${getUserDataResult.error.message}'`;
    }

    users.value = getUserDataResult.data;

    const getTagsResult = await apiClient.getTagsData(project.value.tags);
    if (getTagsResult.type === 'error') {
      throw `Error getting tags information: ${getTagsResult.error.message}`;
    }

    tags.value = getTagsResult.data;

    const tasksTagsPromises = Object.values(sectionTasks.value)
      .map((tasks) => {
        return tasks.map(async (task) => {
          const getTagsResult = await apiClient.getTagsData(task.tags);

          if (getTagsResult.type !== 'success') {
            throw getTagsResult.error.message;
          }

          taskTags.value[task._id] = getTagsResult.data;

          return getTagsResult;
        });
      })
      .flat(1);
  } catch (error) {
    showError(error as string);
  }
});
</script>

<style scoped>
.sections-container > :nth-child(odd of .tasks-container) {
  background-color: var(--bs-gray-300);
}

.sections-container > :nth-child(even of .tasks-container) {
  background-color: white;
}
</style>
