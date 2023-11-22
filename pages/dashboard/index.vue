<template>
    <div class="p-2 flex flex-col items-center w-full mt-12">
        <div
            class="p-4 flex flex-col items-center gap-4 bg-nitMaroon-100 border-stone-400 border-b border-r shadow-xl rounded-xl max-w-3xl w-full">
            <div class="flex flex-col items-center gap-2">
                <div class="w-full text-start">
                    Welcome, {{ userStore.username }}!
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const userStore = useUserStore()
if(userStore.level === 3) {
    navigateTo("/admin")
}

definePageMeta({
    middleware: [
        "level1"
    ]
})
</script>