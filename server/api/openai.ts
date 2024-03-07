// import OpenAI from 'openai';
// import writeLog from '../utils/writeLog';
// interface ResponseSingle {
// 	data: {
// 		id: string;
// 		object: string;
// 		created: number;
// 		model: string;
// 		choices: {
// 			message: {
// 				content: string;
// 			};
// 		}[];
// 	}
// }
// const openai = new OpenAI({
// 	apiKey: process.env.OPENAI_API_KEY,
// });
// const deniedReply = 'Your message was deemed potentially unsafe by the automated moderation API and not sent.'
// const errorReply = 'There was an error processing your message. Please try again.'
// const baseMessages = [
// 	{ role: 'user', content: 'Explain things in technical terms suitable for a college graduate. Use bullet points, numbered lists and code blocks when possible.'},
// 	{ role: 'user', content: 'For complicated answers, finish by saying "Ask me:" and give several examples of good follow-up questions in bullet points.'},
// 	{ role: 'user', content: 'You have a limited number of characters you can send, so you have to be brief and information dense.'},
// ] as OpenAI.Chat.ChatCompletionMessageParam[];
// const chatCompletion = async (body: { messages: ConcatArray<OpenAI.Chat.ChatCompletionMessageParam>; }) => {
// 	const messages = baseMessages.concat(body.messages)
// 	const latestMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam | undefined = messages[messages.length - 1];
// 	if (latestMessage && latestMessage.content) {
// 		if (typeof latestMessage.content !== 'string') {
// 			latestMessage.content = latestMessage.content.toString()
// 		}
// 		writeLog(latestMessage.content, true)
// 		try {
// 			console.time('moderation');
// 			const moderation = await openai.moderations.create({
// 				input: latestMessage.content,
// 			});
// 			console.timeEnd('moderation');
// 			if (moderation.results[0]) {
// 				if (moderation.results[0].flagged === true) {
// 					messages.pop();
// 					return deniedReply;
// 				} else {
// 					console.time('conversation');
// 					const conversation = await openai.chat.completions.create({
// 						model: 'gpt-3.5-turbo',
// 						messages,
// 					}) as unknown as ResponseSingle;
// 					console.timeEnd('conversation'); if (conversation.data.choices[0]) {
// 						const reply = conversation.data.choices[0].message.content;
// 						writeLog(reply, false)
// 						return reply
// 					}
// 				}
// 			}
// 		} catch (error) {
// 			console.error('Error:', error);
// 			return errorReply;
// 		}
// 	}
// 	return errorReply;
// };
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	if (body.requestType === 'chatCompletion') {
		// return chatCompletion(body);
		return 'chatCompletion';
	}
	return 'No requestType specified.'
});
