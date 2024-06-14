<script setup lang="ts">

</script>

<template>
    <div class="intro"><slot /></div>
</template>

<style lang="scss" scoped>
    .intro{
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
    }
</style>