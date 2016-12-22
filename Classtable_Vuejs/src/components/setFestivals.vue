<template>
  <form class="set-festivals">
    <label for="name">Name:</label><input v-model="name" type="input" id="name"></input><br />
    <label for="start">Start:</label>
    <select v-model="selected_m" id="start">
      <option v-for="month in months" :value="month">{{ month }}</option>
    </select>
    <select v-model="selected_d" id="start">
      <option v-for="day in 30" :value="day">{{ day }}</option>
    </select>
    <label for="period">Period:</label><input v-model="period" type="input" id="period"></input><br /><br />
    <button @click.prevent="setFestivals">cancel</button>
    <button @click.prevent="submit">submit</button>
  </form>
</template>
<script>
export default {
  name: 'setFestivals',
  props: ['getClassTable','setFestivals', 'isSet','classData'],
  data () {
    return {
      name: '',
      start: '',
      period: '',
      months: ['09', '10', '11', '12', '01'],
      selected_m: '09',
      selected_d: 1,
    }
  },
  computed: {
    festival () {
      this.selected_d = this.selected_d < 10 ? "0" + this.selected_d : this.selected_d;
      var start = this.selected_m + "." + this.selected_d,
          period = parseFloat(this.period);
      return {
        "name": this.name,
        "time": {
          "start": start,
          "period": period
        }
      }
    }
  },
  methods: {
    submit () {
      if(this.name == "" || (!Number.isInteger(this.festival.time.period))) {
        this.setFestivals();
        console.log(this.festival.period)
        return;
      }
      this.classData.alter.festivals.push(this.festival);
      this.$localStorage.set('classList', this.classData);
      this.getClassTable();
      this.setFestivals();
    }
  }
}
</script>