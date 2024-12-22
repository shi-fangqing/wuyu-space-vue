import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/variables.scss'
import './styles/base.css'
import './styles/scrollbar.scss'
import './styles/typography.scss'
import './styles/themes.scss'

const app = createApp(App)
app.use(router)
app.mount('#app')
