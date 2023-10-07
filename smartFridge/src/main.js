import { createApp} from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import Toast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'

// Vue.prototype.$http = axios

createApp(App).mount('#app')

const app = createApp(App);
app.use(Toast)
// app.use(router);
app.mount("#app");