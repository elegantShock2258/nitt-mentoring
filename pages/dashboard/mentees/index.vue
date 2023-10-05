<template>
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl uppercase font-bold">Your Mentees</h1>
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <button class="bg-nitMaroon-600 text-white rounded-md p-2" @click="_ => expandFilter = !expandFilter">Filter
                    {{ expandFilter ? `-` : `+` }}</button>
                <div
                    :class="`${expandFilter ? `max-h-[90rem]` : `max-h-0`} flex flex-col lg:flex-row gap-2 overflow-y-hidden transition-all duration-500 ease-in-out`">
                    <input type="text" id="search_field" v-model="batch"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Batch" />
                    <input type="text" id="search_field" v-model="classSection"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Section" />
                    <input type="text" id="search_field" v-model="search"
                        class="w-48 lg:w-72 p-2 rounded-md border-nitMaroon-600 border bg-nitMaroon-50"
                        placeholder="Name / #Reg No." />
                </div>
            </div>
        </div>
        <div class="flex flex-col space-y-4">
            <EditableMentee v-for="mentee in computedMentees" :mentee="mentee" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: [
        "level1"
    ]
})
const mentees = await useMentee()

const computedMentees = computed(() => {
    return !expandFilter.value ? mentees :
        mentees.filter(x => {
            return (
                (search.value.startsWith("#") ? x.register_number.startsWith(search.value.slice(1)) : x.name.toLowerCase().includes(search.value.toLowerCase())) &&
                (batch.value ? x.batch === Number(batch.value) : true) &&
                (classSection.value ? x.section === classSection.value : true)
            )
        })
})

const search = ref("")
const batch = ref("")
const classSection = ref("")
const expandFilter = ref(false)
</script>