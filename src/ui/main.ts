import { createApp } from 'vue';
import mitt from 'mitt';
import Main from './view/Main.vue';
import { CanvasUtils } from './utils';

import './style.css';

const vm = createApp(Main);
const mitter = mitt();
/** eventbus */
vm.config.globalProperties.$mitter = mitter;
vm.mount('#app');

/** canvas */
const root = document.getElementById('app_canvas');
if (!root) throw new Error('dont find app_canvas dom');
const canvas = new CanvasUtils(vm, root, window);
vm.config.globalProperties.$canvas = canvas;
window.addEventListener('resize', () => {
    canvas.app.updateCanvas(window.innerWidth, window.innerHeight);
});
