import { io } from 'socket.io-client';

// Socket Client
const socket = io('http://localhost:3000');

export default defineNuxtPlugin(() => {
	return {
		provide: {
			io: socket
		}
	}
});
