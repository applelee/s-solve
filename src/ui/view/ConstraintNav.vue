<script setup lang="ts">
import { inject, getCurrentInstance } from 'vue';
import { constraintIcons } from '../config';

const current = inject('current', { key: "", name: "" });
const proxy = getCurrentInstance()?.proxy as any;
const emit = defineEmits(['selectHandle'])

const clickMethod = (name: string, key: string) => {
    emit("selectHandle", { name, key });
    proxy.$canvas.api[key]();
}
</script>
    
<template>
    <div class="constraint-nav">
        <div
            v-for="value in constraintIcons"
            :class="`constraint-item${current.key === value.key ? ' current' : ''}`" 
        >
            <img
                :src="current.key === value.key ? value.path_active : value.path" 
                :alt="value.name"
                @click="clickMethod(value.name, value.key)"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.constraint-nav {
    position: fixed;
    z-index: 1500;
    top: 60px;
    left: 160px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    backdrop-filter: blur(5px);
    border-top: 1px solid;
    border-image: linear-gradient(to right, #66666600, #666, #66666600) 1;
}

.constraint-item {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: #eee;
    }

    &.current {
        background-color: #666;

        &:hover {
            background-color: #666;
        }
    }

    img {
        width: 26px;
        height: 26px;
    }
}
</style>