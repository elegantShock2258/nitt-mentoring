<template>
    <div :class="`p-2 flex flex-col items-stretch`">
        <div class="p-2 rounded-xl items-center flex justify-between bg-nitMaroon-100">
            <div class="flex items-center gap-8">
                <div class="flex flex-col items-stretch gap-2" title="Allow Editing">
                    <MiscSwitch :turned-on="mentee.enable_edit_profile" />
                </div>
                <div class="text-xl font-semibold">{{ mentee.name }} #{{ mentee.register_number }}</div>
            </div>
            <button @click="toggleDrop">
                <svg class="h-8 w-8 stroke-nitMaroon-600 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 30 24" aria-hidden="true">
                    <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                        stroke-linejoin="round" :d="editOpen
                            ? `M 18 15 L 12 9 L 6 15` : `M 6 9 L 12 15 L 18 9`" />
                </svg>
            </button>
        </div>
        <div
            :class="`${editOpen ? `max-h-[999rem]` : `max-h-[0rem]`} overflow-y-hidden transition-all duration-500 ease-in-out bg-nitMaroon-100/50 flex flex-col space-y-4`">
            <div class="p-2">
                <a :href="`/dashboard/mentees/${mentee.register_number}`" class="flex items-center gap-2 max-w-xs mx-auto">
                    <span class="text-rose-700">Check Meeting
                        Details</span>
                    <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                            stroke-linejoin="round" :d="`${AllIcons.userplus}`" />
                    </svg>
                </a>
            </div>
            <div class="p-2">
                <!-- BASIC STUDENT INFO -->
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Basic Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateBasic(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_batch">Batch</label>
                            <input type="number" name="student_batch" id="student_batch" class="font-semibold p-2 w-48"
                                :value="mentee.batch" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_year">Year</label>
                            <input type="number" name="student_year" id="student_year" class="font-semibold p-2 w-48"
                                :value="mentee.year" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_section">Section</label>
                            <input type="text" name="student_section" id="student_section" class="font-semibold p-2 w-48"
                                :value="mentee.section" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${basicMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="basicMessage.type">
                        {{ basicMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Edit Basic Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />
                <!-- STUDENT PERSONAL INFO -->
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Personal Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updatePersonal(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_blood">Blood Group</label>
                            <input type="number" name="student_blood" id="student_blood" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.blood_group" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_mobile">Mobile Number</label>
                            <input type="number" name="student_mobile" id="student_mobile" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_whatsapp" id="student_whatsapp" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_date_of_birth">Date Of Birth</label>
                            <input type="date" name="student_date_of_birth" id="student_date_of_birth"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.date_of_birth" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_gender">Gender</label>
                            <select name="student_gender" id="student_gender" class="font-semibold p-2 w-48">
                                <option value="male" :selected="mentee.personal_info.gender === `male`">Male</option>
                                <option value="female" :selected="mentee.personal_info.gender === `female`">Female</option>
                            </select>
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_email_id">Email ID</label>
                            <input type="email" name="student_email_id" id="student_email_id" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.email_id" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${personalMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="personalMessage.type">
                        {{ personalMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Edit Personal Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />

                <!-- STUDENT FATHER INFO -->
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Father Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateFather(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_name">Name</label>
                            <input type="number" name="student_f_name" id="student_f_name" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.father?.name" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_occupation">Occupation</label>
                            <input type="number" name="student_f_occupation" id="student_f_occupation"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.occupation" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_mobile">Mobile Number</label>
                            <input type="number" name="student_f_mobile" id="student_f_mobile"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_f_whatsapp" id="student_f_whatsapp"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_email_id">Email ID</label>
                            <input type="email" name="student_f_email_id" id="student_f_email_id"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.email_id" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_f_address">Address</label>
                            <input type="text" name="student_f_address" id="student_f_address"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.father?.address" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${fatherMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="fatherMessage.type">
                        {{ fatherMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Edit Father Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" />
                <!-- STUDENT MOTHER INFO -->
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Mother Info</h2>
                <form class="flex flex-col items-center gap-4 mt-5 max-w-3xl mx-auto" @submit="e => updateMother(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_name">Name</label>
                            <input type="number" name="student_m_name" id="student_m_name" class="font-semibold p-2 w-48"
                                :value="mentee.personal_info.mother?.name" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_occupation">Occupation</label>
                            <input type="number" name="student_m_occupation" id="student_m_occupation"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.occupation" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_mobile">Mobile Number</label>
                            <input type="number" name="student_m_mobile" id="student_m_mobile"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.mobile_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_whatsapp">WhatsApp Number</label>
                            <input type="text" name="student_m_whatsapp" id="student_m_whatsapp"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.whatsapp_number" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_email_id">Email ID</label>
                            <input type="email" name="student_m_email_id" id="student_m_email_id"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.email_id" />
                        </div>
                        <div class="grid grid-cols-2 items-center max-w-xs">
                            <label for="student_m_address">Address</label>
                            <input type="text" name="student_m_address" id="student_m_address"
                                class="font-semibold p-2 w-48" :value="mentee.personal_info.mother?.address" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${motherMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="motherMessage.type">
                        {{ motherMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Edit Mother Info
                    </button>
                </form>
                <hr class="mt-4 border-1 border-nitMaroon-600 max-w-6xl mx-auto" /> <!-- SPECIAL ACHIEVEMENT INFO -->
                <h2 class="mt-4 text-2xl font-bold uppercase mx-auto text-center">Achievements / Special Info</h2>
                <form class="flex flex-col items-center gap-4 pt-8" @submit="e => updateSpecial(e)">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div v-for="field in specialFields" :key="field" class="flex flex-col items-center gap-2">
                            <label :htmlFor="field" class="w-full text-start">
                                {{ field.split("_").map(x => x.slice(0, 1).toUpperCase() + x.slice(1)).join(" ") }}
                            </label>
                            <textarea :name="field" :id="field" :value="mentee.achievements[field]"
                                class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                        </div>
                    </div>
                    <MiscMessage
                        :class="`${specialMessage.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                        :type="specialMessage.type">
                        {{ specialMessage.text }}</MiscMessage>
                    <button type="submit"
                        class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                        Edit Special Info
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Student } from "@/types/types.js"
const { mentee } = defineProps<{ mentee: Student }>()
const editOpen = ref(false)

const specialMessage = ref({ type: "error", text: "" })
const basicMessage = ref({ type: "error", text: "" })
const personalMessage = ref({ type: "error", text: "" })
const fatherMessage = ref({ type: "error", text: "" })
const motherMessage = ref({ type: "error", text: "" })

const toggleDrop = () => editOpen.value = !editOpen.value

const updateSpecial = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds: Student["achievements"] = {};
    for (const key of specialFields) {
        creds[key] = formData.get(key) as string || ""
    }
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/special`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            specialMessage.value.type = "success"
            specialMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            specialMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    specialMessage.value.text = "Missing Fields."
                case 401:
                    specialMessage.value.text = "You aren't supposed to be here."
                    break;
                default:
                    specialMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};

const updateBasic = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Partial<Student> = {
        year: Number(formData.get("student_year") as string),
        batch: Number(formData.get("student_batch") as string),
        section: formData.get("student_section") as string,
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/basic`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            basicMessage.value.type = "success"
            basicMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            basicMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    basicMessage.value.text = "Missing Fields."
                case 401:
                    basicMessage.value.text = "You aren't supposed to be here."
                    break;
                default:
                    basicMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};

const updatePersonal = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Omit<Omit<Student["personal_info"], "father">, "mother"> = {
        blood_group: formData.get("student_blood") as string,
        mobile_number: formData.get("student_mobile") as string,
        whatsapp_number: formData.get("student_whatsapp") as string,
        date_of_birth: new Date(formData.get("student_date_of_birth") as string),
        gender: formData.get("student_gender") as string,
        email_id: formData.get("student_email_id") as string,
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/basic`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            personalMessage.value.type = "success"
            personalMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            personalMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    personalMessage.value.text = "Missing Fields."
                case 401:
                    personalMessage.value.text = "You aren't supposed to be here."
                    break;
                default:
                    personalMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};

const updateFather = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Student["personal_info"]["father"] = {
        name: formData.get("student_f_name") as string,
        occupation: formData.get("student_f_occupation") as string,
        mobile_number: formData.get("student_f_mobile") as string,
        whatsapp_number: formData.get("student_f_whatsapp") as string,
        email_id: formData.get("student_f_email_id") as string,
        address: formData.get("student_f_address") as string,
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/father`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            fatherMessage.value.type = "success"
            fatherMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            fatherMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    fatherMessage.value.text = "Missing Fields."
                case 401:
                    fatherMessage.value.text = "You aren't supposed to be here."
                    break;
                default:
                    fatherMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};

const updateMother = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const data: Student["personal_info"]["mother"] = {
        name: formData.get("student_m_name") as string,
        occupation: formData.get("student_m_occupation") as string,
        mobile_number: formData.get("student_m_mobile") as string,
        whatsapp_number: formData.get("student_m_whatsapp") as string,
        email_id: formData.get("student_m_email_id") as string,
        address: formData.get("student_m_address") as string,
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/update/${mentee.register_number}/mother`, {
        method: "PATCH", body: JSON.stringify(data),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            fatherMessage.value.type = "success"
            fatherMessage.value.text = "Updated details."
        },
        onResponseError({ request, response, options }) {
            fatherMessage.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    fatherMessage.value.text = "Missing Fields."
                case 401:
                    fatherMessage.value.text = "You aren't supposed to be here."
                    break;
                default:
                    fatherMessage.value.text = "An unknown error occurred";
                    break;
            }
        }
    })
};
</script>