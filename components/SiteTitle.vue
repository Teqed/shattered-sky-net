<script setup lang="ts">
</script>

<template>
  <div class="greetings">
    <RouterLink to="/" class="greetings-container">
      <h1 class="blue">
        Shattered Sky
      </h1>
      <h1 class="blue, blur">
        Shattered Sky
      </h1>
    </RouterLink>
    <h2>{{ $t('title.sub') }}</h2>
  </div>
</template>

<style scoped>

.greetings-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	text-decoration: none;
	background-color: transparent;
  }

  .greetings h1 {
	font-size: min(8vw, 3rem);
	top: -10px;
	animation: slidein-top 0.28s ease-out;

	/* Change colors as a gradient */
	background: linear-gradient(
		300deg,
		rgb(132 0 255),
		rgb(174 0 255 / 50%) 20%
	),
	linear-gradient(100deg, rgb(0 242 255 / 90%), rgb(0 136 255 / 50%) 90%);
	background-blend-mode: color-dodge, color-dodge;
	font-weight: 600;
	/* stylelint-disable-next-line property-no-vendor-prefix */
	-webkit-background-clip: text;
	background-clip: text;
	-webkit-text-fill-color: transparent;
  }

  .blur {
	opacity: 0;
	filter: blur(0);
	position: absolute;
	transition: opacity 0.28s ease, filter 0.28s ease;
  }

  .blur:hover {
	opacity: 0.8;
	filter: blur(5px);
  }

  .greetings h2 {
	text-align: center;
	font-size: min(2vw, 0.8rem);
	animation: slidein-top 0.28s ease-out;
	font-weight: 500;
	margin-bottom: 0.5vh;
	color: var(--color-heading);
  }

  @media (min-width: 1200px) {
	/* .greetings h1,
	.greetings h2 {
	text-align: left;
	} */
  }

</style>
