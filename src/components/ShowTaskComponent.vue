<template>
  <b-container style="padding: 0px;">
    <b-row align-content="between">
      <input
        v-model="task.name"
        class="text-input"
        @change="updateTaskName"
      />
      <b-col style="text-align: end; padding-right: 5px;">
        <b-form-select
          v-model="task.assignee"
          @change="updateAssignee"
          style="width: 40%"
        >
          <b-form-select-option value="">
            N/A
          </b-form-select-option>

          <b-form-select-option
            v-for="user in users_"
            :key="user._id"
            :value="user._id"
          >
            {{ user && user.username }}
          </b-form-select-option>
        </b-form-select>
      </b-col>
    </b-row>

    <hr/>

    <b-row>
      <b-col style="padding-left: 15px; padding-right: 15px;">
        <textarea
          v-model="task.description"
          placeholder='This task has no description'
          class="background-on-hover input-textarea"
          id="task-description-textarea"
          @change="updateTaskDescription"
        >
        </textarea>
        Activity <b-icon-caret-down />
        <textarea
          v-model="comment"
          placeholder="Add comment"
          @keypress.enter.prevent="addComment($event)"
          id="activity-textarea"
          class="background-on-hover input-textarea"
        >
        </textarea>

        <div v-for="comment in comments" :key="comment._id">
          <b-row style="padding-bottom: 15px;">
            <b-col style="padding-left: 15px;" cols="3">
              <b>{{ users_.find(u => u._id === comment.owner).username }}</b>
            </b-col>
            <b-col>
              <div>
                {{ formatDate(comment.date) }}
                {{ formatTime(comment.date) }}
              </div>
              <div class="comment-box">
                {{ comment.text }}
              </div>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col cols="5" style="border-left: 1px solid black">
        <b-row class="task-info-row">
          <b-col style="padding-left: 5px;"> <b-icon-calendar /> Due date </b-col>
          <b-col>
            <b-form-datepicker
              v-model="task.dueDate"
              @input="updateTaskDueDate"
              value-as-date
              reset-button
            />
          </b-col>
        </b-row>
        <b-row class="task-info-row">
          <b-col style="padding-left: 5px;"> <b-icon-tag /> Tags </b-col>
        </b-row>
        <b-row class="task-info-row">
          <b-col style="padding-left: 5px;"> <b-icon-eye /> Watchers </b-col>
        </b-row>
        <b-row>
          <b-col style="padding-left: 5px;">
            <b>{{ projectName }}</b>
            <br/>
            {{ section.name }}
          </b-col>
        </b-row>
        <b-row style="padding-left: 5px; padding-bottom: 10px;">
          <b-col cols="1">
            <b-icon-plus-circle-fill/>
          </b-col>
          <b-col>
            <b>Created</b>
            <br/>
            {{ task && formatDate(task.created) }}
            <br/>
            {{ task && formatTime(task.created) }}
          </b-col>
        </b-row>
        <b-row style="padding-left: 5px; padding-bottom: 10px;">
          <b-col cols="1">
            <b-icon-pencil/>
          </b-col>
          <b-col>
            <b>Updated</b>
            <br/>
            {{ task && formatDate(task.updated) }}
            <br/>
            {{ task && formatTime(task.updated) }}
          </b-col>
        </b-row>
        <b-row style="padding-left: 5px; ">
          <b-col cols="1">
            <b-icon-link45deg/>
          </b-col>
          <b-col>
            <b>Task ID</b>
            <br/>
            {{ task && task._id }}
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import moment from 'moment';
import Task from 'taskmaster-client/build/entities/Task';
import { User } from 'taskmaster-client/build/entities/User';
import Comment from 'taskmaster-client/build/entities/Comment';
import { Component, Vue } from 'vue-property-decorator';

const ShowTaskComponentProps = Vue.extend({
  props: {
    taskId: String,
    users: Array,
    projectName: String,
    section: Object,
  },
});

@Component({
  props: {
    taskId: String,
    users: Array,
    projectName: String,
    section: Object,
  },
})
export default class ShowTaskComponent extends ShowTaskComponentProps {
  task: Task = {
    _id: '',
    name: '',
    description: '',
    dueDate: new Date(''),
    assignee: '',
    created: new Date(''),
    updated: new Date(''),
    watchers: [],
    checklistItems: [],
    comments: [],
    historyItems: [],
    tags: [],
  }

  users_: Array<User> = [];

  comment = '';

  comments_: Array<Comment> = [];

  // eslint-disable-next-line class-methods-use-this
  formatDate(date: Date): string {
    return moment(date).format('DD-MM-YYYY');
  }

  // eslint-disable-next-line class-methods-use-this
  formatTime(date: Date): string {
    return moment(date).format('hh:mm a');
  }

  test(): void {
    console.log('New assignee', this.task.assignee);
  }

  get comments(): Array<Comment> {
    return this.comments_.sort((lhs, rhs) => {
      if (lhs.date > rhs.date) return -1;
      if (lhs.date === rhs.date) return 0;
      return 1;
    });
  }

  async created(): Promise<void> {
    const taskResult = await Vue.$apiClient.getTaskData(this.taskId);
    if (taskResult.type === 'success') {
      Object.entries(this.task).forEach(([key, value]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.task[key] = taskResult.data[key] ?? value;
      });

      // this.task = taskResult.data;
      if (!this.task.assignee) {
        this.task.assignee = '';
      }
    } else {
      console.log(taskResult.error);
      return;
    }

    const usersResult = await Vue.$apiClient.getUserData(
      this.users as string[],
    );
    if (usersResult.type === 'success') {
      // eslint-disable-next-line prefer-destructuring
      this.users_ = usersResult.data;
    } else {
      console.log(usersResult.error);
    }

    const commentsResult = await Vue.$apiClient.getComments(
      this.task.comments,
    );
    if (commentsResult.type === 'success') {
      this.comments_ = commentsResult.data;
    } else {
      console.log(`Error while retrieving comments: ${commentsResult.error}`);
    }

    const textAreas = document.querySelectorAll('.input-textarea');
    textAreas.forEach((t: Element) => {
      t.setAttribute('style', `height: ${t.scrollHeight}px; overflow-y: hidden; resize: none; width: 100%;`);
      // eslint-disable-next-line func-names
      t.addEventListener('input', function (this: HTMLTextAreaElement) {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
      }, false);
    });
  }

  async updateAssignee(): Promise<void> {
    const newAssignee = this.task.assignee.trim() !== '' ? this.task.assignee : null;
    const taskResult = await Vue.$apiClient.updateTask(
      this.task._id,
      {
        assignee: newAssignee || undefined,
      },
    );

    if (taskResult.type === 'success') {
      this.task.updated = taskResult.data.updated;
      this.$emit('task-updated', this.task);
    }
  }

  async updateTaskDescription(): Promise<void> {
    const taskResult = await Vue.$apiClient.updateTask(
      this.task._id,
      {
        description: this.task.description ?? null,
      },
    );

    if (taskResult.type === 'success') {
      console.dir(taskResult.data);
      this.task.description = taskResult.data.description;

      this.task.updated = taskResult.data.updated;
      this.$emit('task-updated', this.task);
    } else {
      console.log(taskResult.error);
    }
  }

  async updateTaskName(): Promise<void> {
    const taskResult = await Vue.$apiClient.updateTask(
      this.task._id,
      {
        name: this.task.name,
      },
    );

    if (taskResult.type === 'success') {
      this.task.updated = taskResult.data.updated;
      this.$emit('task-updated', this.task);
    }
  }

  async updateTaskDueDate(): Promise<void> {
    console.log(this.task.dueDate);
    let dueDate: null | string = '';
    if (this.task.dueDate === null) {
      dueDate = null;
    } else {
      dueDate = moment(this.task.dueDate).format('YYYY-MM-DD');
    }
    console.log(`Formatted dueDate: ${dueDate}`);
    const taskResult = await Vue.$apiClient.updateTask(
      this.task._id,
      {
        dueDate,
      },
    );

    console.log(taskResult);
  }

  async addComment(event: KeyboardEvent): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.target.blur();
    console.log(`Adding comment: ${this.comment}`);
    const commentResult = await Vue.$apiClient.addComment(this.task._id, this.comment);
    if (commentResult.type === 'success') {
      this.comments_.push(commentResult.data);
      this.task.comments.push(commentResult.data._id);
    } else {
      console.log(`Error: ${commentResult.error}`);
    }
  }
}
</script>

<style scoped>
.text-input:hover {
  background-color: #f7f7f7;
  border: 0px;
  outline: none;
}

.text-input {
  border: 0px;
  margin-left: 15px;
  outline: none;
  font-weight: bold;
}

.input-textarea {
  width: 100%;
}

#task-description-textarea {
  border: 0px;
  border-radius: 10px;
}

#activity-textarea {
  border-radius: 10px;
  border: 2px solid #f2f2f2;
}

#activity-textarea:focus {
  border: 2px solid cadetblue;
}

.background-on-hover:hover, .background-on-hover:focus {
  background-color: #f7f7f7;
  outline: none;
}

.task-info-row {
  border-bottom: 1px solid black;
}

.col {
  padding: 0px;
}

.col-1 {
  padding: 0px;
}

.comment-box {
  border-radius: 5px;
  background: #f2f2f2;
  margin-right: 30px;
  padding-left: 5px;
  padding-bottom: 5px;
}

hr {
  margin-bottom: 0px;
  margin-left: -15px;
  margin-right: -15px;
  border-color: black;
}
</style>
