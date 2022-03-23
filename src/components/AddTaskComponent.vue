<template>
  <b-form
    @submit.prevent="submit"
  >
    <b-form-group label-cols="3" content-cols="9" label="Name" label-for="name">
      <b-form-input id="name" v-model="name" required> </b-form-input>
    </b-form-group>

    <b-form-group
      label-cols="3"
      content-cols="9"
      label="Due..."
      label-for="due-date"
    >
      <b-form-datepicker v-model="dueDate"> </b-form-datepicker>
    </b-form-group>

    <b-form-group
      label-cols="3"
      content-cols="9"
      label="Assignee"
      label-for="assignee"
    >
      <b-form-select id="assignee" v-model="assignee">
        <b-form-select-option :value="''">
          Please select an option
        </b-form-select-option>
        <b-form-select-option v-for="user in users" :key="user" :value="user">
          {{ user }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>
    <hr />
    <b-container>
      <b-row align-h="end">
        <b-button
          variant="secondary"
          style="margin-right: 5px"
          @click="handleCancel"
        >
          Cancel
        </b-button>
        <b-button variant="primary" @click.prevent="submit" type="submit">OK</b-button>
      </b-row>
    </b-container>
  </b-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  props: {
    users: Array,
  },
})
export default class AddTaskComponent extends Vue {
  assignee: string | null = null;

  dueDate: string | null = null;

  name = '';

  handleCancel(): void {
    this.$emit('cancel');
  }

  submit(): void {
    if (this.name !== '') {
      this.$emit('ok', {
        assignee: this.assignee,
        dueDate: this.dueDate,
        name: this.name,
      });
    }
  }
}
</script>
