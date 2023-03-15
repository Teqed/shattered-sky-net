import { ChatCompletionRequestMessage, Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai'
import * as winston from 'winston'

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
	{ role: 'assistant', content: 'My name is Teqbot.'},
	{ role: 'user', content: 'How do I make bread?'},
	{ role: 'assistant', content: `Here are the general steps for making bread:

1. Gather your ingredients. You'll need flour, water, yeast, salt, and sometimes sugar or oil.

2. Mix the dough. Combine the flour, yeast, salt, and any other dry ingredients in a large bowl. Gradually add water while stirring the mixture with a wooden spoon or dough hook until it comes together in a sticky dough.

3. Knead the dough. Turn the dough out onto a floured surface and knead it for about 10 minutes. Kneading helps develop the gluten in the dough, which gives bread its structure and texture.

4. Let the dough rise. Place the dough in a lightly oiled bowl and cover it with plastic wrap or a damp towel. Let it sit in a warm, draft-free place for 1-2 hours, or until it doubles in size.

5. Shape the dough. Punch down the dough to release any air bubbles, then shape it into a loaf or rolls.

6. Let it rise again. Place the shaped dough in a lightly oiled loaf pan or on a baking sheet, then cover it with plastic wrap or a damp towel and let it rise for another 30-60 minutes.

7. Bake the bread. Preheat your oven to 375-425°F (190-220°C), depending on the recipe, and bake the bread for about 30-40 minutes, or until it's golden brown and sounds hollow when tapped on the bottom.

8. Cool and slice. Transfer the bread to a wire rack and let it cool for at least 30 minutes before slicing and serving.

Ask me:
- What are some common variations on basic bread recipes?
- How can I tell if my dough has risen enough?
- Can I use whole wheat flour instead of all-purpose flour?`},
] as ChatCompletionRequestMessage[]

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	// const { messages } = body
	// get the messages from the body and add them to the base messages
	const messages = baseMessages.concat(body.messages)
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
