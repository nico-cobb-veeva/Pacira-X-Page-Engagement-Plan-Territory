import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n';
import { getUserLocale, getVeevaMessage } from './lib/myInsights/query';
import Moment from 'moment';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import themePlugin from "./plugins/theme";
import '@/assets/styles/main.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

async function initApp() {
    // create pinia instance
    const pinia = createPinia();
    
    // set the locale specific Veeva Messages
    const languageLocaleKey = await getUserLocale();
    let messages = {   
        [languageLocaleKey]: await getVeevaMessage('en_US')
    };
    // create i18n instance
    const i18n = createI18n({
        legacy: false,
        locale: languageLocaleKey, // set locale
        fallbackLocale: 'en_US', // set fallback locale
        messages, // set locale messages
        silentFallbackWarn: true
    });
    // set the moment locale for date
    let dateLocale = 'en';
    if(languageLocaleKey !== 'en_US') {
        dateLocale = languageLocaleKey.replace('_', '-');
    }
    Moment.locale(dateLocale); 
    Moment.suppressDeprecationWarnings = true;

    library.add(faSort)

    createApp(App)
        .use(router)
        .use(themePlugin)
        .use(pinia)
        .use(i18n)
        .component('font-awesome-icon', FontAwesomeIcon)
        .component('VueDatePicker', VueDatePicker)
        .mount('#app');
}

initApp();