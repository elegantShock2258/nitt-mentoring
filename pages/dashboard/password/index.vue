<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <h1 class="text-2xl font-bold">Change Password</h1>
            <form class="flex flex-col items-center gap-4 pt-8" @submit="e => handleSubmit(e)">
                
                
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                      Current Password
                    </label>
                    <input name="current-password" id="current-password_field" type="password" placeholder="Current Password"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                        New Password
                    </label>
                    <input name="new-password" id="new-password_field" type="password" placeholder="New Password"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>
                <div class="flex flex-col items-center gap-2">
                    <label htmlFor="password_field" class="w-full text-start">
                        Confirm Password
                    </label>
                    <input name="confirm-password" id="confirm-password_field" type="password" placeholder="Confirm Password"
                        class="p-2 w-full lg:w-96 rounded-md shadow-md" />
                </div>


                <MiscMessage
                    :class="`${message.text ? `opacity-100` : `opacity-0`} transition duration-500 ease-in-out w-full lg:w-96`"
                    :type="message.type">
                    {{ message.text }}</MiscMessage>
                <button type="submit"
                    class="rounded-md transition duration-500 ease-in-out transform hover:-translate-y-1 bg-nitMaroon-600 text-white py-2 px-8">
                    Change Password
                </button>
            </form>
            <hr class="border border-stone-400 w-full lg:w-96" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: "level1"
})
const route = useRoute();
const userStore = useUserStore();
const username=userStore.username;

const message = ref({ type: "error", text: "" })

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form as HTMLFormElement);
    const creds = {
        
        currentPassword: formData.get("current-password"),
        newPassword: formData.get("new-password"),
        confirmPassword: formData.get("confirm-password"),
        username:username
        
    };
    const auth = useCookie<string>("nitt_token");
    if (!auth.value) return false;
    await useFetch<{ token: string }>(`/api/users/password`, {
        method: "PATCH", body: JSON.stringify(creds),
        headers: { "Authorization": `Bearer ${auth.value}` },
        onResponse({ request, response, options }) {
            message.value.type = "info"
            message.value.text = "Password has been changed successfully."
        },
        onResponseError({ request, response, options }) {
            message.value.type = "error"
            console.log(response);
            switch (response.statusText) {
                case "ENTER_CURRENT_PASSWORD":
                    message.value.text = "Please enter your current password";
                    break;
                case "CONFIRM_PASSWORD":
                    message.value.text = "Please confirm your new password"
                    break;
                case "PASSWORD_MISMATCH":
                    message.value.text = "Please make sure the new password's match"
                    break;   
                case "USER_NOT_FOUND":
                    message.value.text = "User not found"
                    break;  
                case "WRONG_CURRENT_PASSWORD":
                    message.value.text = "Incorrect current password"
                    break;  
                case "INTERNAL_SERVER_ERROR":  
                    message.value.text="Internal server error";
                    break;          
                default:
                    message.value.text = "An unknown error occurred";
                    break;
            }
            abortNavigation()

        }    })
};
</script>