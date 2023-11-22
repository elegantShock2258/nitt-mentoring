<template>
    <header class="flex absolute lg:relative top-0 left-0 bg-nitMaroon-650 z-50 h-[95vh]">
        <div class="flex flex-col justify-between w-full md:max-w-7xl lg:max-w-[100rem]">
            <button class="block p-4" @click="(_e) => navState = !navState">
                <span class="sr-only">Open menu</span>
                <svg class="h-8 w-8 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 30 24" aria-hidden="true">
                    <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                        stroke-linejoin="round" :d="navState
                            ? `M 6 24 L 24 6 M 6 6 L 24 24 M 6 24 L 24 6`
                            : `M 4 6 L 28 6 M 4 14 L 20 14 M 4 22 L 26 22`" />
                </svg>
            </button>
            <div :class="`z-40 p-4 top-0 bg-nitMaroon-650 flex-grow overflow-y-auto flex flex-col ${route.path !== `/login` ? `justify-between` : `justify-end`} items-start gap-8 uppercase text-sm text-white transition-all duration-500 ease-in-out transform h-[95vh] lg:h-auto overflow-y-hidden lg:overflow-y-visible overflow-x-hidden w-full ${navState ? `max-w-lg` : `max-w-[4rem]`
                }`">
                <div v-if="userStore.loggedIn" class="flex flex-col gap-8">
                    <div class="mt-8" />
                    <a v-for="route in MainMenu.filter(x => x.level <= userStore.level && (userStore.level === 3 ? x.level === 3 : true))" :href="route.action"
                        :key="route.key"
                        :class="`flex flex-row items-center gap-2 transition duration-200 ease-in-out border-b-2 border-transparent ${navState ? `hover:border-nitMaroon-300` : `justify-center w-full`}`"
                        :title="route.toolTip">
                        <svg class="block w-5 h-5 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fccef1"
                            viewBox="0 0 24 24" aria-hidden="true">
                            <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                                stroke-linejoin="round" :d="`${route.routeIcon}`" />
                        </svg>
                        <span
                            :class="`font-semibold truncate hover:text-nitMaroon-300 transition-all duration-200 ease-in-out overflow-hidden ${navState ? `max-w-lg` : `max-w-0`}`">
                            {{ route.name }}
                        </span>
                    </a>
                </div>
                <!-- If logged in -->
                <button v-if="userStore.loggedIn" title="Logout"
                    :class="`flex flex-row items-center gap-2 transition duration-200 ease-in-out border-b-2 border-transparent ${navState ? `hover:border-nitMaroon-300` : `justify-center w-full`}`"
                    @click="signOut">
                    <svg class="block w-5 h-5 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fccef1"
                        viewBox="0 0 24 24" aria-hidden="true">
                        <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                            stroke-linejoin="round" :d="`${AllIcons.logout}`" />
                    </svg>
                    <span
                        :class="`font-semibold truncate hover:text-nitMaroon-300 transition-all duration-200 ease-in-out overflow-hidden ${navState ? `max-w-lg` : `max-w-0`}`">
                        Sign Out
                    </span>
                </button>
                <!-- If not logged in -->
                <a v-else href="/login" title="Login"
                    :class="`flex flex-row items-center gap-2 transition duration-200 ease-in-out border-b-2 border-transparent ${navState ? `hover:border-nitMaroon-300` : `justify-center w-full`}`">
                    <svg class="block w-5 h-5 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#fccef1"
                        viewBox="0 0 24 24" aria-hidden="true">
                        <path class="transition-all duration-500 transform ease-in-out" stroke-linecap="round"
                            stroke-linejoin="round" :d="`${AllIcons.login}`" />
                    </svg>
                    <span
                        :class="`font-semibold truncate hover:text-nitMaroon-300 transition-all duration-200 ease-in-out overflow-hidden ${navState ? `max-w-lg` : `max-w-0`}`">
                        Sign In
                    </span>
                </a>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
const navState = ref(true)
const route = useRoute()
const userStore = useUserStore()
const auth = useCookie<string>("nitt_token")
const signOut = () => {
    auth.value = ""
    userStore.signOut()
    navigateTo("/login")
}
</script>