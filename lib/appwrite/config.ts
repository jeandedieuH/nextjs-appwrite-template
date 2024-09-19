import { Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  url: process.env.NEXT_PUBLIC_APPWRITE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_DATABASE_ID,
  profileStorageId: process.env.NEXT_PUBLIC_BUCKET_ID_PROFILE_IMAGES,
  userCollectionId: process.env.NEXT_PUBLIC_COLLECTION_ID_USERS,
  newsletterCollectionId: process.env.NEXT_PUBLIC_COLLECTION_ID_NEWSLETTER,
};

export const client = new Client();

client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_URL!);
client.setProject(process.env.NEXT_PUBLIC_PROJECT_ID!);

export const databases = new Databases(client);
export const storage = new Storage(client);
