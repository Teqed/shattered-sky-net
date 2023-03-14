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
            auto-grow
            hint="Ask a question"
            type="text"
            rows="3"
            @keyup.enter="handleSendClick"
          />
          <v-btn
            id="send"
            :loading="state.loading"
            :disabled="state.loading"
            block
            color="grey"
            @click="handleSendClick"
            @keyup.enter="handleSendClick"
          >
            Ask
          </v-btn>
        </div>
      </TileItem>
    </div>
  </div>
</template>

<script setup lang="ts">
// We'll be using openai.server.ts to make requests to the OpenAI API.
// We'll be posting to the /api/openai endpoint.
import { reactive } from 'vue';

interface ChatMessage {
	role: 'assistant' | 'system' | 'user';
	content: string;
	image?: string;
}

// let newMessage: string;
const state = reactive({
	newMessage: '',
	messages: [
		{ role: 'system', content: 'You answer questions. You try to be as brief as possible.'}
	] as ChatMessage[],
	loading: false,
})

// let messages: ChatMessage[] = [
// 	{ role: 'system', content: 'You are a helpful assistant.'}
// ];

const chat = async () => {
	state.messages = [
		...state.messages,
		{ role: 'user', content: state.newMessage },
	]

	// Clear the input field.
	state.newMessage = '';

	// Set state.loading to true so the button is disabled.
	state.loading = true;

	// Use the api/openai endpoint to get a response from the GPT-3 model.
	// It's in openai.server.ts and is waiting for
	// event.on('openai', async (request: { body: { messages: any; }; })
	// to be called.
	// You'll be getting back
	// const conversation: AxiosResponse<CreateChatCompletionResponse, any>
	// from openai.server.ts.
	const chatGPTMessage: any = await $fetch('/api/openai', {
		method: 'POST',
		body: JSON.stringify({
			messages: state.messages,
		}),
	});

	// Add the GPT-3 response to the messages array.

	state.messages = [
		...state.messages,
		chatGPTMessage,
	]

	// Scroll to the bottom of the chat log.
	const log = document.querySelector('#log');
	// @ts-ignore
	log.scrollTop = log.scrollHeight;

	// Set state.loading to false so the button is enabled.
	state.loading = false;

	state.messages = [
		...state.messages,
	]
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
	padding: 1px;
	margin: 1px;
	width: 95%;
	/* float: left; */
	white-space: pre-wrap;
  }
  #assistant {
	border-radius: 1px;
	padding: 1px;
	margin: 1px;
	width: 95%;
	/* float: right; */
	white-space: pre-wrap;
  }
  #input {
  }
  #inputbox {
	/* justify contents */
	/* display: flex; */
  }
  #headchat {
	padding: 5px;
	margin: 5px;
  }

  </style>
