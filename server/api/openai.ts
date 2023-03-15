import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import * as winston from 'winston'

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
	//
	// - Write all logs with importance level of `error` or less to `error.log`
	// - Write all logs with importance level of `info` or less to `combined.log`
	//
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
		// Create a file just for message logging
		new winston.transports.File({ filename: 'logs/messages.log', level: 'verbose' }),
	],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.simple(),
	}));
}

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const deniedReply: ChatCompletionRequestMessage = {
	role: 'assistant',
	content: 'Your message was deemed potentially unsafe by the automated moderation API and not sent.',
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

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages } = body
	// Write messages[messages.length - 1].content to a file

	writeLog(messages[messages.length - 1].content, true)

	console.time('moderation')
	const moderation = await openai.createModeration({
		input: messages[messages.length - 1].content,
	});
	console.timeEnd('moderation')
	if (moderation.data.results[0].flagged === true) {
		messages.pop()
		return deniedReply;
	} else {
		console.time('conversation')
		const conversation = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages,
		});
		console.timeEnd('conversation')
		const reply = conversation.data.choices[0].message
		writeLog(
			reply?.content ?? 'No reply',
			false
		)

		return reply;
	}
})
