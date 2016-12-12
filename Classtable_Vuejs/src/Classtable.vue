<template>
<div id="container">
<label for="col">col</label><input @change="display" type="radio" name="display" id="col" checked/>
<label for="row"></label>row<input @change="display" type="radio" name="display" id="row"/>
<select @change="setDate(); render();" v-model="selected">
  <option v-for="week in 16" :value="week">第{{ week }}周</option>
</select>
<div class="table" :class="{ row: isRow }">
<div v-for="(item, index) in days">
	<div>{{ item }}<br />{{ dates[index] }}</div>
  <div v-for="lesson in classTable[index]" @click="edit">
  	<span>{{ lesson.subject }}</span><br />
    <span>{{ lesson.teacher }}</span><br />
    <span>{{ lesson.room }}</span>
  </div>
</div>
</div>
<div v-if="isEdit" class="form">
<form>
<label for="subject">Subject:</label><input v-model="subject" type="input" id="subject"></input><br />
<label for="teacher">Teacher:</label><input v-model="teacher" type="input" id="teacher"></input><br />
<label for="room">Room:</label><input v-model="room" type="input" id="room"></input><br />
<button @click.prevent="edit">Cancel</button>
<button @click.prevent="apply">Apply</button>
<button @click.prevent="applyAll">Apply to all</button>
</form>
</div>
</div >
</template>

<script>
export default {
	data () {
		return {
			isRow: false,
      isEdit: false,
			days: ["Mon", "Tue", "Wed", "Thur", "Fri"],
      selected: 1,
      dates: [],
      classData: {},
      classTable: [],
      target: '',
      subject: '',
      teacher: '',
      room: ''
		}
	},
	methods: {
    render () {
      this.classData = {};
      this.classTable = [];
      this.handleData();
      this.alterClass();
      this.festival();
    },
    handleData () {
      this.classData = this.$localStorage.get('classList');
      var classNormalData = this.classData.normal;
      for(var day in classNormalData) {
        this.classTable.push(classNormalData[day]);
      }
    },
		display () {
			this.isRow = !this.isRow;
		},
    edit (e) {
      this.isEdit = !this.isEdit;
      this.target = e.currentTarget;
    },
    setDate () {
      this.dates = [];
      for(var i = 0; i < this.days.length; i++){
        var date = new Date(),
            start = date.setFullYear(2016,8,19), //设置初始日期
            end = date.setDate(date.getDate(start) + i + (this.selected - 1) * 7), //每周叠加日期
            time = new Date(end),
            //格式化日期
            mon = time.getMonth()+1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1,
            day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(),
            time = mon + "." + day;

        this.dates.push(time);
      }
    },
    apply () {
      var everyday = this.target.parentNode,
          time = everyday.firstChild.childNodes[2].textContent;

      for(var i = 0; i < everyday.childNodes.length; i++){
        if(everyday.childNodes[i] == this.target){
          var lesson = i - 2;
          break;
        }
      }

      var alterClass = {
            "time": time,
            "lesson": lesson,
            "subject": this.subject,
            "teacher": this.teacher,
            "room": this.room
          };

      this.classData.alter.classes.push(alterClass);
      this.$localStorage.set('classList', this.classData);
      this.isEdit = !this.isEdit;
      
      this.alterClass();
    },
    applyAll () {
      var everyday = this.target.parentNode,
          day = everyday.firstChild.childNodes[0].textContent;

      for(var i = 0; i < everyday.childNodes.length; i++){
        if(everyday.childNodes[i] == this.target){
          var lesson = i - 2;
          break;
        }
      }
      this.classData.normal[day][lesson].subject = this.subject;
      this.classData.normal[day][lesson].teacher = this.teacher;
      this.classData.normal[day][lesson].room = this.room;
      this.$localStorage.set('classList', this.classData);
      this.isEdit = !this.isEdit;
    },
    alterClass () {
    	var alterclasses = this.classData.alter.classes;

      if(alterclasses != []){ //判断更改是否存在
  		  for(var i = 0; i < alterclasses.length; i++){ //循环读取更改数据
  	  	  var alterclass = alterclasses[i],
  	          date = alterclass.time,
              lesson = alterclass.lesson;
  	  		for(var j = 0; j < 5; j++){ //循环读取一周的每一天
  	    		var time = this.dates[j],
                classes = this.classTable[j][lesson];
  	    		if(time == date){
              classes.subject = alterclass.subject;
              classes.room = alterclass.room;
  	  		  	classes.teacher = alterclass.teacher;
              break;
  	  	    }
  	  	  }
  	    } 
      } 
    },
    festival(){
			var everyday = document.querySelectorAll('.table > div'),
					time = this.dates[0] * 100, //乘100解决浮点数加减问题
					festival = this.classData.alter.festival;

			for(var i = 0; i < festival.length; i++){
	  		var date = festival[i].time.start * 100,
	  	  		name = festival[i].name,
		  			period = festival[i].time.period;

	  		//处理假日出现在某一周开头或者，中间的情况
	  		if((date >= time) && (date <= parseFloat(time)+5)){
					for(var j = date-time; j <= period; j++){
            var classday = this.classTable[j];
	      		for(var k = 0; k < classday.length; k++){
	  	    		classday[k].subject = name;
              classday[k].teacher = "";
              classday[k].room = "";
	      		}
	    		}
	    		break;
      	}

      	//处理假日跨过两周的情况
      	if((date < time) && (date+period >= time)){
      		period = date+period-time-1;
					for(var j = 0; j <= period; j++){
            var classday = this.classTable[j];
	      		for(var k = 0; k < classday.length; k++){
              classday[k].subject = name;
              classday[k].teacher = "";
              classday[k].room = "";
	      		}
	    		}
	    		break;
      	}
			}
		}
	},
  mounted () {
    this.handleData();
    this.alterClass();
  },
  created () {
    this.setDate();
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
  position: absolute;
  width: 500px;
  height: 300px;
  background-color: rgba(255,255,255, 0.8);
  top: 25%;
  left: 30%;
  text-align: center;
  form
    margin-top: 50px;
    label
      display: inline-block;
      text-align: right;
      width: 60px;
      margin: 20px;
    input
      display: inline-block;
      width: 200px;
      height: 20px;
</style>