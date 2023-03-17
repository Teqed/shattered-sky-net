import { io } from 'socket.io-client';

// Socket Client
const socket = io('http://localhost:3005');

export default defineNuxtPlugin(() => {
	return {
		provide: {
			io: socket
		}
	}
});
