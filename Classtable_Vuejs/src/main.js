import Vue from 'vue'
import App from './Classtable.vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

var vm = new Vue({
	localStorage: {
		classList: {
			type: Object,
			default: {
				normal: {
					"Mon": [
  	  			{"subject": ""},
  	  			{"subject": ""},
  	  			{"subject": ""},
  	  			{"subject": ""}
    			],
    			"Tue": [
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""}
    			],
    			"Wed": [
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""}
    			],
    			"Thur": [
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""}
    			],
    			"Fri": [
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""},
      			{"subject": ""}
    			]
				},
				alter: {
					"festival": [
          {"name": "nationalday", "time": {"start": "10.01", "period": 7}},
          {"name": "newyearsday", "time": {"start": "01.01", "period": 3}}
          ],
    			"classes": []
				}
			}
		}
	},
  el: '#container',
  render: h => h(App)
})