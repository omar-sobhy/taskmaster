<template>
  <div class="container p-0">
    <form class="create-section-form">
      <div class="row mb-3 px-3">
        <label class="col-form-label col-4" for="section-name-input">Section name</label>
        <div class="col">
          <input
            type="text"
            class="form-control"
            id="section-name-input"
            required
            minlength="3"
            v-model="sectionName"
          />
        </div>
      </div>
      <div class="row mb-3 px-3">
        <label class="col-form-label col-4" for="section-colour-input">Section colour</label>
        <div class="col">
          <input
            type="color"
            class="form-control color-picker"
            id="section-colour-input"
            @change="
              (event) => {
                sectionColour = event.target!.value;
              }
            "
            value="#ff0000"
          />
        </div>
      </div>
      <hr />
      <button type="submit" class="btn btn-primary ms-3 create-section-button">
        Create section
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ShowErrorMessageFunction } from '@/types/ShowError.types';
import type Client from 'taskmaster-client';
import { onMounted } from 'vue';
import { inject, ref } from 'vue';

const props = defineProps<{ projectId: string }>();
const emit = defineEmits(['created']);

const sectionName = ref('');
const sectionColour = ref('#ff0000');

const apiClient: Client = inject('$apiClient')!;
const showError: ShowErrorMessageFunction = inject('showError')!;

onMounted(() => {
  const formEl: HTMLFormElement = document.querySelector('.create-section-form')!;
  formEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const createSectionResult = await apiClient.createSections(props.projectId, [
      {
        colour: sectionColour.value,
        name: sectionName.value,
        icon: '',
      },
    ]);

    if (createSectionResult.type === 'error') {
      showError(createSectionResult.error.message);
    } else {
      emit('created', {
        section: createSectionResult.data[0],
      });
    }
  });
});
</script>
