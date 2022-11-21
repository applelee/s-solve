<script setup lang="ts">
import { inject, getCurrentInstance } from 'vue';
import { primitivesIcons } from '../config';

const current = inject('current', { key: "", name: "" });
const proxy = getCurrentInstance()?.proxy as any;
const emit = defineEmits(['selectHandle'])

const clickMethod = (name: string, key: string) => {
    emit("selectHandle", { name, key });
    proxy.$canvas.api[key]();
}
</script>
    
<template>
    <div class="primitives-nav">
        <div
            v-for="value in primitivesIcons"
            :class="`primitives-item${current.key === value.key ? ' current' : ''}`"
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
.primitives-nav {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 160px;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    backdrop-filter: blur(5px);
}

.primitives-item {
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

