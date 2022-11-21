<script setup lang="ts">
import { logo_2x_origin } from '../../config';
import SelectionList from './SelectionList.vue';
import ConstraintList from './ConstraintList.vue';
</script>
    
<template>
    <div class="sidebar-box">
        <div class="logo-box">
            <a><img :src="logo_2x_origin" /></a>
        </div>

        <div class="interactive-panel">
            <SelectionList />
        </div>

        <ConstraintList />
    </div>
</template>

<style lang="scss" scoped>
.sidebar-box {
    z-index: 2000;
    position: fixed;
    height: 100%;
    width: 160px;
    left: 0;
    top: 0;
    backdrop-filter: blur(5px);
}

.logo-box {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #eee;

    a {
        display: block;
        cursor: pointer;
    }

    img {
        display: block;
        width: 123px;
        height: 25px;
    }
}

.interactive-panel {
    width: 100%;
}
</style>
