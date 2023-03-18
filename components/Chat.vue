<template>
  <div>
    <TileItem>
      <template #icon>
        💬
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
              🤖
            </template>
          </TileItemReversed>
        </div>
      </div>
      <div v-else-if="message.role === 'system'" />
      <div v-else-if="message.role === 'user'">
        <div>
          <TileItem>
            <template #icon>
              🗣️
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
              🤖
            </template>
          </TileItemReversed>
        </div>
      </div>
    </div>
    <div>
      <TileItem>
        <template #icon>
          ⌨️
        </template>
        <div id="inputbox">
          <v-textarea
            id="input"
            v-model="state.newMessage"
            class="mx-auto"
            color="grey-lighten-3"
            auto-grow
            label="Ask a question"
            type="text"
            :rules="rules"
            single-line
            density="compact"
            :disabled="state.loading"
            hide-details="auto"
            append-inner-icon="mdi-send"
            @click:append-inner="chat"
            @keyup.enter="chat"
          />
        </div>
      </TileItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { io } from 'socket.io-client';
const socket = io(
	'https://wsio.shatteredsky.net/',
	{transports: ['websocket'],}
);
// const socket = io('http://localhost:3355/');
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
					receivedMessageInitator = false;
					socket.off('GPTanswer');
				} else {
					receivedMessage = receivedMessage + data;
					state.messages[state.messages.length - 1] = { role: 'assistant', content: receivedMessage };
				}
			} catch (e) {
				console.error(e);
			}
		});
		loadingBar();
		socket.emit('GPTquestion', state.messages);
	} catch (e) {
		console.error(e);
	}
}
</script>
<script lang="ts">
</script>
  <style>
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
