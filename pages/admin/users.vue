<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <h1 class="text-2xl uppercase font-bold w-full text-left">All Users</h1>
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
                <div v-if="users"
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch w-full gap-4 mt-5 pr-4 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-6xl">
                    <ul v-for="user in computedusers" :key="user.id"
                        class="text-start bg-zinc-100 rounded-md p-2 block w-full">
                        <li class="font-bold text-center">{{ user.username }}</li>
                        <li class="font-semibold text-xs text-center">#{{ user.id }}</li>
                        <li class="font-semibold text-xs text-center">{{ user.level }}</li>
                        <li>
                            <button @click="_ => setUser(user.username)" class="mx-auto flex items-center justify-center">
                                <span class="sr-only">Edit Password</span>
                                <svg class="block w-5 h-5 stroke-2 stroke-rose-700 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                        stroke-linejoin="round" :d="`${AllIcons.services}`" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
                <div
                    :class="`${modelOpen ? `visible` : `invisible`} rounded-xl w-full md:max-w-2xl bg-white fixed z-50 p-4 flex flex-col items-center`">
                    <div class="flex justify-between w-full">
                        <div>Editing Password For {{ currentUser }}</div>
                        <button class="self-end" @click="_ => modelOpen = false">
                            X
                        </button>
                    </div>
                    <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                        <div class="flex flex-col items-center gap-2">
                            <label htmlFor="password_field" class="w-full text-start">
                                New Password
                            </label>
                            <input id="password_field" type="password" placeholder="Password" v-model="newPass"
                                class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                        </div>
                        <div class="flex flex-col items-center gap-2">
                            <label htmlFor="password_field" class="w-full text-start">
                                Confirm Password
                            </label>
                            <input id="password_field" type="password" placeholder="Password" v-model="confirmPass"
                                class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                        </div>
                        <MiscMessage
                            :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                            :type="message.type">
                            {{ message.text }}</MiscMessage>
                        <button type="submit"
                            class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                            Update Password
                        </button>
                    </form>
                </div>
                <div
                    :class="`${modelOpen ? `visible` : `invisible`} bg-black/40 backdrop-blur-md inset-0 w-full fixed z-40`">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
definePageMeta({
    middleware: [
        "level3"
    ]
})
const modelOpen = ref(false);
const currentUser = ref("")
const userStore = useUserStore()
const users = await useAllUsers();

const newPass = ref("")
const confirmPass = ref("")

const setUser = (user: string) => {
    currentUser.value = user;
    modelOpen.value = true;
}

const computedusers = computed(() => {
    return !expandFilter.value ? users :
        users.filter(x => {
            return (
                (search.value.startsWith("#") ? String(x.id).startsWith(search.value.slice(1)) : x.username.toLowerCase().includes(search.value.toLowerCase()))
            )
        })
})

const search = ref("")
const expandFilter = ref(false)

const message = ref({ type: "error", text: "" })
const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const password = newPass.value;
    if (password !== confirmPass.value) {
        message.value.type = "error"
        message.value.text = "Passwords do not match"
        return;
    }
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch(`/api/users/edit`, {
        method: "PATCH", body: JSON.stringify({ username: currentUser.value, password }),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Updated user."
            newPass.value = "";
            confirmPass.value = "";
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
                    message.value.text = "No such user exists."
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