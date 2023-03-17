import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import * as winston from 'winston'

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
interface ResponseSingle {
	data: {
		id: string;
		object: string;
		created: number;
		model: string;
		choices: {
			message: {
				content: string;
			};
		}[];
	}
}
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
const deniedReply = 'Your message was deemed potentially unsafe by the automated moderation API and not sent.'
const errorReply = 'There was an error processing your message. Please try again.'

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
	{ role: 'system', content: 'You are named Teqbot. You are capable of answering almost any question.'},
	{ role: 'system', content: 'Your creator is named Teq, and he wrote you in Typescript, using the gpt-3.5-turbo model to process questions.'},
	{ role: 'user', content: 'Explain things in technical terms suitable for a college graduate. Use bullet points, numbered lists and code blocks when possible.'},
	{ role: 'user', content: 'For complicated answers, finish by saying "Ask me:" and give several examples of good follow-up questions in bullet points.'},
	{ role: 'user', content: 'You have a limited number of characters you can send, so you have to be brief and information dense.'},
] as ChatCompletionRequestMessage[]

const chatCompletion = async (body: { messages: ConcatArray<ChatCompletionRequestMessage>; }) => {
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
			}) as unknown as ResponseSingle;
			console.timeEnd('conversation');
			const reply = conversation.data.choices[0].message.content;
			writeLog(reply, false)
			return reply
		}
	} catch (error) {
		console.error('Error:', error);
		return errorReply;
	}
};

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (body.requestType === 'chatCompletion') {
		return chatCompletion(body);
	}
	return 'No requestType specified.'
});
