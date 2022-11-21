<script setup lang="ts">
import { ref, getCurrentInstance, onMounted } from 'vue';
import { IConstraintEdge, IConstraintVertex } from '@/solver/gs/interface';
import { VertexMethod } from '@/solver/gs/common';
import { UnarySizeConstraint } from '@/solver/gs/config';

const constraints = ref<IConstraintEdge[]>([]);
const proxy = getCurrentInstance()?.proxy as any;

onMounted(() => {
    proxy.$mitter.on('selectElement', (data: IConstraintVertex[]) => {
        const us : IConstraintEdge[] = [];
        const bs : IConstraintEdge[] = [];
        
        if (data.length < 0) return;
        for (const d of data) {
            Array.prototype.push.apply(us, Array.from(d.ringA).filter(ce => {
                return UnarySizeConstraint.has(ce.type);
            }));
            Array.prototype.push.apply(bs, VertexMethod.allBinaries(d).filter(ce => !ce.isStruct));
        }
        constraints.value = us.concat(bs);
    })
})
</script>

<template>
    <div :class="`constraint-list ${constraints.length > 0 ? 'current' : ''}`">
        <!-- <div class="constraint-item">
            <span>none</span>
        </div> -->
        <!-- <div v-else v-for="item in constraints" class="constraint-item">
            <span>{{ item.type }}</span>
            <i>+</i>
        </div> -->

        <div v-for="item in constraints" class="constraint-item">
            <span>{{ item.type }}</span>
            <!-- <div class="delete"><i>+</i></div> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.constraint-list {
    width: 160px;
    height: 100vh;
    position: fixed;
    z-index: 3000;
    left: 160px;
    top: 0;
    background-color: #CAE8F1;
    display: none;
    flex-direction: column;
    justify-content: center;

    &.current {
        display: flex;
    }
}

.constraint-item {
    height: 30px;
    padding: 0 5px 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    position: relative;
    
    &:hover {
        background-color: #eee;

        .delete {
            display: flex;
            background-color: #eee;
        }
    }

    span {
        color: #333;
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .delete {
        display: none;
        justify-content: center;
        align-items: center;
        height: 30px;
        width: 30px;
        position: absolute;
        top: 0;
        right: -30px;
        color: #333;
        font-size: 20px;
        cursor: pointer;

        &:hover i {
            color: white;
        }
    }

    i {
        right: -30px;
        color: #333;
        font-size: 20px;
        transform: rotate(45deg);
    }
}
</style>
