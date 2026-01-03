
import { server } from '../server';
import { auth } from '../firebase.ts';

/**
 * REFACTORED API SERVICE
 * All data is now handled by the VirtualServer (server.ts) 
 * which persists to LocalStorage.
 */
export const api = {
  async get(endpoint: string) {
    console.log(`[VIRTUAL API] GET ${endpoint}`);
    
    const user = auth.currentUser;
    if (!user && endpoint !== '/jobs') throw new Error("Unauthorized");

    // All GET requests go to the virtual server logic
    return server.handleRequest(endpoint, 'GET');
  },

  async post(endpoint: string, body: any) {
    console.log(`[VIRTUAL API] POST ${endpoint}`, body);
    
    // All POST requests go to the virtual server logic
    // The VirtualServer handles the local persistence of profiles and briefings
    return server.handleRequest(endpoint, 'POST', body);
  }
};
