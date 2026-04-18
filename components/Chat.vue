<!--
  Stubbed: original Chat used Vuetify components and a socket.io connection to
  a wsio.shatteredsky.net backend that no longer exists (server/plugins/socket.ts
  was removed during the 2025_rewrite migration).
  Restore from git history (commit a4032f3 or earlier) to revive.
-->
<template>
	<div>
		<TileItem>
			<template #icon>
				<div class="i-mdi:message text-2xl" />
			</template>
			<template #heading>
				<p>Chat</p>
			</template>
			<p>Chat is currently offline.</p>
		</TileItem>
	</div>
</template>
