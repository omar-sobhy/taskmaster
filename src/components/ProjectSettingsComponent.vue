<template>
  <div>
    <b-tabs>
      <b-tab title="Overview">
        <div class="overview">
          <b-row v-for="(user, index) in project.users" :key="user">
            <b-col>
              {{ usernames[index] }}
            </b-col>
            <b-col class="icon-col">
              <b-icon-x @click="removeUser(user)" />
            </b-col>
          </b-row>
        </div>

        <a href="#"><b-icon-plus-circle /> Add member</a>
      </b-tab>
      <b-tab title="Tags">
        <div v-if="addingTag">
        </div>
        <div
          v-for="(tag, index) in project.tags"
          :key="tag._id"
          class="tag-div"
          @mouseenter="hoveringOverIndex = index"
          @mouseleave="hoveringOverIndex = -1"
        >
          {{ tags[index] && tags[index].name }}
        </div>

        <a href="#"
          @click="addingTag = true"
          v-b-modal.add-tag
        >
          <b-icon-plus-circle /> Add tag
        </a>
        <b-modal
          id="add-tag"
          @ok="handleOk"
        >
          <b-container>
            <b-form-group
              id="input-group-1"
              label="Tag name"
              label-for="tag-input"
            >
            <b-form-input
              id="tag-input"
              v-model="tagName"
              type="text"
            >
            </b-form-input>
            </b-form-group>
          </b-container>
        </b-modal>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import { Project, Tag, User } from 'taskmaster-client';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ProjectSettingsComponent extends Vue {
  @Prop(Object) readonly project!: Project;

  usernames: string[] = [];

  tags: Tag[] = [];

  hoveringOverIndex = -1;

  tagName = '';

  addingTag = false;

  // eslint-disable-next-line class-methods-use-this
  removeUser(user: User): void {
    // TODO
  }

  async created(): Promise<void> {
    const usernamesResult = await Vue.$apiClient.getUserData(this.project.users);
    if (usernamesResult.type === 'success') {
      this.usernames = usernamesResult.data.map((u) => u.username);
    } else {
      // TODO
    }

    console.log(`Got tags ${this.project.tags}`);
    const tagsResult = await Vue.$apiClient.getTagsData(this.project.tags);
    if (tagsResult.type === 'success') {
      this.tags = tagsResult.data;
    } else {
      // TODO
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async addTag(): Promise<void> {
    console.log(1);
  }

  async handleOk(): Promise<void> {
    console.log(this.tagName);
  }
}
</script>

<style scoped>
.overview {
  background-color: #c4c4c4;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 5px;
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
</style>
