import io from 'socket.io-client';

export default async ({ Vue }) => {
  Vue.prototype.$socket = await io('http://localhost:3000/');
};