import * as winston from 'winston'

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	defaultMeta: { service: 'user-service' },
	transports: [
		// new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		// new winston.transports.File({ filename: 'logs/combined.log' }),
		// new winston.transports.File({ filename: 'logs/messages.log', level: 'verbose' }),
	],
});
if (process.env.NODE_ENV !== 'production') {
	// logger.add(new winston.transports.Console({
	// 	format: winston.format.simple(),
	// }));
}
export default (message: string, question: boolean) => {
	if (question) {
		// logger.verbose(
		// 	`Question: ${message}`
		// );
	} else {
		// logger.verbose(
		// 	`Answer: ${message}`
		// );
	}
};
