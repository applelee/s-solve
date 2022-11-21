<script setup lang="ts">
import { ref, provide } from 'vue';
import ConstraintNavVue from './ConstraintNav.vue';
import PrimitivesNavVue from './PrimitivesNav.vue';
import FootTips from './FootTips.vue';
import SideBar from './SideBar/index.vue';

const current = ref({
    name: "",
    key: "",
});

provide("current", current);

const changeTips = (val: { name: string, key: string }) => {
    current.value = val;
}

window.addEventListener('keyup', e => {
    if (e.code === 'Escape') {
        current.value = { name: "", key: "" }
    }
});
</script>
    
<template>
    <PrimitivesNavVue @selectHandle="changeTips" />
    <ConstraintNavVue @selectHandle="changeTips" />
    
    <SideBar />

    <FootTips />

    <div id="app_canvas"></div>
</template>

<style lang="scss" scoped>
</style>
    