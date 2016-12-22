<template>
  <form class="set-class">
    <label for="subject">Subject:</label><input v-model="subject" type="input" id="subject"></input><br />
    <label for="teacher">Teacher:</label><input v-model="teacher" type="input" id="teacher"></input><br />
    <label for="room">Room:</label><input v-model="room" type="input" id="room"></input><br />
    <button @click.prevent="edit">Cancel</button>
    <button @click.prevent="apply">Apply</button>
    <button @click.prevent="applyAll">Apply to all</button>
  </form>
</template>
<script>
export default {
  name: 'setClass',
  props: ['isEdit','edit','target','classData','getClassTable'],
  data () {
    return {
      subject: '',
      teacher: '',
      room: ''
    }
  },
  computed: {
    lesson () {
      var everyday = this.target.parentNode,
          day = everyday.firstChild.childNodes[0].textContent,
          time = everyday.firstChild.childNodes[2].textContent;
      for(var i = 0; i < everyday.childNodes.length; i++) {
        if(everyday.childNodes[i] == this.target) {
          var n = i - 2;
          break;
        }
      }
      return {
        "day": day,
        "number": n,
        "time": time,
      }
    }
  },
  methods: {
    applyAll () {
      var lesson = this.classData.normal[this.lesson.day][this.lesson.number];
      lesson.subject = this.subject;
      lesson.teacher = this.teacher;
      lesson.room = this.room;
      this.$localStorage.set('classList', this.classData);
      this.getClassTable()
      this.edit();
    },
    apply () {
      var alterClass = {
            "time": this.lesson.time,
            "lesson": this.lesson.number,
            "subject": this.subject,
            "teacher": this.teacher,
            "room": this.room
          };
      this.classData.alter.classes.push(alterClass);
      this.$localStorage.set('classList', this.classData);
      this.getClassTable();
      this.edit();
    },
  },
  mounted() {
  }
}
</script>