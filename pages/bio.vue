<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
useHead({
	title: 'About me',
	meta: [{ name: 'description', content: 'Teq — software developer and BSc IT.' }],
});
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:information-outline text-2xl" />
			</template>
			<template #heading>
				About
			</template>
			<img src="../assets/images/me.webp" style="
					width: 20%;
					float: right;
					margin-left: 1rem;
					margin-bottom: 1rem;
					border-radius: 1rem;
				" alt="Despite everything, it's still me.">
			<p>
				Hello, my name is Teq (they/them), American software developer and BSc IT.
			</p>
			<br>
			<p>
				In my spare time I create free software to help my friends, which I primarily host at
				<NuxtLink to="/">shatteredsky.net</NuxtLink>. My preferred language for new projects is Rust and my
				preferred environment is NixOS.
			</p>
			<br>
			<p>
				Originally from Orlando, on most of my days I can be found enjoying coffee, creating art or walking to
				the local deli. <a href="https://quilling.dev/blog/more-about-me/">Learn more about me here</a>.
			</p>

			<p />
		</TileItem>
		<TileItem>
			<template #icon>
				<div class="i-mdi:pencil-outline text-2xl" />
			</template>
			<template #heading>
				Contact
			</template>

			<p>
				Reach out to me by email <a href="mailto:teqed@shatteredsky.net">teqed@shatteredsky.net</a> (<a
					href="https://openpgpkey.shatteredsky.net/pgp.txt">PGP</a>) or <a
					href="https://bsky.app/profile/did:plc:jrtgsidnmxaen4offglr5lsh">Bluesky</a>.
			</p>
		</TileItem>
	</div>
</template>
