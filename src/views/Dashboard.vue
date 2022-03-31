<template>
  <b-container id="taskmaster-container">
    <b-row>
      <b-col cols="3">
        <b-row class="border-row">
          <div class="col">
            <h5>Dashboard</h5>
          </div>
        </b-row>
        <b-row class="row border-row">
          <b-col>
            <h5>Agenda</h5>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-row>
              <b-col>
                <h5>Your projects</h5>
              </b-col>
              <b-col style="text-align: right">
                <b-icon-plus-circle
                  id="addProjectButton"
                  @click="showAddProjectModel"
                  v-b-modal.modal-1
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <b-row
        v-for="(project, index) in projects"
        :key="project._id">
          <b-col>
            <a @click="handleProjectRedirect($event, index)">
              {{ project.name }}
            </a>
          </b-col>
        </b-row>
      </b-col>
      <b-col id="info" cols="3">
        <h1>Welcome {{ this.$store.state.username }}</h1>
        <h2>{{ date }}</h2>
        <h2>{{ time }}</h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua...
      </b-col>

      <b-col cols="3">
        <b-row class="border-row">
          <b-col>
            <h5>My Tasks <b-icon-arrow-down-short /></h5>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 10px">
          <b-col>
            <h5>My checklist</h5>
            <div style="background: white; border-radius: 5px">
              <b-icon-plus-circle /> Add...
            </div>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 10px">
          <b-col>
            <h5>Due today</h5>
            <div style="background: white; border-radius: 5px">
              Lorem Ipsum...
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>Unscheduled</h5>
            <div style="background: white; border-radius: 5px">
              Lorem Ipsum...
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="3" style="border-left: 1px solid black">
        <b-row class="border-row">
          <b-col>
            <h5>Your notifications</h5>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div
              style="
                background: white;
                border-radius: 5px;
                margin-top: 10px;
                margin-bottom: 10px;
              "
            >
              First notification
            </div>
            <div style="background: white; border-radius: 5px">
              Second notification
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-modal id="modal-1" title="Add project" @ok="handleOk">
      <b-container fluid>
        <b-form-row class="mb-2">
          <b-col> Project name </b-col>
          <b-col>
            <b-form-input v-model="name" />
          </b-col>
        </b-form-row>
        <b-form-row class="mb-2">
          <b-col> Project background </b-col>
          <b-col>
            <b-container>
              <b-row align-content="center" class="mb-2">
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: red"
                  @click="selectedColour = 0"
                  :class="{ selectedColour: selectedColour === 0 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: blue"
                  @click="selectedColour = 1"
                  :class="{ selectedColour: selectedColour === 1 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: green"
                  @click="selectedColour = 2"
                  :class="{ selectedColour: selectedColour === 2 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: gold"
                  @click="selectedColour = 3"
                  :class="{ selectedColour: selectedColour === 3 }"
                >
                  &nbsp;
                </b-col>
              </b-row>
              <b-row align-h="center">
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: teal"
                  @click="selectedColour = 4"
                  :class="{ selectedColour: selectedColour === 4 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: orange"
                  @click="selectedColour = 5"
                  :class="{ selectedColour: selectedColour === 5 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: darkblue"
                  @click="selectedColour = 6"
                  :class="{ selectedColour: selectedColour === 6 }"
                >
                  &nbsp;
                </b-col>
                <b-col
                  class="text-center colour-picker mx-2"
                  style="background: darkslateblue"
                  @click="selectedColour = 7"
                  :class="{ selectedColour: selectedColour === 7 }"
                >
                  &nbsp;
                </b-col>
              </b-row>
            </b-container>
          </b-col>
        </b-form-row>
      </b-container>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import moment from 'moment';
import { BIconPlusCircle } from 'bootstrap-vue';
import Project from 'taskmaster-client/build/entities/Project';

@Component({
  components: {
    BIconPlusCircle,
  },
})
export default class Dashboard extends Vue {
  selectedColour = -1;

  projects: Project[] = [];

  name = '';

  colours = [
    '#ff0000',
    '#0000ff',
    '#008000',
    '#ffd700',
    '#008080',
    '#ffa500',
    '#00008b',
    '#483d8b',
  ];

  date = moment().format('DD MM YYYY');

  time = moment().format('h:mm:ss');

  mounted(): void {
    setInterval(() => {
      this.time = moment().format('h:mm:ss');
    }, 1000);
  }

  showAddProjectModel(): void {
    console.log(this.date);
  }

  async handleOk(): Promise<void> {
    const result = await Vue.$apiClient.createProject(
      this.name,
      this.colours[this.selectedColour],
    );

    if (result.type === 'success') {
      this.projects.push(result.data);
    }

    console.log(result);
    console.log('ok');
  }

  async created(): Promise<void> {
    if (!this.$cookies.get('state')) {
      this.$router.push('/');
    }

    const projectsResult = await Vue.$apiClient.getProjects();
    if (projectsResult.type === 'success') {
      this.projects = projectsResult.data;
    }
  }

  handleProjectRedirect(event: Event, index: number): void {
    event.preventDefault();
    this.$router.push({
      name: 'Project',
      params: {
        projectId: this.projects[index]._id,
      },
    });
  }
}
</script>

<style scoped>
#info {
  align-items: right;
  border-right: 1px solid black;
  border-left: 1px solid black;
}

.border-row {
  border-bottom: 1px solid black;
}

.colour-picker {
  background: #dddddd;
  border-radius: 1000px;
  cursor: pointer;
}

.selectedColour {
  -webkit-box-shadow: 0 0 20px black;
  -moz-box-shadow: 0 0 20px black;
  box-shadow: 0 0 20px black;
}

#taskmaster-container {
  background: #c4c4c4;
}

#addProjectButton {
  cursor: pointer;
}
</style>
