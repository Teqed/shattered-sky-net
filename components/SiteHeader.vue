<script setup lang="ts">
</script>
<script lang="ts"></script>
<template>
  <div class="logo-container">
    <img
      alt="Site logo blur"
      class="logo-blur"
      src="../assets/icons/ss-logo.min.svg"
    >
    <NuxtLink to="/" class="logo-link">
      <img alt="Site logo" class="logo" src="../assets/icons/ss-logo.min.svg">
    </NuxtLink>
  </div>
  <div class="wrapper">
    <!-- Site title -->
    <SiteTitle />

    <!-- Navigation links -->
    <nav>
      <NuxtLink to="/">
        {{ $t('nav.home') }}
      </NuxtLink>
      <NuxtLink to="/files">
        {{ $t('nav.files') }}
      </NuxtLink>
      <NuxtLink to="/tabletop">
        {{ $t('nav.tabletop') }}
      </NuxtLink>
      <NuxtLink to="/stream">
        {{ $t('nav.stream') }}
      </NuxtLink>
      <NuxtLink to="/social">
        {{ $t('nav.social') }}
      </NuxtLink>
      <NuxtLink to="/about">
        {{ $t('nav.about') }}
      </NuxtLink>
    </nav>
  </div>
</template>
<style>
.logo-container {
	display: flex;
	margin: 0 4vw 2vh;
	position: sticky;
	float: left;
  }

  .logo-container:hover {
	text-decoration: none;
  }

  .logo {
    width: min(15vw, 125px);
    height: auto;
	animation: fadein 0.28s ease-out, slidein-top 0.28s ease-out;
	justify-self: center;
  }

  .logo-blur {
    width: min(15vw, 125px);
    height: auto;
	filter: blur(10px);
	position: absolute;
	opacity: 0.1;
	transition: opacity 0.28s ease-in-out;
  }

  .logo-container:hover .logo-blur {
	opacity: 0.6;
  }

  .logo-link {
	text-decoration: none;
	background-color: transparent;
  }

  header {
	margin: auto;
	max-width: fit-content;
  padding: 2rem 5vw 2rem 2rem;
	line-height: 1.5;
	min-height: 10vh;
	display: flex;
	place-items: center;
	flex-wrap: wrap;
	justify-content: center;
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
  }

  nav {
  user-select: none; /* standard syntax */
  -webkit-user-select: none; /* webkit (safari, chrome) browsers */
  -moz-user-select: none; /* mozilla browsers */
  -khtml-user-select: none; /* webkit (konqueror) browsers */
  -ms-user-select: none; /* IE10+ */
	margin: auto;
	box-sizing: content-box;
	content: "";
	clear: both;
	display: table;
	font-size: min(3vw, 1rem);
	text-align: center;
	margin-top: 1.5vh;
	padding: 0.55vh 0.2vw;
	background: rgb(71 71 71 / 40.4%);
	border-radius: 16px;
	box-shadow: 0 4px 30px rgb(121 121 121 / 10%);
	backdrop-filter: saturate(180%) blur(20px);
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-backdrop-filter: saturate(180%) blur(20px);
	border: 1px solid rgb(121 121 121 / 51%);
	transition: box-shadow 0.28s ease-in-out;
	animation: fadein 0.28s ease-out, slidein-top 0.28s ease-out;
  }

  nav:hover {
	box-shadow: 0 4px 30px rgb(121 121 121 / 25%);
  }

  nav a.router-link-exact-active {
	color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
	background-color: transparent;
  }

  nav a {
	display: inline;
	padding: 0 min(3vw, 1rem);
	border-left: 1px solid var(--color-border);
  }

  @media (hover: hover) {
	nav a:hover {
	text-decoration: none;
	background-color: hsl(189deg 65% 21% / 0%);
	}
  }

  nav a:first-of-type {
	border: 0;
  }

  @media (max-width: 800px) {
    header {
      display: block;
    }
  }

</style>
