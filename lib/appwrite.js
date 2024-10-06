
import { Client, Account, OAuthProvider } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
  .setProject('66ff5ddf00035d1e8f92');          // Your Project ID

export const account = new Account(client);
export { OAuthProvider };
