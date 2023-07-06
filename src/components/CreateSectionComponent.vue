<template>
  <b-modal
  @ok="submit"
  :id="modalId"
  >
    <b-form
          @submit.prevent="submit"
      >
        <b-form-group label-cols="3" content-cols="9" label="Name" label-for="name">
        <b-form-input id="name" v-model="name" required> </b-form-input>
        </b-form-group>

        <b-form-group
        label-cols="3"
        content-cols="9"
        label="Colour"
        label-for="colour"
        >
        <b-form-input id="colour" v-model="colour" required type="color"></b-form-input>
        </b-form-group>
        <hr />
    </b-form>
  </b-modal>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  props: {
    modalId: String,
  },
})
export default class CreateSectionComponent extends Vue {
  assignee: string | null = null;

  dueDate: string | null = null;

  name = '';

  colour = '';

  handleCancel(): void {
    this.$emit('cancel');
  }

  submit(): void {
    if (this.name !== '') {
      this.$emit('ok', {
        name: this.name,
        colour: this.colour,
      });
    }
  }
}
</script>
