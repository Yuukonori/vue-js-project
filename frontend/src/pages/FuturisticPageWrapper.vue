<template>
  <div class="futuristic-page">
    <slot></slot>
  </div>
</template>

<style>
.futuristic-page {
  min-height: 100%;
  padding: 40px;
  background: transparent;
  box-sizing: border-box;
}
@media (max-width: 1024px) {
  .futuristic-page {
    padding: 24px 16px;
  }
}
@media (max-width: 640px) {
  .futuristic-page {
    padding: 16px 12px;
  }
}
</style>
