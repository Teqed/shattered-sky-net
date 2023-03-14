import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
// });

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages } = body
	// const moderation = await openai.createModeration({
	// 	input: messages[messages.length - 1].content,
	// });
	// if (moderation.data.results[0].flagged === true) {
	// 	messages.pop()
	// 	return 'Your message was not sent because it was deemed unsafe by our moderation API.';
	// } else {
	const conversation = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages,
	});
	console.log(conversation)
	const reply = conversation.data.choices[0].message

	return reply;
	// }
})
