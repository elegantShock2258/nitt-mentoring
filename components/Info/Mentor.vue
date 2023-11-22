<template>
    <div class="flex flex-col gap-8 w-full">
        <h1 class="text-2xl font-bold uppercase">Managing mentees for: {{ mentor.name }}</h1>
            <div class="flex items-center gap-2">
                <span class="uppercase font-bold">Total number of Mentees:</span>
                <span class="font-semibold">{{ mentor.menteeCount }}</span>
            </div>
    </div>
</template>
<script setup lang="ts">
import type { FacultyInfo, User } from '@/types/types.js';
const { mentor } = defineProps<{
    mentor: FacultyInfo & { menteeCount: number }
}>()
console.log(mentor)
</script>