<template>
  <div>
    <ul class="nav nav-underline border-bottom">
      <li class="nav-item">
        <a
          class="nav-link active"
          aria-current="page"
          href="#"
          id="overview-tab-label"
          data-bs-toggle="tab"
          data-bs-target="#overview-tab"
        >
          Overview
        </a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          href="#"
          id="tags-tab-label"
          data-bs-toggle="tab"
          data-bs-target="#tags-tab"
        >
          Tags
        </a>
      </li>
    </ul>

    <div class="tab-content">
      <div
        class="tab-pane active pt-2"
        id="overview-tab"
        role="tabpanel"
        aria-labelledby="overview-tab-label"
        tabindex="0"
      >
        <div class="container">
          <div class="row" v-for="user in users">
            <div class="col col-11">{{ user.username }}</div>
            <div class="col col-1" data-bs-placement="right">
              <a href="#" @click="removeUser(user)"><i class="fa fa-times"></i></a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="tab-pane pt-2"
        id="tags-tab"
        role="tabpanel"
        aria-labelledby="tags-tab-label"
        tabindex="0"
      >
        <div class="container">
          <div v-for="(tag, index) in tags" class="row background-secondary">
            <div class="col" @mouseleave="hoveringIndex = -1" @mouseenter="hoveringIndex = index">
              <div class="container">
                <div class="row">
                  <div class="col-1">
                    <i class="fa fa-tag me-2" :style="{ color: tag.colour }"></i>
                  </div>
                  <div class="col">
                    <input
                      class="me-auto w-100 text-truncate border-0"
                      :value="tag.name"
                      @focus="editingTag = true"
                      @change="(event) => {
                        editingTag = false;
                        updateTag(tag._id, { name: (event.target as HTMLInputElement).value });
                      }"
                    />
                  </div>
                  <div class="col-auto">
                    <div v-if="!editingTag && hoveringIndex === index">
                      <a href="#" v-for="colour in colours" @click="updateTag(tag._id, { colour })">
                        <i class="fas fa-circle me-2" :style="{ color: colour }"></i>
                      </a>
                      <a href="#" @click="deleteTag(tag._id)">
                        <i class="fa fa-times"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="row" v-if="addingTag">
              <div class="col d-flex align-items-center">
                <i class="fa fa-tag me-2"></i>
                <input
                  class="form-control w-100"
                  type="text"
                  @change="(e: Event) => { 
                      newTagName = (e.currentTarget as HTMLInputElement).value; 
                      addingTag = false; 
                    }"
                />
              </div>
            </div>
            <div class="col d-flex align-items-center" v-else>
              <a href="#" class="text-decoration-none" @click="addingTag = true">
                <i class="fa fa-plus me-2"></i>
                <span>Add tag</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      id="cannot-remove-user-toast"
      class="toast"
      role="toast"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header">
        <strong class="me-auto">Cannot remove user</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        There must remain at least one non-external member in the project. You can archive the
        project instead.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from 'bootstrap';
import type { ShowErrorMessageFunction } from 'src/types/ShowError.types';
import Client, { type User, type Project, type Tag } from 'taskmaster-client';
import { inject } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';

const props = defineProps<{ project: Project; tags: Tag[] }>();

const emit = defineEmits(['tagAdded', 'tagDeleted', 'tagUpdated']);

const users = ref<User[]>([]);

const addingTag = ref<Boolean>(false);

const editingTag = ref(false);

const newTagName = ref('');

const hoveringIndex = ref(-1);

const apiClient: Client = inject('$apiClient')!;

const showError: ShowErrorMessageFunction = inject('showError')!;

const colours = [
  '#00aaff',
  '#2ed7d8',
  '#4070ff',
  '#a179f2',
  '#f7578c',
  '#d01f2e',
  '#ffaa00',
  '#ffd426',
  '#96db0b',
  '#3dcc3d',
  '#3d474d',
  '#8a9499',
];

async function removeUser(user: User) {
  if (users.value.length === 1) {
    const toast = Toast.getOrCreateInstance('#cannot-remove-user-toast');
    toast.show();
    return;
  }
}

async function deleteTag(tagId: string) {
  try {
    const result = await apiClient.deleteTag(tagId);
    if (result.type !== 'success') {
      throw result.error.message;
    }

    const idx1 = props.tags.findIndex((t) => t._id === tagId);
    props.tags.splice(idx1, 1);

    emit('tagDeleted', {
      tag: result.data,
    });
  } catch (error) {
    showError(error as string);
  }
}

async function updateTag(
  tagId: string,
  { name, colour }: Partial<{ name: string; colour: string }>,
) {
  try {
    const result = await apiClient.updateTag(tagId, name, colour);
    if (result.type !== 'success') {
      throw result.error.message;
    }

    const tag = props.tags.find((t) => t._id === tagId)!;

    if (name) {
      tag.name = name;
    }

    if (colour) {
      tag.colour = colour;
    }

    emit('tagUpdated', { tag });
  } catch (error) {
    showError(error as string);
  }
}

watch(
  () => props.project,
  async (project) => {
    try {
      const getUserDataResult = await apiClient.getUserData(project.users);

      if (getUserDataResult.type === 'error') {
        throw getUserDataResult.error.message;
      }

      users.value = getUserDataResult.data;
    } catch (error) {
      showError(error as string);
    }
  },
);

watch(newTagName, async (name: string) => {
  try {
    const addTagResult = await apiClient.createTag(props.project._id, name);
    if (addTagResult.type !== 'success') {
      throw addTagResult.error.message;
    }

    props.project.tags.push(addTagResult.data._id);

    emit('tagAdded', {
      tag: addTagResult.data,
    });
  } catch (error) {
    showError(error as string);
  }
});
</script>
