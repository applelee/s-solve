<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { IConstraintVertex } from '@/solver/gs/interface';
import ConstraintList from './ConstraintList.vue';
import { ElementUtil, VColor } from '@/app';

const key = ref<number>(-1);
const elements = ref<IConstraintVertex[]>([]);
const proxy = getCurrentInstance()?.proxy as any;

const mouseOver = (k: number) => {
    key.value = k;
    const cv = elements.value[k];
    const element = ElementUtil.findElement(cv.id, proxy.$canvas.app.vscene.children);
    element?.material.color.set(VColor.PINK);
    proxy.$canvas.app.onceRender();
    proxy.$mitter.emit('selectElement', [cv]);
}

const mouseLeave = (k: number) => {
    const cv = elements.value[k];
    const element = ElementUtil.findElement(cv.id, proxy.$canvas.app.vscene.children);
    element?.material.color.set(element.userData.color);
    proxy.$mitter.emit('selectElement', []);
    proxy.$canvas.app.onceRender();
    key.value = -1;
}

onMounted(() => {
    proxy.$mitter.on('elementData', (data: IConstraintVertex[]) => {
        elements.value = data;
    })
})
</script>

<template>
    <div class="selection-list">
        <div
            v-for="item, k in elements"
            :class="`selection-item ${key === k ? 'current' : ''}`"
            @mouseenter.stop="mouseOver(k)"
            @mouseleave.stop="mouseLeave(k)"
        >
            <span>{{ item.type }}</span>

            <ConstraintList />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.selection-list {
    width: 100%;
}

.selection-item {
    height: 40px;
    border-top: 1px solid;
    border-image: linear-gradient(to right, #66666600, #666, #66666600) 1;

    &.current, &:hover {
        background-color: #CAE8F1;
    }

    span {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 12px;
    }
}
</style>
