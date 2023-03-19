<template>
  <div>
    <TileItem>
      <template #icon>
        <div class="i-mdi:message text-2xl" />
      </template>
      <template #heading>
        <div id="headChat">
          <p>Chat</p>
        </div>
      </template>
    </TileItem>
  </div>
  <div id="log">
    <div v-for="message in state.messages" :key="message.content">
      <div v-if="message.role === 'assistant'">
        <div>
          <TileItemReversed>
            <div id="assistant">
              <p>
                {{ message.content }}
              </p>
            </div>
            <template #icon>
              <div class="i-mdi:robot-outline text-2xl" />
            </template>
          </TileItemReversed>
        </div>
      </div>
      <div v-else-if="message.role === 'system'" />
      <div v-else-if="message.role === 'user'">
        <div>
          <TileItem>
            <template #icon>
              <div class="i-mdi:account-voice text-2xl" />
            </template>
            <div id="user">
              <p>
                {{ message.content }}
              </p>
            </div>
          </TileItem>
        </div>
      </div>
      <div v-else-if="message.role === 'loading'">
        <div>
          <TileItemReversed>
            <div id="assistant">
              <p>
                <v-progress-linear
                  indeterminate
                  stream
                  rounded
                  color="cyan"
                />
              </p>
            </div>
            <template #icon>
              <div class="i-mdi:robot-outline text-2xl" />
            </template>
          </TileItemReversed>
        </div>
      </div>
    </div>
    <div>
      <TileItem>
        <template #icon>
          <div class="i-mdi:keyboard text-2xl" />
        </template>
        <div id="inputbox">
          <v-textarea
            id="input"
            v-model="state.newMessage"
            auto-grow
            label="Ask a question"
            type="text"
            :rules="rules"
            single-line
            density="compact"
            :disabled="state.loading"
            hide-details="auto"
            @keyup.enter="chat"
          />
          <v-btn
            :disabled="state.loading"
            theme="dark"
            color="transparent"
            block
            @click="chat"
          >
            <div v-if="state.loading" class="i-svg-spinners:ring-resize text-2xl" />
            <div v-else class="i-mdi:send text-2xl" />
          </v-btn>
        </div>
      </TileItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { io } from 'socket.io-client';
// import hljs from 'highlight.js';
const socket = io(
	'https://wsio.shatteredsky.net/',
	// 'http://localhost:3355/',
	{transports: ['websocket'],}
);
interface ChatMessage {
	role: 'assistant' | 'loading' | 'system' | 'user';
	content: string;
	image?: string;
}
const rules = [
	(v: string) => v.length <= 512 || 'Please enter a message less than 512 characters.',
];
const state = reactive({
	newMessage: '',
	messages: [
		{ role: 'system', content: 'You were installed in a website so that users could interact with you.'},
	] as ChatMessage[],
	loading: false,
})
let slowLoad = false;
const loadingBar = async () => {
	await new Promise(resolve => setTimeout(resolve, 2000));
	if (slowLoad) {
		state.messages = [
			...state.messages,
			{ role: 'loading', content: 'Loading...' },
		]
	}
	return new Promise<void>(resolve => resolve());
}
let receivedMessageInitator = false;
const chat = () => {
	try {
		state.messages = [
			...state.messages,
			{ role: 'user', content: state.newMessage },
		]
		state.newMessage = '';
		state.loading = true;
		receivedMessageInitator = false;
		slowLoad = true;
		let receivedMessage = '';
		// const codeCounter = 0;
		socket.on('GPTanswer', (data: string) => {
			try {
				if (!receivedMessageInitator) {
					receivedMessageInitator = true;
					slowLoad = false;
					state.messages = state.messages.filter(
						message => message.role !== 'loading'
					)
					receivedMessage = data;
					state.messages = [
						...state.messages,
						{ role: 'assistant', content: receivedMessage },
					]
				} else if (data === '[DONE]') {
					state.loading = false;
					socket.off('GPTanswer');
					// hljs.highlightAll();
				} else {
					console.log(data)
					receivedMessage += data;
					// if (receivedMessage.includes('```')) {
					// 	codeCounter += 1;
					// 	if (codeCounter === 1) {
					// 		receivedMessage = receivedMessage.replace('```', '<pre><code>');
					// 	} else if (codeCounter === 2) {
					// 		receivedMessage = receivedMessage.replace('```', '</code></pre>');
					// 		codeCounter = 0;
					// 	}
					// }
					state.messages[state.messages.length - 1] = { role: 'assistant', content: receivedMessage };
				}
			} catch (e) {
				console.error(e);
			}
		});
		loadingBar();
		socket.emit('GPTquestion', state.messages);
		const timeout = async () => {
			await new Promise(resolve => setTimeout(resolve, 120000));
			if (!receivedMessageInitator) {
				state.loading = false;
				state.messages = state.messages.filter(
					message => message.role !== 'loading'
				)
				socket.off('GPTanswer');
			} else if (state.loading) {
				state.loading = false;
				socket.off('GPTanswer');
			}
		}
		timeout();
	} catch (e) {
		console.error(e);
	}
}
onUpdated(() => {
	const chatbox = document.querySelector('#inputbox');
	console.log(chatbox)
	if (chatbox) {
		chatbox.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	}
})
</script>
<script lang="ts">
</script>
  <style>
  @import 'vuetify/styles';
  #user {
	border-radius: 1px;
	padding: 2px;
	margin: 1px;
	width: 95%;
	/* float: left; */
	white-space: pre-wrap;
  }
  #assistant {
	border-radius: 1px;
	padding: 2px;
	margin: 1px;
	width: 95%;
	/* float: right; */
	white-space: pre-wrap;
  }
  #headchat {
	padding: 5px;
	margin: 5px;
  }
  </style>
