
import { server } from '../server';

export const api = {
  async get(endpoint: string) {
    return server.handleRequest(endpoint, 'GET');
  },

  async post(endpoint: string, body: any) {
    return server.handleRequest(endpoint, 'POST', body);
  }
};
