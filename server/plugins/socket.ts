import writeLog from '../utils/writeLog';
import { type ChatCompletionRequestMessage } from 'openai';
import { Configuration, OpenAIApi } from 'openai';
import { type Socket } from 'socket.io';
import { Server } from 'socket.io';
import { type DefaultEventsMap } from 'socket.io/dist/typed-events';

type ResponseChunk = {
	choices: Array<{
		delta: {
			content: string;
		};
		finish_reason: string;
		index: number;
	}>;
	created: number;
	id: string;
	model: string;
	object: string;
};
const configuration = new Configuration({
	// eslint-disable-next-line node/no-process-env
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const deniedReply =
	'Your message was deemed potentially unsafe by the automated moderation API and not sent.';
const errorReply =
	'There was an error processing your message. Please try again.';
const baseMessages = [
	{
		content:
			'You are named Teqbot. You are capable of answering almost any question.',
		role: 'system',
	},
	{
		content: 'You are using the gpt-3.5-turbo model to process questions.',
		role: 'system',
	},
	{
		content:
			'Explain things in technical terms suitable for a college graduate. Use bullet points, numbered lists and code blocks when possible.',
		role: 'user',
	},
	{
		content:
			'For complicated answers, finish by saying "Ask me:" and give several examples of good follow-up questions in bullet points.',
		role: 'user',
	},
	{
		content:
			'You have a limited number of characters you can send, so you have to be brief and information dense.',
		role: 'user',
	},
] as ChatCompletionRequestMessage[];
const chatCompletionStreaming = async (
	requestMessages: ChatCompletionRequestMessage[],
	io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
) => {
	let messages = requestMessages;
	const latestMessage = messages[messages.length - 1];
	if (latestMessage) {
		writeLog(latestMessage.content, true);
		messages = baseMessages.concat(messages);
		try {
			console.time('moderation');
			const moderation = await openai.createModeration({
				input: latestMessage.content,
			});
			console.timeEnd('moderation');
			if (moderation.data.results[0]) {
				if (moderation.data.results[0].flagged === true) {
					messages.pop();
					return deniedReply;
				} else {
					console.time('conversation');
					try {
						const response = await openai.createChatCompletion(
							{
								messages,
								model: 'gpt-3.5-turbo',
								stream: true,
							},
							{ responseType: 'stream' },
						);
						const readableStream =
							response.data as unknown as NodeJS.ReadableStream;
						readableStream.on(
							'data',
							(data: { toString: () => string }) => {
								const lines = data
									.toString()
									.split('\n')
									.filter(
										(line: string) => line.trim() !== '',
									);
								for (const line of lines) {
									const message = line.replace(
										/^data: /u,
										'',
									);
									if (message === '[DONE]') {
										io.emit('GPTanswer', message);
										console.timeEnd('conversation');
										readableStream.off('data', () => {});
										return message;
									} else {
										const parsed: ResponseChunk =
											JSON.parse(message);
										if (parsed.choices[0]) {
											const token: string =
												parsed.choices[0].delta.content;
											if (token) {
												io.emit('GPTanswer', token);
												return token;
											}
										}
									}
								}

								return '';
							},
						);
					} catch (error) {
						console.error(
							'An error occurred during OpenAI request',
							error,
						);
						io.emit('GPTanswer', errorReply);
						io.emit('GPTanswer', '[DONE]');
						return errorReply;
					}
				}
			}
		} catch (error) {
			console.error('An error occurred during OpenAI request', error);
			io.emit('GPTanswer', errorReply);
			io.emit('GPTanswer', '[DONE]');
			return errorReply;
		}
	}

	return errorReply;
};

// eslint-disable-next-line require-await
export default defineNitroPlugin(async () => {
	console.log('WebSocket Listener Plugin Loaded');
	const io = new Server(3_355, {
		cors: {
			origin: '*',
		},
	});

	io.on('connection', socket => {
		console.log('Connection', socket.id);
	});

	io.on('connect', socket => {
		socket.emit('message', `welcome ${socket.id}`);
		// socket.broadcast.emit('message', `${socket.id} joined`)

		// socket.on('message', function message (data) {
		// 	console.log('message received: %s', data)
		// 	socket.emit('message', { data })
		// })

		socket.on('disconnecting', () => {
			console.log('disconnected', socket.id);
			// socket.broadcast.emit('message', `${socket.id} left`)
		});

		socket.on('GPTquestion', data => {
			chatCompletionStreaming(data, socket);
		});
	});
});
