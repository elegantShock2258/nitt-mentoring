<template>
    <div class="tracking-wide flex flex-col items-center min-h-screen">
        <section class="flex-grow flex w-full">
            <UiHeader />

            <main class="ml-[4rem] flex flex-col flex-grow">
                <section class="w-full flex flex-row items-center p-4">
                    <div class="flex flex-row items-center gap-2">
                        <img src="/nitt_logo_min.webp" class="w-20 h-20" />
                        <h1 class="text-lg lg:text-2xl font-bold">National Institute of Technology Tiruchirappalli</h1>
                     </div>
                </section>
                <section class="flex-grow px-4">
                    <slot />
                </section>

            </main>
        </section>
        <UiFooter />
    </div>
</template>
<script setup lang="ts">
const route = useRoute()
useHead({
    title: `${route.meta.title || `Mentoring`}`
})
</script>