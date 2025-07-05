<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
useHead({
	title: 'Timothy Quilling',
	meta: [{ name: 'description', content: 'About Timothy Quilling.' }],
});
</script>

<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:information-outline text-2xl" />
			</template>
			<template #heading>
				Timothy Quilling
			</template>
			<img src="../assets/images/me.webp" style="
					width: 20%;
					float: right;
					margin-left: 1rem;
					margin-bottom: 1rem;
					border-radius: 1rem;
				" alt="Despite everything, it's still me.">
			<p>
				Hello, I'm also known as Teq, and I'm a software developer with a BSc IT.
			</p>
			<br>
			<p>
				My work has primarily been with designing reliable infrastructure for the US and Canadian public
				sectors. I am
				currently looking for new opportunities and you can find my <a
					href="pdfs/quilling-resume.pdf">professional
					contact
					information here.</a>
			</p>
			<br>
			<p>
				In my spare time I create free software to help others, which I host at <a
					href="https://shatteredsky.net">shatteredsky.net</a>. My most recent
				project is
				a <a href="https://bsky.app/profile/did:plc:m6adptn62dcahfaq34tce3j5">moderation labeler</a> written in
				Rust for
				Bluesky's ATProtocol network.
			</p>
			<br>
			<p>
				Originally from Orlando, on most of my days I can be found enjoying coffee, creating art and riding my
				bike. <a href="https://quilling.dev/blog/more-about-me/">Learn more about me here.</a>
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
