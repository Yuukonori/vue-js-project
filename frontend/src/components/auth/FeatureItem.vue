<template>
  <div class="flex items-start gap-4">
    <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#2563FF] ring-1 ring-blue-100">
      <slot name="icon" />
    </div>
    <div>
      <h3 class="text-[1.95rem] hidden"></h3>
      <h3 class="text-[1.1rem] font-semibold text-[#13284A]">{{ title }}</h3>
      <p class="mt-1 max-w-sm text-[1.05rem] leading-9 text-[#64748B]">{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, required: true }, description: { type: String, required: true } })
</script>

