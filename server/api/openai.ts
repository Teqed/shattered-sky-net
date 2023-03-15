import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const deniedReply: ChatCompletionRequestMessage = {
	role: 'assistant',
	content: 'Your message was deemed potentially unsafe by the automated moderation API and not sent.',
}

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages } = body
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

		return reply;
	}
})
