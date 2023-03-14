<script setup lang="ts">
import Chat from '@/components/Chat.vue';
useHead({
	title: 'Chat',
	meta: [{ name: 'description', content: 'Chat with a language model.' }],
});
</script>
<script lang="ts">

export default {
	name: 'Chat',
	components: {
		Chat,
	},
};
</script>
<template>
  <Chat />
</template>
