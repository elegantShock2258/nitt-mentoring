<template>
    <div v-if="mentee" class="lg:px-4 mx-auto w-full flex flex-col items-start lg:items-center">
        <InfoMentee v-if="mentee" :mentee="mentee" />
        <div class="flex flex-row items-center justify-start lg:justify-end w-full gap-4">
            <div class="flex flex-col items-end gap-4">
                <a v-if="mentee" :href="`/dashboard/mentees/${mentee.register_number}/meetings/new`"
                    class="bg-nitMaroon-600 text-white rounded-md p-2">
                    New Meeting</a>
            </div>
        </div>
        <div class="flex lg:hidden flex-col items-stretch w-full gap-4 mt-5 pr-4 max-w-sm sm:max-w-xl md:max-w-2xl">
            <ul v-for="meeting in meetings" :key="`meeting_${meeting.id}`"
                class="text-start bg-zinc-100 rounded-md p-2 block w-full">
                <li class="font-bold">Meeting #{{ meeting.id }}</li>
                <li class="font-semibold text-xs">{{ new Date(meeting.date).toISOString().split("T")[0] }}</li>
                <li>{{ meeting.discussion }}</li>
                <li>
                    <a :href="`/dashboard/mentees/${regno}/meetings/${meeting.id}`"
                        class="flex flex-row items-center justify-start gap-2"><span class="text-rose-700">View</span>
                        <svg class="block w-5 h-5 stroke-2 stroke-rose-700" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                stroke-linejoin="round" :d="`${AllIcons.reports}`" />
                        </svg>
                    </a>
                </li>
            </ul>
        </div>
        <h1 class="text-2xl font-bold self-start mt-12">Meetings</h1>
        <table class="hidden lg:table table-auto border-collapse w-full mt-5">
            <thead class="bg-nitMaroon-600 text-white">
                <th>Meeting #</th>
                <th>Date</th>
                <th>Discussions</th>
                <th>View</th>
            </thead>
            <tbody>
                <tr v-for="meeting, i in meetings" :key="`meeting_${meeting.id}`"
                    class="text-center odd:bg-nitMaroon-100 even:bg-zinc-100 border-t border-nitMaroon-100 border-spacing-y-2">
                    <td>{{ meetings.length - i }}</td>
                    <td>{{ new Date(meeting.date).toISOString().split("T")[0] }}</td>
                    <td>{{ meeting.discussion }}</td>
                    <td>
                        <a :href="`/dashboard/mentees/${regno}/meetings/${meeting.id}`"> <span
                                class="sr-only">Edit</span>
                            <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                    stroke-linejoin="round" :d="`${AllIcons.reports}`" />
                            </svg>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <div v-if="!meetings.length">No past meetings</div>
    </div>
</template>
<script setup lang="ts">
import type { Meeting } from "@/types/types.js"
definePageMeta({
    middleware: [
        "level1"
    ]
})
const userStore = useUserStore()
const route = useRoute();

const regno = route.params.regno as string;

const mentee = await useMentee(regno)

const meetings = ref<Meeting[]>([])

if (!mentee) {
    nextTick(() => {
        alert("No such student exists with Reg #" + regno)
        navigateTo("/dashboard")
    })
} else {
    meetings.value = mentee.meetings.map(x => ({ ...x, date: new Date(x.date) })).sort((a, b) => b.date.getTime() - a.date.getTime());
    //  meetings.value = mentee.meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
</script>