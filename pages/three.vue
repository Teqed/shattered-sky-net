<script setup lang="ts">
</script>
<script lang="ts">
</script>
<template>
  <div>
    <div class="item-three">
      <!-- <div class="i-icon-three">
        <slot name="icon-three" />
      </div> -->
      <div class="details tile-three">
        <ClientOnly>
          <NuxtPage :foobar="123" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
<style scoped>
* {
  --animation-generic: fadein 0.28s ease-out, slidein-top 0.28s ease-out;
  }

@media (hover: hover) {
  .item-three a:hover {
    text-decoration: underline;
    background-color: hsl(189deg 65% 21% / 20%);
  }
  }

  .tile-three {
  width: 55vw;
  /* padding: 1vh 1.5vw; */
  /* background: rgb(71 71 71 / 40%);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
  backdrop-filter: saturate(180%) blur(10px); */
  /* stylelint-disable-next-line property-no-vendor-prefix */
  /* -webkit-backdrop-filter: saturate(180%) blur(10px);
  border: 1px solid rgb(121 121 121 / 51%);
  transition: box-shadow 0.28s ease-in-out; */
  }

  .tile:hover {
  box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
  }

  .item-three {
  margin-top: 3vh;
  display: flex;
  }

  .details {
  flex: 1;
  margin-left: 1.5vw;
  animation: var(--animation-generic);
  }

  .i-icon-three {
  opacity: 0;
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;
  color: var(--color-text);
  animation: var(--animation-generic);
  }

  h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5vh;
  color: var(--color-heading);
  }

  /* @mixin for-phone-only { */
  @media (max-width: 599px) {
  .tile {
    width: 85vw;
  }
  }

  /* @mixin for-tablet-portrait-up { */
  @media (min-width: 600px) {
  .tile {
    width: 80vw;
  }

  }

  /* @mixin for-tablet-landscape-up { */
  @media (min-width: 900px) {
  .tile {
    width: 65vw;
  }
  }

  /* @mixin for-desktop-up { */
  @media (min-width: 1200px) {
  .tile {
    width: 45vw;
    padding: 1.2vh 1vw;
  }

  .item-three {
    margin-top: 0;
    padding: 0.4vh 0 1.5vh 2vw;
  }

  .i-icon-three {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    width: 50px;
    height: 50px;
    /* background: rgb(71 71 71 / 40%);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
    backdrop-filter: saturate(180%) blur(10px); */
    /* stylelint-disable-next-line property-no-vendor-prefix */
    /* -webkit-backdrop-filter: saturate(180%) blur(10px);
    border: 1px solid rgb(121 121 121 / 51%); */
  }

  .item-three::before {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item-three::after {
    content: " ";
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item-three:first-of-type::before {
    display: none;
  }

  .item-three:last-of-type::after {
    display: none;
  }

  /* @mixin for-med-desktop-up { */
  @media (min-width: 1800px) {
    /* .tile {
    width: 40vw;
    } */
  }

  /* @mixin for-big-desktop-up { */
  @media (min-width: 1921px) {
    /* .tile {
    width: 30vw;
    } */
  }
  }</style>
