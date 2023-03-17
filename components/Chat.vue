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
      <div v-else-if="message.role === 'system'">
        <!-- <p>{{ message.content }}</p> -->
      </div>
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
            :loading="state.loading"
            hide-details="auto"
            append-inner-icon="mdi-send"
            @click:append-inner="handleSendClick"
            @keyup.enter="handleSendClick"
          />
        </div>
      </TileItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { io } from 'socket.io-client';

// const { socket } = useNuxtApp();

// Socket Client
const socket = io();

interface ChatMessage {
	role: 'assistant' | 'loading' | 'system' | 'user';
	content: string;
	image?: string;
}

const rules = [
	(v: string) => v.length <= 512 || 'Please enter a message less than 512 characters.',
]

// let newMessage: string;
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

		// Clear the input field.
		state.newMessage = '';

		// Set state.loading to true so the button is disabled.
		state.loading = true;

		// const chatGPTMessage: Promise<string> = $fetch('/api/openai', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		messages: state.messages,
		// 		requestType: 'chatCompletion',
		// 		// requestType: 'chatCompletionStreaming',
		// 	}),
		// });

		// const chatGPTMessage = fetchEventSource('/api/openai', {
		// 	method: 'POST',
		// 	// headers: {
		// 	// 	'Content-Type': 'application/json',
		// 	// },
		// 	body: JSON.stringify({
		// 		messages: state.messages,
		// 		// requestType: 'chatCompletion',
		// 		requestType: 'chatCompletionStreaming',
		// 	}),
		// }) as unknown as Promise<string>;

		// const chatGPTMessage = useAsyncData('openai', () => $fetch('/api/openai', {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		messages: state.messages,
		// 		requestType: 'chatCompletion',
		// 	}),
		// })
		// );

		receivedMessageInitator = false;
		socket.emit('GPTquestion', state.messages);

		slowLoad = true;
		loadingBar();
		let receivedMessage = '';

		socket.on('GPTanswer', (data: string) => {
			// If this is the first message, then...
			if (!receivedMessageInitator) {
			// Remove the loading message from the messages array.
				slowLoad = false;
				state.messages = state.messages.filter(
					message => message.role !== 'loading'
				)
				// Add the data to the receivedMessage object
				receivedMessage = data;
				// Add the GPT-3 response to the messages array.
				state.messages = [
					...state.messages,
					{ role: 'assistant', content: receivedMessage },
				]
				receivedMessageInitator = true;
			} else if (data === '[DONE]') {
				// Set state.loading to false so the button is enabled.
				state.loading = false;
				receivedMessageInitator = false;
			} else {
				// Add the data to the receivedMessage object
				receivedMessage = receivedMessage + data;
				// Update the last message in the messages array.
				state.messages[state.messages.length - 1] = { role: 'assistant', content: receivedMessage };
			}
		});

		// const { data } = await chatGPTMessage;
		// const replyMessage: string = data as unknown as string;
		// const replyMessage: string = await chatGPTMessage

		// Remove the loading message from the messages array.
		// state.messages = state.messages.filter(
		// 	message => message.role !== 'loading'
		// )

		// Add the GPT-3 response to the messages array.

		// state.messages = [
		// 	...state.messages,
		// 	{ role: 'assistant', content: replyMessage },
		// ]

		// const el = document.querySelector('log')?.lastElementChild;
		// if (el) {
		// 	el.scrollIntoView({ behavior: 'smooth' });
		// }

		// Set state.loading to false so the button is enabled.
		// state.loading = false;

		state.messages = [
			...state.messages,
		]
	} catch (e) {
		console.error(e);
	}
}

// When the send button is clicked, send the message.
const handleSendClick = () => {
	chat();
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
