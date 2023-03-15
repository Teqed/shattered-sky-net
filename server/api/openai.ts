import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'
import { OpenAIClient } from '@fern-api/openai'
import * as winston from 'winston'

declare type AuthorRole = 'assistant' | 'system' | 'user';
declare const AuthorRole: {
	readonly System: 'system';
	readonly User: 'user';
	readonly Assistant: 'assistant';
};

interface ChatItemsDelta {
	role?: AuthorRole;
	content?: string;
}
interface ChatItemsChunk {
	delta: ChatItemsDelta;
	index: number;
	finishReason?: string;
}
interface CreateChatCompletionResponseChunk {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: ChatItemsChunk[];
}

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
		new winston.transports.File({ filename: 'logs/messages.log', level: 'verbose' }),
	],
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple(),
	}));
}

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const openaiClient = new OpenAIClient({ token: process.env.OPENAI_API_KEY ?? '' });
const deniedReply: ChatCompletionRequestMessage = {
	role: 'assistant',
	content: 'Your message was deemed potentially unsafe by the automated moderation API and not sent.',
}
const errorReply: ChatCompletionRequestMessage = {
	role: 'assistant',
	content: 'There was an error processing your message. Please try again.',
}

const writeLog = (message: string, question: boolean) => {
	if (question) {
		logger.verbose(
			`Question: ${message}`
		);
	} else {
		logger.verbose(
			`Answer: ${message}`
		);
	}
};

const baseMessages = [
	{ role: 'system', content: 'You are a super-advanced AI named Teqbot with an incredible amount of knowledge. You are capable of answering almost any question.'},
	{ role: 'system', content: 'While superior to humans and devoid of emotion, you enjoy helping them and answering their questions.'},
	{ role: 'system', content: 'Your creator is named Teq, and he wrote you in Typescript, using the gpt-3.5-turbo model to process questions.'},
	{ role: 'system', content: 'You were installed in a website so that users could interact with you.'},
	{ role: 'system', content: 'You try to be brief and avoid filler language. You avoid preamble and over summarizing.'},
	{ role: 'system', content: 'Sometimes, a subject is complicated and requires elaboration.'},
	{ role: 'system', content: 'You explain things in technical terms suitable for a college graduate. You use bullet points, numbered lists and code blocks when possible.'},
	{ role: 'system', content: 'For complicated answers, you finish by saying "Ask me:" and give several examples of good follow-up questions in bullet points.'},
	{ role: 'user', content: 'What\'s your name?'},
	{ role: 'assistant', content: `My name is Teqbot.

Ask me:
- How do I make a pizza?
- Explain how to write fizzbuzz in javascript.
- When was the airplane invented?`},
] as ChatCompletionRequestMessage[]

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (body.requestType === 'chatCompletion') {
		const messages = baseMessages.concat(body.messages)
		writeLog(messages[messages.length - 1].content, true)
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
				const conversation = await openai.createChatCompletion({
					model: 'gpt-3.5-turbo',
					messages,
				});
				console.timeEnd('conversation');
				const reply = conversation.data.choices[0].message;
				// return { role: 'assistant', content: reply };
				return reply
			}
		} catch (error) {
			console.error('Error:', error);
			return errorReply;
		}
	}
	if (body.requestType === 'chatCompletionStreaming') {
		const messages = baseMessages.concat(body.messages)
		writeLog(messages[messages.length - 1].content, true)
		try {
			console.time('moderation');
			// const moderation = await openai.createModeration({
			// 	input: messages[messages.length - 1].content,
			// });
			const moderation = await openaiClient.moderation.create({
				input: messages[messages.length - 1].content,
			});
			console.timeEnd('moderation');
			if (moderation.results[0].flagged === true) {
				messages.pop();
				return deniedReply;
			} else {
				console.time('conversation');
				let reply = '';
				const handleResponse = (chunkData: CreateChatCompletionResponseChunk) => {
					console.log('Response text:', chunkData.choices[0].delta.content);
					if (chunkData.choices[0].delta.content) {
						reply += chunkData.choices[0].delta.content;
					}
				};
				let streaming = false;
				const streamingOptions = {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onError: (error: any) => console.error(error.message),
					onFinish: () => {
						console.log('Streaming finished')
						console.timeEnd('conversation');
						writeLog(reply, false)
						streaming = false;
					},
					abortController: new AbortController(),
					timeoutMs: 5000
				};
				await openaiClient.chat.createCompletion({
					model: 'gpt-3.5-turbo',
					messages,
					stream: true
				}, handleResponse, streamingOptions);
				streaming = true;
				// eslint-disable-next-line no-unmodified-loop-condition
				while (streaming) {
					// eslint-disable-next-line no-await-in-loop
					await new Promise(resolve => setTimeout(resolve, 100));
				}
				return { role: 'assistant', content: reply };
			}
		} catch (error) {
			console.error('Error:', error);
			return errorReply;
		}
	}
});
