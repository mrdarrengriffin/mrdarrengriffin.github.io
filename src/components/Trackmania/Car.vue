<script setup lang="ts">
import { onMounted } from 'vue';
import Car from './Car.js';
import { DSAP } from '../../utils/dsap.js';


onMounted(() => {
    const car = new Car('car');
    new DSAP();
});
</script>

<template>
    <div>
        <div class="car-wrapper" data-dsap data-dsap-scroll>
            <div id="car" data-scroll="5"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .car-wrapper{
        width: 100%;
        height: 400vh;

        #car{
            width: 100%;
            height: 100vh;
            position: sticky;
            top: 0;
        }
    }
</style>