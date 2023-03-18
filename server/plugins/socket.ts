import { Server, Socket } from 'socket.io';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import writeLog from '../utils/writeLog'

interface ResponseChunk {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: {
		delta: {
			content: string;
		};
		index: number;
		finish_reason: string;
	}[];
}
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const deniedReply = 'Your message was deemed potentially unsafe by the automated moderation API and not sent.'
const errorReply = 'There was an error processing your message. Please try again.'
const baseMessages = [
	{ role: 'system', content: 'You are named Teqbot. You are capable of answering almost any question.'},
	{ role: 'system', content: 'Your creator is named Teq, and he wrote you in Typescript, using the gpt-3.5-turbo model to process questions.'},
	{ role: 'user', content: 'Explain things in technical terms suitable for a college graduate. Use bullet points, numbered lists and code blocks when possible.'},
	{ role: 'user', content: 'For complicated answers, finish by saying "Ask me:" and give several examples of good follow-up questions in bullet points.'},
	{ role: 'user', content: 'You have a limited number of characters you can send, so you have to be brief and information dense.'},
] as ChatCompletionRequestMessage[]
const chatCompletionStreaming = async (messages: ChatCompletionRequestMessage[],
	io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) => {
	writeLog(messages[messages.length - 1].content, true)
	messages = baseMessages.concat(messages)
	try {
		console.time('moderation');
		const moderation = await openai.createModeration({
			input: messages[messages.length - 1].content,
		});
		console.timeEnd('moderation');
		if (moderation.data.results[0].flagged === true) {
			messages.pop();
			return deniedReply;
		} else {
			console.time('conversation');
			try {
				let reply = '';
				const response = await openai.createChatCompletion({
					model: 'gpt-3.5-turbo',
					messages,
					stream: true,
				}, { responseType: 'stream' });
				let streaming = true;
				const readableStream = response.data as unknown as NodeJS.ReadableStream;
				readableStream.on('data', (data: { toString: () => string; }) => {
					const lines = data.toString().split('\n').filter((line: string) => line.trim() !== '');
					for (const line of lines) {
						const message = line.replace(/^data: /, '');
						if (message === '[DONE]') {
							streaming = false;
							console.timeEnd('conversation');
						} else {
							try {
								const parsed: ResponseChunk = JSON.parse(message);
								if (parsed.choices[0].delta.content) {
									reply += parsed.choices[0].delta.content;
									io.emit('GPTanswer', parsed.choices[0].delta.content)
								}
							} catch (error) {
								console.error('Could not JSON parse stream message', message, error);
							}
						}
					}
				});
				let timeout = 0;
				// eslint-disable-next-line no-unmodified-loop-condition
				while (streaming && timeout < 240) {
					// eslint-disable-next-line no-await-in-loop
					await new Promise(resolve => setTimeout(resolve, 500));
					timeout += 1;
				}
				writeLog(reply, false)
				return reply;
			} catch (error) {
				console.error('An error occurred during OpenAI request', error);
				return errorReply;
			}
		}
	} catch (error) {
		console.error('An error occurred during OpenAI request', error);
		return errorReply;
	}
}

// eslint-disable-next-line require-await
export default defineNitroPlugin(async () => {
	console.log('WebSocket Listener Plugin Loaded')
	const io = new Server(3355, {
		cors: {
			origin: '*',
		}
	});

	io.on('connection', (socket) => {
		console.log('Connection', socket.id)
	})

	io.on('connect', (socket) => {
		socket.emit('message', `welcome ${socket.id}`)
		socket.broadcast.emit('message', `${socket.id} joined`)

		socket.on('message', function message (data) {
			console.log('message received: %s', data)
			socket.emit('message', { data })
		})

		socket.on('disconnecting', () => {
			console.log('disconnected', socket.id)
			socket.broadcast.emit('message', `${socket.id} left`)
		})

		socket.on('GPTquestion', (data) => {
			chatCompletionStreaming(data, socket)
		})
	});
})
