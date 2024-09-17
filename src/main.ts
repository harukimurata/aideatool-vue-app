import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'

import App from './App.vue'
import CreateConfirm from './components/MatchTable/CreateConfirm.vue'
import CommonModal from './components/Modal/CommonModal.vue'
import ErrorModal from './components/Modal/ErrorModal.vue'
import headerComponent from './components/headerComponent.vue'
import footerComponent from './components/footerComponent.vue'
import RestaurantFooter from './components/Restaurant/Footer.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.component('create-confirm', CreateConfirm)
app.component('common-modal', CommonModal)
app.component('error-modal', ErrorModal)
app.component('header-component', headerComponent)
app.component('footer-component', footerComponent)
app.component('restaurant-footer', RestaurantFooter)
app.mount('#app')
