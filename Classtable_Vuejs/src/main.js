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
          "Fri" :[
            {"subject": ""},
            {"subject": ""},
            {"subject": ""},
            {"subject": ""}
          ]
        },
        alter: {
          "festivals": [],
          "classes": []
        }
      }
    }
  },
  el: '#container',
  render: h => h(App)
})