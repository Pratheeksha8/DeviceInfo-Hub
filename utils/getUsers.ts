// src/getUsers.ts
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase-config';

interface User {
  email: string;
  'warranty period': number;
  'released year': number;
}

// Function to fetch users from Firestore
const getUserCollection = async (): Promise<User[]> => {
  try {
    const usersCollectionRef = collection(firestore, 'users');
    const userSnapshot = await getDocs(usersCollectionRef);
    const userList = userSnapshot.docs.map(doc => doc.data()) as User[];
    return userList;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
};

export { getUserCollection };
