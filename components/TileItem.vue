<template>
  <div class="item">
    <div class="i-icon">
      <slot name="icon"></slot>
    </div>
    <div class="details tile">
      <h3>
        <slot name="heading"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
@import '~/assets/style/tileitem.css';
</style>
