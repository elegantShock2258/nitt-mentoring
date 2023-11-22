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
        <h1 class="text-2xl font-bold self-start mt-12">Meetings</h1>
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch w-full gap-4 mt-5 pr-4 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-6xl">
            <ul v-for="meeting, i in meetings" :key="`meeting_${meeting.id}`"
                class="text-start bg-zinc-100 rounded-md p-2 block w-full">
                <li class="font-bold">Meeting #{{ meetings.length - i }}</li>
                <li class="font-semibold text-xs">{{ new Date(meeting.date).toISOString().split("T")[0].split("-").reverse().join("/") }}</li>
                <li>{{ meeting.discussion }}</li>
                <li>
                    <button @click="_ => setMeeting(meeting.id)" class="mx-auto flex items-center justify-center">
                        <span class="sr-only">Edit Info</span>
                        <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                stroke-linejoin="round" :d="`${AllIcons.services}`" />
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
        <div v-if="!meetings.length">No past meetings</div>
        <div
            :class="`${modelOpen ? `visible` : `invisible`} rounded-xl w-full md:max-w-2xl bg-white fixed z-50 p-4 flex flex-col items-center`">
            <div class="flex justify-between w-full">
                <div>Editing Details For {{ meetings.length - meetings.findIndex(x => x.id ===  currentMeeting) }}</div>
                <button class="self-end" @click="_ => modelOpen = false">
                    X
                </button>
            </div>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <input type="date" name="date_field" :value="meetings.find(x => x.id ===  currentMeeting)?.date.toISOString().split(`T`)[0]" :max="new Date().toISOString().split(`T`)[0]"
                    class="p-2 rounded-md w-48 lg:w-72 shadow-md" />
                <h2 class="text-xl font-bold">Discussion:</h2>
                <textarea name="discussion_field" class="p-2 rounded-md w-48 lg:w-72 shadow-md" :value="meetings.find(x => x.id ===  currentMeeting)?.discussion" />
                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Update Meeting Info
                </button>
            </form>
        </div>
        <div :class="`${modelOpen ? `visible` : `invisible`} bg-black/40 backdrop-blur-md inset-0 w-full fixed z-40`">
        </div>
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
    meetings.value = mentee.meetings.map(x => ({ ...x, date: new Date(x.date) })).sort((a, b) => b.id - a.id);
    //  meetings.value = mentee.meetings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const message = ref({ type: "error", text: "" })
const modelOpen = ref(false);
const currentMeeting = ref(-1)
const setMeeting = (meetingId: number) => {
    currentMeeting.value = meetingId;
    modelOpen.value = true;
}


const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        date: formData.get("date_field"),
        discussion: formData.get("discussion_field"),
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/meetings/${currentMeeting.value}`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Updated meeting info."
            const i = meetings.value.findIndex(x => x.id ===  currentMeeting.value)
            meetings.value[i].date = new Date(String(creds.date));
            meetings.value[i].discussion = String(creds.discussion);
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "You are not supposed to be here."
                    break;
                case 404:
                    message.value.text = "No such meeting exists."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()

        }
    })
}
</script>