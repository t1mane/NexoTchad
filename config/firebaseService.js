import { doc, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';

// Function to create user document in Firestore
export const createUserDocument = async (user) => {
  const userRef = doc(FIRESTORE_DB, 'Users', user.uid);
  const userData = {
    email: user.email,
    balance: 0,
    contacts: []
  };

  try {
    await setDoc(userRef, userData);
    console.log("User document created successfully");
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};
