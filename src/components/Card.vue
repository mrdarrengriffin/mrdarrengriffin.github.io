<script setup lang="ts">
import TypeText from "@/components/TypeText.vue";

defineProps({
    text: String,
});
</script>

<template>
    <div class="card">
        <i class="decoration-tab"></i>
        <i class="decoration-cutout"></i>
        <TypeText :text="text" />
        <div class="decoration-line"></div>
    </div>
</template>

<style scoped lang="scss">
.card {
    --text: var(--dark);
    --background: var(--light);

    display: inline-flex;
    
    
    font-size: 1.5rem;
    padding: 1.5rem;
    position: relative;
    justify-content: center;

    .decoration-tab {
        --size: 1rem;
        position: absolute;
        bottom: calc(100% - 1px);
        height: var(--size);
        left: 0;
        width: 4rem;
        background: var(--light);
        // clip path, square but the top right is a goes 45 deg into bottom right
        clip-path: polygon(0 0, calc(100% - var(--size)) 0, 100% 100%, 0 100%);
    }

    .decoration-cutout {
        --size: 1rem;
        position: absolute;
        height: var(--size);
        top: 0;
        right: -1px;
        width: var(--size);
        background: var(--dark);

        // clip path, square but the top right is a goes 45 deg into bottom right
        clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%);
    }

    .decoration-line {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 80%;
        height: 2px;
        top: calc(100% + 4px);
        background: var(--light);

        &:before {
            content: "";
            position: absolute;
            width: 10px;
            height: 100%;
            background: var(--light);
            right: calc(100% + 6px);
            top: 0;
        }
    }
}
</style>
