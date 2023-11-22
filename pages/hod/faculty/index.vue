<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <h1 class="text-2xl uppercase font-bold w-full text-left">All Faculty In {{ userStore.department }}</h1>
        <div class="p-4 flex flex-col items-center gap-4 w-full">
            <div class="flex flex-col items-center gap-2 w-full">
                <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
                    <div class="flex flex-col items-end gap-4">
                        <button class="bg-nitMaroon-600 text-white rounded-md p-2"
                            @click="_ => expandFilter = !expandFilter">Filter
                            {{ expandFilter ? `-` : `+` }}</button>
                        <div
                            :class="`${expandFilter ? `max-h-[90rem]` : `max-h-0`} flex flex-col lg:flex-row gap-2 overflow-y-hidden transition-all duration-500 ease-in-out`">
                            <input type="text" id="search_field" v-model="search"
                                class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                                placeholder="Name" />
                        </div>
                    </div>
                </div>
                <div v-if="mentors"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch w-full gap-4 mt-5 pr-4 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-6xl">
                    <ul v-for="mentor in computedmentors" :key="mentor.id"
                        class="text-start bg-zinc-100 rounded-md p-2 block w-full">
                        <li class="font-bold text-center">{{ mentor.name }}</li>
                        <li class="font-semibold text-xs text-center">#{{ mentor.id }}</li>
                        <li class="font-semibold text-xs text-center">{{ mentor.menteeCount }} Mentees</li>
                        <li>
                            <a :href="`/hod/faculty/${mentor.id}`"> <span class="sr-only">Manage Mentees</span>
                                <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                        stroke-linejoin="round" :d="`${AllIcons.userplus}`" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: [
        "level2"
    ]
})
const userStore = useUserStore()
console.log(userStore.department)
const mentors = await useAllFaculty();

const computedmentors = computed(() => {
    return !expandFilter.value ? mentors :
        mentors.filter(x => {
            return (
                (search.value.startsWith("#") ? String(x.id).startsWith(search.value.slice(1)) : x.name.toLowerCase().includes(search.value.toLowerCase()))
            )
        })
})

const search = ref("")
const expandFilter = ref(false)
</script>