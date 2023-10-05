<template>
    <div :class="`w-16 cursor-pointer relative transition duration-300 ease-in-out h-8 flex items-center ${toggled ? 'bg-green-700 relative' : 'bg-zinc-700'
        } rounded-full`" @click="toggle">
        <div :class="`p-px flex justify-center items-center transition-all duration-300 ease-in-out transform absolute w-5 h-5 rounded-full ${toggled
                ? 'absolute left-9 bg-white'
                : 'bg-white'
            } left-1 top-1 bottom-1 my-auto`"></div>
        <div class="text-sm capitalize flex flex-row items-center hidden">
            <span v-if="toggled" class="absolute left-2.5">open</span>
            <span v-else class="absolute left-7">closed</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const { turnedOn } = defineProps<{ turnedOn: boolean }>()
const emit = defineEmits<{ (event: 'update', state: boolean): void }>()
const toggled = ref(turnedOn)

const toggle = () => {
    toggled.value = !toggled.value
    emit('update', toggled.value)
}

</script>