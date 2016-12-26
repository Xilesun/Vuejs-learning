<template>
  <div id="container">
    <label for="col">col</label>
    <input type="radio" name="display" id="col" value="col" v-model="layout" />
    <label for="row"></label>row<input type="radio" name="display" id="row" value="row" v-model="layout" />
    <select v-model="selected">
      <option v-for="week in 16" :value="week">第{{ week }}周</option>
    </select>
    <button @click.prevent="setFestivals">Set festivals</button>

    <!-- ouput ClassTable -->
    <div class="table" :class="{ row: isRow }">
      <div v-for="(item, index) in days">
        <div>{{ item }}<br />{{ dates[index] }}</div>
        <div v-for="lesson in classTable[index]" @click="edit">
          <span>{{ lesson.subject }}</span><br />
          <span>{{ lesson.teacher }}</span><br />
          <span>{{ lesson.room }}</span><br />
        </div>
      </div>
    </div>

    <!-- edit Classtable -->
    <div v-if="isEdit" class="form">
     <setClass :isEdit="isEdit"
               :edit="edit"
               :target="target"
               :classData="classData"
               :classTable="classTable"
               :getClassTable="getClassTable"
    ></setClass>
    </div>

    <!-- set festivals -->
    <div v-if="isSet" class="form">
     <setFestivals :setFestivals="setFestivals"
                   :isSet="isSet"
                   :classData="classData"
                   :getClassTable="getClassTable"
     ></setFestivals>
    </div>
  </div >
</template>

<script>
import setClass from './components/setClass.vue'
import setFestivals from './components/setFestivals.vue'
import clone from 'clone'

export default {
	name: 'aClassTable',
  components: {
    setClass,
    setFestivals
  },
  data () {
    return {
      layout: 'col',
      //isRow: false,
      isEdit: false,
      isSet: false,
      days: ["Mon", "Tue", "Wed", "Thur", "Fri"],
      selected: 1,
      classTable: [],
      target: ''
    }
  },
  methods: {
    edit (e) {
      this.isEdit = !this.isEdit;
      this.target = e.currentTarget;
    },
    setFestivals () {
      this.isSet = !this.isSet;
    },
    getClassTable () {
      var classNormalData = clone(this.classData.normal),
          alterClasses = this.classData.alter.classes,
          alterFestivals = this.classData.alter.festivals,
          classTable = [];

      for(var day in classNormalData) {
        classTable.push(classNormalData[day]);
      }

      if(alterClasses != []) {
        alterClasses.forEach(function(item, index) {
          var date = item.time,
              lesson = item.lesson;
          for(var i = 0; i < 4; i++){
            var time = this.dates[i],
                classes = classTable[i][lesson];
            if(time == date) {
              classes.subject = item.subject;
              classes.teacher = item.teacher;
              classes.room = item.room;
              break;
            }
          }
        }, this)
      }

      if(alterFestivals != []) {
        var time = this.dates[0] * 100; //乘100解决浮点数问题
        alterFestivals.forEach(function(item, index){
          var date = item.time.start * 100,
              name = item.name,
              period = item.time.period;

          //处理假日出现在某一周开头或者，中间的情况
          if((date >= time) && (date <= parseFloat(time)+5)){
            for(var i = date-time; i <= period; i++){
              var classday = classTable[i];
              for(var j = 0; j < 4; j++){
                classday[j].subject = "";
                classday[j].teacher = name;
                classday[j].room = "";
              }
            }
          }

          //处理假日跨过两周的情况
          if((date < time) && (date+period >= time)){
            period = date+period-time-1;
            for(var i = 0; i <= period; i++){
              var classday = classTable[i];
              for(var j = 0; j < 4; j++){
                classday[j].subject = "";
                classday[j].teacher = name;
                classday[j].room = "";
              }
            }
            return false;
          }
        }, this)
      }
      this.classTable = classTable;
    }
  },
  computed: {
    isRow () {
      return this.layout == 'row';
    },
    classData () {
      return this.$localStorage.get('classList');
    },
    dates () {
      var dates = this.days.map(function (day, i) {
            var date = new Date(),
                //设置初始日期
                start = date.setFullYear(2016,8,19),
                end = date.setDate(date.getDate(start) + i + (this.selected - 1) * 7),
                time = new Date(end),
                //格式化日期
                mon = time.getMonth()+1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1,
                theDay = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
                time = mon + "." + theDay;
                return time;
          }, this);
      return dates;
    },
  },
  watch: {
    selected: 'getClassTable'
  },
  mounted () {
    this.getClassTable()
  },
  created () {
  }
}
</script>

<style lang='stylus'>
#container
  width: 800px;
  margin: auto;
.table
  display: flex;
  &>div
    text-align: center;
    width: 20%;
    &>div
      height: 60px;
      padding: 20px 20px;
      border: 1px solid #eee;
      line-height: 18px;
      span
        &:nth-of-type(3)
          font-size: 13px;
      &:nth-of-type(1)
        background-color: #aaa;
        height: 40px;
.row
  flex-wrap: wrap;
  &>div
    display: flex;
    width: 100%;
    &>div
      width: 25%;
      height: 56px;
    &>div:nth-of-type(1)
      height: 56px;
.form
  background-color: rgba(255,255,255, 0.8);
  height: 300px;
  left: 30%;
  position: absolute;
  text-align: center;
  top: 25%;
  width: 500px;
  form
    margin-top: 50px;
    label
      display: inline-block;
      margin: 20px;
      text-align: right;
      width: 60px;
    input
      display: inline-block;
      width: 200px;
      height: 20px;
.set-festivals
  input:nth-of-type(2)
    width: 50px;
</style>
