<template>
    <div class="fixed p-4 bottom-0 right-0 space-y-4 z-40">
        <div id="fabItems" class="relative flex flex-col items-center gap-8 justify-start font-atmospheric">
            <div id="fabButton" class="mx-auto rounded-full bg-nitMaroon-600 mx-auto w-16 h-16 z-50">
                <button :class="`p-4 transform transition duration-500 mx-auto ease-in-out mx-auto block`"
                    @click="toggleBoth">
                    <span class="sr-only">Open Action Button</span>
                    <svg class="block h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fccef1"
                        viewBox="0 0 24 24" aria-hidden="true">
                        <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                            stroke-linejoin="round" :d="toggleNav ? `M 6 9 L 12 15 L 18 9` : `M 18 15 L 12 9 L 6 15`" />
                    </svg>
                </button>
            </div>
            <div v-for="navItem, i in FabMenu" :key="navItem.key"
                class="absolute block mx-auto transition duration-500 ease-in-out transform" :style="{
                    transform: `translate(0, ${toggleNav ? -1 * 6 * (i + 1) : 0}rem)`,
                }">
                <a class="relative group justify-center cursor-pointer" :href="navItem.action">
                    <span class="sr-only">{{ navItem.toolTip }}</span>
                    <span class="rounded-full relative group p-4 w-16 h-16 bg-nitMaroon-600 flex flex-row items-center">
                        <div class="stroke-white stroke-2">
                            <svg class="block h-8 w-8 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
                                stroke="#fccef1" viewBox="0 0 24 24" aria-hidden="true">
                                <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                    stroke-linejoin="round" :d="`${navItem.routeIcon}`" />
                            </svg>
                            
                        </div>
                        <div
                            class="absolute -left-28 mr-4 max-w-[70rem] transition-all overflow-hidden duration-500 ease-in-out text-right lg:max-w-0 lg:group-hover:max-w-[70rem]">
                            <MiscTag>{{ navItem.toolTip }}</MiscTag>
                        </div>
                    </span>
                </a>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const toggleNav = ref(false)

const toggleBoth = () => { toggleNav.value = !toggleNav.value }
</script>