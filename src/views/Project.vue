<template>
  <div class="overflow-x">
    <div class="d-flex flex-column">
      <div>
        <div class="col-6">
          <h2>
            <i class="fa fa-bars"></i>
          </h2>
          <div class="v-divider">&nbsp;</div>
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

      <div class="d-flex sections-container">
        <div v-for="(section, index) in sections" class="container tasks-container">
          <div class="row mb-2" :style="{ background: section.colour }">
            <div class="col" style="width: 300px">
              <h5>{{ section.name }}</h5>
            </div>
          </div>
          <div
            class="row d-flex justify-content-center"
            v-for="task in sectionTasks[section._id]"
            v-if="section.tasks.length !== 0"
          >
            <div
              class="card w-75 d-flex text-center mb-2"
              style="cursor: pointer"
              data-bs-toggle="modal"
              data-bs-target=".task-modal"
              @click="
                selectedTaskId = task._id;
                selectedSectionName = section.name;
              "
            >
              <div class="container card-body">
                <div class="row mb-3">
                  <div class="col col-auto">{{ task.name }}</div>
                </div>
                <div class="row">
                  <div
                    class="col col-auto badge text-truncate"
                    v-for="tag in taskTags[task._id]"
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
          </div>
          <div class="row" v-else>
            <div class="col d-flex flex-column text-center">
              <strong>No tasks</strong>
              Drag tasks here or click +<br />
              to add new tasks.<br />
              <i class="fa fa-plus-circle"></i>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="row">
            <div class="col" style="width: 300px">
              <h5>
                <a href="#"><i class="fa fa-plus me-2"></i>Add section</a>
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
              :users="users"
              :id="selectedTaskId"
              :projectTags="tags"
              :sectionName="selectedSectionName"
              @taskChanged="updateTask"
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
              @tag-removed="removeTag"
              @tag-updated="updateTag"
            />
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

const selectedTaskId = ref('');

const selectedSectionName = ref('');

function updateTask({ task }: { task: Ref<Task> }) {
  Object.entries(sectionTasks.value).forEach(([sectionId, tasks]) => {
    tasks.forEach((task_, index) => {
      if (task_._id === task.value._id) {
        sectionTasks.value[sectionId][index] = task.value;
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
