
// We're using the OpenAI API to generate text
// https://beta.openai.com/docs/api-reference/create-completion
// https://beta.openai.com/docs/introduction
// https://beta.openai.com/docs/api-reference/overview
// https://beta.openai.com/docs/api-reference/engines
// https://beta.openai.com/docs/api-reference/completions/create
// We will need to make a POST request to the OpenAI API
// We'll use this server-side plugin to make the request
//
// https://nuxtjs.org/docs/2.x/directory-structure/plugins
// https://nuxtjs.org/docs/2.x/directory-structure/plugins#server-side-only
// https://nuxtjs.org/docs/2.x/directory-structure/plugins#using-plugins

import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// export default defineNuxtPlugin((nuxtApp) => {
// 	// Take POST request from client
// 	// Make POST request to OpenAI API
// 	// Return response to client
// 	nuxtApp.app.post('/api/openai', async (
// 		request: { body: { messages: any; }; },
// 		response: { json: (argument0: AxiosResponse<CreateChatCompletionResponse, any>) => void; }
// 	) => {
// 		const { messages } = request.body
// 		const conversation = await openai.createChatCompletion({
// 			model: 'gpt-3.5-turbo',
// 			messages,
// 		});
// 		response.json(conversation);
// 	});
// });

// // @ts-ignore-next-line
// export default defineEventHandler((event) => {
// 	// Get the message body from event
// 	// @ts-ignore-next-line
// 	const { messages } = event.context.params.body;
// 	const conversation = async () => {
// 		await openai.createChatCompletion({
// 			model: 'gpt-3.5-turbo',
// 			messages,
// 		});
// 	}
// 	return conversation;
// });

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { messages } = body
	console.log(messages)
	const conversation = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages,
	});
	console.log(conversation)
	const reply = conversation.data.choices[0].message

	return reply;
})
