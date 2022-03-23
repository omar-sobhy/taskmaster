<template>
  <div>
    <div>
      <b-row class="header">
        <div class="col-xs-6">
            <h2>
              <div class="menu-button-container">
                <b-icon-list
                  id="menu-button"
                />
              </div>
            </h2>
          </div>
          <div class="v-divider">
            &nbsp;
          </div>
          <div class="project-name">
            <h2>{{selectedProject.name}}</h2>
          </div>
          <div
            class="project-name-arrow"
            style="display: flex; align-items: center; cursor: pointer;"
          >
            <b-icon-arrow-down style="margin: 0;"/>
          </div>
      </b-row>
    </div>
    <div class="container-fluid">
      <b-row no-gutters>
        <b-col
          v-for="(section, index) in sectionsData"
          :key="section._id"
          :style="{ background: index % 2 === 0 ? '#f2f4f5' : '#ebeff0' }"
          class="section-column"
        >
          <h4 class="section-header" :style="{ background: section.colour }">
            <input
              v-model="section.name"
              style="border: 0px; margin-left: 15px; outline: none; font-weight: bold"
              :style="{ background: section.colour }"
              @change="updateSectionName(section._id, section.name)"
            />
          </h4>
          <div class="tasks-container">
            <div v-if="section.tasks.length === 0" style="text-align: center">
              <b>No tasks</b><br>
              Drag tasks here or click + <br>to add new tasks.
            </div>
            <div v-else class="w-75">
              <div v-for="task in tasksData[section._id]" :key="task._id"
                class="w-100 task"
                style="cursor: pointer;"
                @click="selectedSectionForTaskView = section; selectedTaskId = task._id;"
                v-b-modal.show-task-modal
              >
                {{ task.name }}
              </div>
            </div>
            <b-icon-plus-circle
              style="cursor: pointer;"
              @click="addTaskSectionId = section._id"
              v-b-modal.add-task-modal
            />
          </div>
        </b-col>
      </b-row>
    </div>
    <b-modal
      id="show-task-modal"
      hide-footer
      hide-header
      size="lg"
    >
      <show-task-component
        :taskId="selectedTaskId"
        :users="selectedProject.users"
        :projectName="selectedProject.name"
        @task-updated="onTaskUpdated"
        :section="selectedSectionForTaskView"
      >
      </show-task-component>
    </b-modal>

    <b-modal
      id="add-task-modal"
      hide-footer
      style="padding-bottom: 0px;"
    >
      <b-container>
        <b-row align-h="center" no-gutters>
          <add-task-component
            :users="selectedProject.users"
            @ok="handleAddTask"
            @cancel="handleCancel"
          >
          </add-task-component>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Project from 'taskmaster-client/build/entities/Project';
import Section from 'taskmaster-client/build/entities/Section';
import Task from 'taskmaster-client/build/entities/Task';
import { Vue, Component } from 'vue-property-decorator';
import AddTaskComponent from '../components/AddTaskComponent.vue';
import ShowTaskComponent from '../components/ShowTaskComponent.vue';

@Component({
  props: {
    projectId: String,
  },
  components: {
    AddTaskComponent,
    ShowTaskComponent,
  },
})
export default class ProjectView extends Vue {
  selectedProject: Project = {
    _id: '',
    name: '',
    background: '',
    users: [],
    sections: [],
  };

  sectionsData: Array<Section> = [];

  // map from sectionId to Task[]
  tasksData: Record<string, Task[]> = {};

  projectId!: string;

  newTask: { name: string | null, dueDate: string, assignee: string } = {
    name: null,
    dueDate: '',
    assignee: '',
  }

  addTaskSectionId = '';

  selectedTaskId = '';

  selectedSectionForTaskView: Section = {
    _id: '',
    name: '',
    icon: '',
    colour: '',
  };

  handleCancel(): void {
    this.$root.$emit('bv::hide::modal', 'add-task-modal');
  }

  async created(): Promise<void> {
    const projectsResult = await Vue.$apiClient.getProjects();
    if (projectsResult.type === 'success') {
      this.selectedProject = projectsResult.data.find((p) => p._id === this.projectId) as Project;
    }

    const sectionsResult = await Vue.$apiClient.getProjectSections(this.projectId);
    if (sectionsResult.type === 'success') {
      this.sectionsData = sectionsResult.data;
    } else {
      console.log(sectionsResult.error);
      return;
    }

    sectionsResult.data.forEach(async (section) => {
      const id = section._id;

      const getTasksResult = await Vue.$apiClient.getTasks(id);
      if (getTasksResult.type === 'success') {
        Vue.set(this.tasksData, section._id, getTasksResult.data);
        // this.tasksData[section._id] = getTasksResult.data;
      }

      await this.$nextTick();
    });
  }

  async handleAddTask(
    { assignee, dueDate, name }: { assignee: string, dueDate: string, name: string},
  ): Promise<void> {
    const createTaskResult = await Vue.$apiClient.createTask(
      this.addTaskSectionId,
      name,
      dueDate,
      assignee,
    );

    if (createTaskResult.type === 'success') {
      Vue.set(this.tasksData, this.addTaskSectionId, createTaskResult.data);
    }
    console.log(createTaskResult);
  }

  onTaskUpdated(newTask: Task): void {
    console.log('YO');
    const entries = Object.entries(this.tasksData)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .find(([_, tasks]) => tasks.find((task) => newTask._id === task._id));

    if (entries) {
      const index = entries[1].findIndex((task) => newTask._id === task._id);
      const sectionId = entries[0];
      Vue.set(this.tasksData[sectionId], index, newTask);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async updateSectionName(sectionId: string, sectionName: string): Promise<void> {
    const updateSectionResult = await Vue.$apiClient.updateSection(
      sectionId, {
        name: sectionName,
      },
    );

    if (updateSectionResult.type === 'success') {
      console.log('updated name successfully');
      // TODO
    } else {
      console.log('fuck you ');
    }
  }
}
</script>

<style scoped>
#taskmaster-container {
  background: #c4c4c4;
}

#menu-button {
  margin-left: 5px;
  margin-top: auto;
  margin-bottom: auto;
}

.menu-button, .project-name, .project-name-arrow {
  cursor: pointer;
  background: white;
}

div.task {
  background: white;
  border-radius: 5px;
  border: 1px solid grey;
  margin-bottom: 10px;
  padding-left: 5px;
}
.container-header {
  background: white;
  border-bottom: 1px solid black;
}

.menu-button-container {
  margin-top: auto;
  margin-bottom: auto;
}

.header {
  margin-left: 5px;
}

.section-header {
  padding: 10px;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-divider {
  margin-left: 5px;
  margin-right: 5px;
  width: 1px;
  margin-top: auto;
  margin-bottom: auto;
  border-left: 1px solid gray;
}

</style>
