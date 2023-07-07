<template>
  <div class="container border" id="taskmaster-container">
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
            <a @click="handleProjectRedirect($event, index)">
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
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>My checklist</h5>
            <div style="background: white; border-radius: 5px">
              <i class="fa fa-plus-circle"></i> Add...
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>Due today</h5>
            <div style="background: white; border-radius: 5px">Lorem Ipsum...</div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <h5>Unscheduled</h5>
            <div style="background: white; border-radius: 5px">Lorem Ipsum...</div>
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
            <div
              style="background: white; border-radius: 5px; margin-top: 10px; margin-bottom: 10px"
            >
              First notification
            </div>
            <div style="background: white; border-radius: 5px">Second notification</div>
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
                      <div
                        class="col rounded-5"
                        v-for="(_, index) in colours"
                        @click="setSelected(index)"
                      >
                        <div
                          class="rounded-5 mb-2 w-75"
                          style="cursor: pointer; border-radius: 50%"
                          :style="styles[index]"
                        >
                          &nbsp;
                        </div>
                      </div>
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
        <!-- <b-form-row class="mb-2">
          <b-col> Project name </b-col>
          <b-col>
            <b-form-input v-model="name" />
          </b-col>
        </b-form-row>
        <b-form-row class="mb-2">
          <b-col> Project background </b-col>
          <b-col>
            <b-container>
              
            </b-container>
          </b-col>
        </b-form-row> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { Modal } from 'bootstrap';
import moment from 'moment';
import type { Project } from 'taskmaster-client';
import { reactive, ref } from 'vue';
import Client from 'taskmaster-client';
import { inject } from 'vue';
import { onMounted } from 'vue';

import type { ShowErrorMessageFunction } from '@/types/ShowError.types';

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

let projects = ref([] as Project[]);

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
  styles.value[idx]['border'] = '2px solid black';

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

onMounted(async () => {
  const result = await apiClient.getProjects();
  if (result.type === 'success') {
    projects.value = result.data;
  } else {
    showError(result.error.message);
  }
});

setInterval(() => {
  time.value = moment().format('HH:mm:ss');
  date.value = moment().format('dddd DD/MM/YYYY');
}, 1000);
</script>
