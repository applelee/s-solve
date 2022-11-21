<script setup lang="ts">
import { inject } from 'vue';

const tips = inject('current', {
    name: "",
    key: "",
});
</script>
    
<template>
    <div class="foot-tips">
        <span>{{ tips.name }}</span>
    </div>
</template>

<style lang="scss" scoped>
.foot-tips {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    margin-left: 80px;

    span {
        font-size: 14px;
        color: #666;
        text-decoration: underline;
    }
}
</style>
    