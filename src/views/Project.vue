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
                  <div class="row gx-1">
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
          <div class="row" :style="{ background: section.colour }">
            <div class="col" style="width: 300px">
              <h5>{{ section.name }}</h5>
            </div>
          </div>
          <div
            class="row"
            v-for="task in sectionTasks[section._id]"
            v-if="sectionTasks[section._id].length !== 0"
          >
            <div class="col d-flex justify-content-center mb-2">
              {{ task.name }}
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
    <div class="modal"></div>
    <div class="modal"></div>
  </div>
</template>

<script setup lang="ts">
import type Client from 'taskmaster-client';
import type { Project, Section, Task } from 'taskmaster-client';
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const apiClient: Client = inject('$apiClient')!;

const project = ref<Project>({
  _id: '',
  background: '',
  name: '',
  sections: [],
  tags: [],
  users: [],
});

const sections = ref<Section[]>();

const sectionTasks = ref<Record<string, Task[]>>({});

onMounted(async () => {
  const getProjectResult = await apiClient.getProject(route.params.projectId as string);
  if (getProjectResult.type === 'success') {
    project.value = getProjectResult.data;

    const getSectionsResult = await apiClient.getProjectSections(route.params.projectId as string);
    if (getSectionsResult.type === 'success') {
      sections.value = getSectionsResult.data;

      const promises = getSectionsResult.data.map(async (s) => {
        const tasks = await apiClient.getTasks(s._id);
        if (tasks.type === 'success') {
          sectionTasks.value[s._id] = tasks.data;
        } else {
        }
      });
    }
  }
});
</script>

<style scoped>
.sections-container > :nth-child(odd of .tasks-container) {
  background-color: #f2f4f5;
}

.sections-container > :nth-child(even of .tasks-container) {
  background-color: #ebeff0;
}
</style>
