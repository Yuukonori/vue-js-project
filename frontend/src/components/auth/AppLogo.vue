<template>
  <div :class="['flex items-center gap-4', centered ? 'justify-center' : 'justify-start']">
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563FF] to-[#4F7DFF] text-white shadow-[0_14px_28px_-14px_rgba(37,99,255,0.75)]">
      <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <path d="M3 7 12 2l9 5-9 5-9-5Z" />
        <path d="M3 12l9 5 9-5" />
        <path d="M3 17l9 5 9-5" />
      </svg>
    </div>
    <div>
      <p class="text-[3.1rem] hidden"></p>
      <p class="text-[2.25rem] font-bold leading-none tracking-tight text-[#13284A]">BuilderUI</p>
      <p class="mt-1 text-[1.05rem] font-medium text-[#64748B]">Management Systems</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ centered: { type: Boolean, default: false } })
</script>

