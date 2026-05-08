<template>
  <section class="w-full max-w-[760px] rounded-[28px] border border-[#E2E8F0] bg-white/95 p-10 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:p-12">
    <div class="mb-10 text-center">
      <AppLogo centered />
      <p class="mt-3 text-[1.05rem] font-semibold uppercase tracking-[0.2em] text-[#64748B]">MANAGEMENT SYSTEMS</p>
    </div>
    <form class="space-y-6" @submit.prevent="submit">
      <div>
        <label for="email" class="mb-3 block text-[1.05rem] font-semibold text-slate-700">Email address</label>
        <div class="flex h-14 items-center rounded-xl border border-slate-300 bg-white px-4 transition-all duration-200 hover:border-blue-300 focus-within:border-[#2563FF] focus-within:ring-4 focus-within:ring-blue-100">
          <svg class="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>
          <input id="email" v-model="email" type="email" autocomplete="email" placeholder="name@company.com" class="h-full w-full bg-transparent px-3 text-[1.05rem] text-slate-900 placeholder:text-slate-400 focus:outline-none" />
        </div>
      </div>
      <div>
        <div class="mb-3 flex items-center justify-between">
          <label for="password" class="text-[1.05rem] font-semibold text-slate-700">Password</label>
          <button type="button" class="text-[1rem] font-semibold text-[#2563FF] hover:text-[#1f4fce]">Forgot password?</button>
        </div>
        <div class="flex h-14 items-center rounded-xl border border-slate-300 bg-white px-4 transition-all duration-200 hover:border-blue-300 focus-within:border-[#2563FF] focus-within:ring-4 focus-within:ring-blue-100">
          <svg class="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3"/></svg>
          <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Enter your password" class="h-full w-full bg-transparent px-3 text-[1.05rem] text-slate-900 placeholder:text-slate-400 focus:outline-none" />
          <button type="button" class="text-slate-500 hover:text-slate-700" @click="showPassword = !showPassword">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
      <label class="inline-flex items-center gap-2 text-[1.03rem] text-slate-600 dark:text-slate-300"><input v-model="remember" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-[#2563FF]"/><span>Remember me</span></label>
      <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <button type="submit" class="group inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#2563FF] to-[#4F7DFF] text-[1.18rem] font-semibold text-white shadow-[0_18px_30px_-16px_rgba(37,99,255,0.75)] transition-all duration-200 hover:-translate-y-0.5">
        <span>Sign in</span><svg class="h-5 w-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
      </button>
      <div class="relative py-2 text-center"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-700"></div></div><span class="relative bg-white px-4 text-sm text-slate-500">or</span></div>
      <button type="button" class="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white text-[1.08rem] font-semibold text-[#2563FF] transition hover:bg-slate-50"><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 7v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V7l-8-4Z"/></svg><span>System Access Policy</span><svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg></button>
    </form>
  </section>
</template>
<script setup>
import { ref } from 'vue'
import AppLogo from './AppLogo.vue'
const props = defineProps({ onAuthenticate: { type: Function, default: null } })
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(true)
const error = ref('')
function submit(){ if(!email.value.trim()||!password.value.trim()){ error.value='Please enter your email and password.'; return } error.value=''; props.onAuthenticate?.({email:email.value.trim(),password:password.value,remember:remember.value}) }
</script>

