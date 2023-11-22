<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <h1 class="text-2xl font-bold">Create Student Account</h1>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="name_field" class="w-full text-start">
                        Name
                    </label>
                    <input name="name" id="name_field" type="text" placeholder="John Doe"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="username_field" class="w-full text-start">
                        Roll Number
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="Roll Number"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                        Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Password"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-row items-center gap-2">
                    <input name="batch" type="number" class="p-2 w-full rounded-md shadow-md" placeholder="Batch" />
                    <input name="year" type="number" class="p-2 w-full rounded-md shadow-md" placeholder="Year" />
                    <input name="section" type="text" class="p-2 w-full rounded-md shadow-md" placeholder="Section" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="dept_field" class="w-full text-start">
                        Department
                    </label>
                    <select name="department" id="dept_field" placeholder="Dept"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md">
                        <option v-for="dep in dept" :key="dep.id" :value="dep.id">{{ dep.name }}</option>
                    </select>
                </div>
                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Create User
                </button>
            </form>
            <hr class="border border-stone-400 w-full lg:w-96" />
            <input type="file" accept=".xlsx ,.xls" ref="fileInput" @change="handleFileChange" />
            <button @click="uploadFile"
                class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">Upload
                Excel File</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { read, utils } from 'xlsx';

interface studentData {
    name: string;
    regno: string;
    password: string;
    department: string;
    batch: number;
    year: number;
    section: string;
}

const stud = ref<studentData[]>([]);

const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const wb = read(arrayBuffer);

        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: studentData[] = utils.sheet_to_json<studentData>(ws);

        data.forEach((element) => {
            element.regno = element.regno.toString();
        });

        stud.value = data;

        // console.log(stud.value);
    };

    reader.readAsArrayBuffer(file);
};

const handleFileChange = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    const selectedFile = fileInput.files?.[0];
    if (selectedFile) {
        handleFileUpload(selectedFile);
    }
};

const uploadFile = async (e: Event) => {
    e.preventDefault();

    stud.value.forEach(async (element) => {
        // console.log(element);
        await upload(element);
    })
}


async function upload(record: studentData) {
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", body: JSON.stringify(record),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "You aren't supposed to be here."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()

        }
    })
}


definePageMeta({
    middleware: "level2"
})
const route = useRoute();

const message = ref({ type: "error", text: "" })

const dept = await useDept()

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        name: formData.get("name"),
        regno: formData.get("username"),
        password: formData.get("password"),
        department: formData.get("department"),
        batch: Number(formData.get("batch")),
        year: Number(formData.get("year")),
        section: formData.get("section"),
    };
    console.log(creds);
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/mentees/new`, {
        method: "POST", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Created user."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            switch (response.status) {
                case 400:
                    // this won't happen
                    message.value.text = "Missing Fields."
                case 401:
                    message.value.text = "You aren't supposed to be here."
                    break;
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()

        }
    })
};
</script>