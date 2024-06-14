<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
    text: String,
    delay: { type: Number, default: 1000 },
});

const typed = ref("");
const isTyping = ref(true);

const type = () => {
    const currentIndex = typed.value.length;
    const text = props.text;

    if(!text) return;

    if (currentIndex < text.length) {
        typed.value = text.slice(0, currentIndex + 1);
        // rand between 10 and 500
        const rand = Math.floor(Math.random() * 100) + 10;
        setTimeout(type, rand);
    } else {
        isTyping.value = false;
    }
};

setTimeout(type, props.delay);
</script>

<template>
    <div class="typed-text">
        <div class="hidden">{{ text }}_</div>
        <div class="typed">
            {{ typed
            }}<span class="cursor" :class="{ blink: !isTyping }">_</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.typed-text {
    display: inline-flex;
    grid-auto-columns: max-content;
    .hidden{
        visibility: hidden;
    }
    .typed{
        position: absolute;
    }
}

.cursor {
    animation: blink 0.6s infinite step-start;
}

// blink no fade
@keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
}
</style>
