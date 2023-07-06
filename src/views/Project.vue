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
          <b-dropdown
            id="dropdown"
            :text="selectedProject.name"
            variant="light"
          >
            <b-dropdown-item
              v-b-modal.project-settings-modal
            ><b-icon-gear/> Project settings...</b-dropdown-item>
            <b-dropdown-divider/>
            <b-dropdown-item><b-icon-trash/> Deleted tasks...</b-dropdown-item>
            <b-dropdown-item><b-icon-archive/> Archived tasks...</b-dropdown-item>
            <b-dropdown-divider/>
            <b-dropdown-item><b-icon-emoji-smile/> Change icon...</b-dropdown-item>
            <b-dropdown-item><b-icon-image/> Change background...</b-dropdown-item>
          </b-dropdown>
      </b-row>
    </div>
    <div class="section-container">
      <b-col
        v-for="(section, index) in sectionsData"
        :key="section._id"
        :style="{ background: index % 2 === 0 ? '#f2f4f5' : '#ebeff0' }"
        class="section-column px-0"
      >
        <h4 class="section-header" :style="{ background: section.colour }">
          <input
            v-model="section.name"
            style="border: 0px; margin-left: 15px; outline: none; font-weight: bold"
            :style="{ background: section.colour }"
            @change="updateSectionName(section._id, section.name)"
          />
        </h4>
        <b-container>
          <b-row v-if="section.tasks.length === 0" class="text-center">
            <b-col>
              <b>No tasks</b><br>
              Drag tasks here or click + <br>to add new tasks.
            </b-col>
          </b-row>
          <b-container>
            <div v-for="task in tasksData[section._id]" :key="task._id"
              class="w-100 task"
              style="cursor: pointer;"
              @click="selectedSectionForTaskView = section; selectedTaskId = task._id;"
              v-b-modal.show-task-modal
            >
              {{ task.name }}
            </div>
          </b-container>
          <b-row class="text-center justify-content-center">
            <b-icon-plus-circle
              style="cursor: pointer;"
              @click="addTaskSectionId = section._id"
              v-b-modal.add-task-modal
            />
          </b-row>
        </b-container>
      </b-col>
      <b-col
        cols="2"
        :style="{ background: sectionsData.length % 2 === 0 ? '#f2f4f5' : '#ebeff0' }"
      >
          <div class="ml-3 mt-2">
            <h4>
              <a href="#" v-b-modal.create-section-modal>+ Add section</a>
            </h4>
          </div>
          <div class="tasks-container">
          </div>
      </b-col>
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
        :projectTagIds="selectedProject.tags"
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

    <b-modal
      id="project-settings-modal"
      ok-only
    >
      <project-settings-component
        :project="selectedProject"
      />
    </b-modal>

    <create-section-component
      @ok="handleCreateSection"
      modal-id="create-section-modal"
    />
  </div>
</template>

<script lang="ts">
import { Project, Section, Task } from 'taskmaster-client';
import { Vue, Component } from 'vue-property-decorator';
import CreateSectionComponent from '@/components/CreateSectionComponent.vue';
import AddTaskComponent from '../components/AddTaskComponent.vue';
import ShowTaskComponent from '../components/ShowTaskComponent.vue';
import ProjectSettingsComponent from '../components/ProjectSettingsComponent.vue';

@Component({
  props: {
    projectId: String,
  },
  components: {
    AddTaskComponent,
    ShowTaskComponent,
    ProjectSettingsComponent,
    CreateSectionComponent,
  },
})
export default class ProjectView extends Vue {
  hoveringOverIndex = -1;

  showProjectSettings = false;

  selectedProject: Project = {
    _id: '',
    name: '',
    background: '',
    users: [],
    sections: [],
    tags: [],
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
    tasks: [],
  };

  // eslint-disable-next-line class-methods-use-this
  log() {
    console.log('test');
  }

  handleCancel(): void {
    this.$root.$emit('bv::hide::modal', 'add-task-modal');
  }

  async created(): Promise<void> {
    const projectsResult = await Vue.$apiClient.getProjects();
    if (projectsResult.type === 'success') {
      this.selectedProject = projectsResult.data.find((p) => p._id === this.projectId) as Project;
    }

    try {
      const sectionsPromise = await this.showSections();
    } catch (error) {
      console.log(`Error: ${JSON.stringify(error, null, 2)})}`);
    }
  }

  async showSections() {
    const sectionsResult = await Vue.$apiClient.getProjectSections(this.projectId);
    if (sectionsResult.type === 'success') {
      this.sectionsData = sectionsResult.data;
    } else {
      // TODO: error handling
      console.log(sectionsResult.error);
      return Promise.reject();
    }

    const promises = sectionsResult.data.map(async (section) => {
      const id = section._id;

      const getTasksResult = await Vue.$apiClient.getTasks(id);
      if (getTasksResult.type === 'success') {
        Vue.set(this.tasksData, id, getTasksResult.data);
      } else {
        // TODO: error handling
      }

      await this.$nextTick();
    });

    return Promise.all(promises);
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
      if (!this.tasksData[this.addTaskSectionId]) {
        Vue.set(this.tasksData, this.addTaskSectionId, [createTaskResult.data]);
      } else {
        this.tasksData[this.addTaskSectionId].push(createTaskResult.data);
      }

      const section = this.sectionsData.find(
        (s) => s._id === this.addTaskSectionId,
      );

      if (!section) {
        // TODO: error handling
        return;
      }

      section.tasks.push(createTaskResult.data._id);

      this.$bvModal.hide('add-task-modal');

      return;
    }

    // TODO: error handling
    console.log(createTaskResult);

    this.$bvModal.hide('add-task-modal');
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
      // TODO: error handling
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async handleCreateSection(
    { name, colour } : { name: string, colour: string, },
  ) {
    const addSectionResult = await Vue.$apiClient.createSections(this.selectedProject._id, [{
      name,
      colour,
      icon: '',
    }]);

    if (addSectionResult.type === 'success') {
      console.log('Section created successfully');
      this.sectionsData.push(addSectionResult.data[0]);
      // const index = this.selectedProject.sections.length;
      // Vue.set(this.selectedProject.sections, index, addSectionResult.data[0]._id);
    } else {
      console.log(`Error + ${addSectionResult.error.message}`);
      // TODO: error handling
    }
  }

  // eslint-disable-next-line class-methods-use-this
  removeUser(id: string) {
    console.log(`removing user ${id}`);
    // TODO
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

#dropdown {
  background-color: white;
}

.overview {
  background-color: #c4c4c4;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.icon-col {
  text-align: right;
  margin-right: 5px;
}

.icon-col > svg:hover {
  cursor: pointer;
}

.tag-div {
  background-color: #c4c4c4;
  border-radius: 10px;
  margin-top: 20px;
}

.tag-div:hover {
  cursor: pointer;
}

.section-container {
  display: flex;
  flex-direction: row;
}

body {
  overflow-x: scroll;
}
</style>
