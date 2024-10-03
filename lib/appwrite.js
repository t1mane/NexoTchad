import { Client, Account, ID } from 'appwrite'; // Correct import from 'appwrite'

export const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '66fe2be200298aebf8b9',
  databaseId: '66fe2ec5003e214bdd21',
  userCollectionId: '66fe2ef1003e181d325e',
  balancesCollectionId: '66fe2f3600247fb42e7a',
  storageId: '66fe325e003d31f1574c',
};

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId); // Your project ID

const account = new Account(client);

export const createUser = (email, password, name) => {
  return account.create(ID.unique(), email, password, name) // Create user with unique ID
    .then(response => {
      console.log('User created:', response);
      return response;
    })
    .catch(error => {
      console.error('Error creating user:', error);
      throw error;
    });
};
