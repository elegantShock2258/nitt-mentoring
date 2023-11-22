<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <h1 class="text-2xl font-bold">Edit User Password</h1>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="username_field" class="w-full text-start">
                        Username
                    </label>
                    <input name="username" id="username_field" type="text" placeholder="JohnDoe"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                        Password
                    </label>
                    <input name="password" id="password_field" type="password" placeholder="Password"
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
            <hr class="border border-stone-400 w-full lg:w-96" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "level3"
})
const route = useRoute();

// If the user was redirected via middleware
let redirect = route.query.redirect as string;
// Else
if (!redirect) redirect = "/dashboard"

const message = ref({ type: "error", text: "" })

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        username: formData.get("username"),
        password: formData.get("password"),
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch(`/api/users/edit`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Updated user."
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