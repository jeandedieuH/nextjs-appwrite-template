"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";

let user = null;
let sessionCookie = null;

export const login = async (userData: LoginUser) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(
      userData.email,
      userData.password
    );

    if (!session)
      throw new Error(
        "Error logging in. Please check your credentials and try again."
      );

    cookies().set("prestige-learning-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
export const register = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName, phone } = userData;

  const name = `${firstName} ${lastName}`;

  let newUserAccount;

  try {
    const { account } = await createAdminClient();

    newUserAccount = await account.create(ID.unique(), email, password, name);

    if (!newUserAccount) throw new Error("Error creating user");

    const avatarUrl = `${process.env.NEXT_PUBLIC_APPWRITE_URL}/storage/buckets/${process.env.BUCKET_ID_PROFILE_IMAGES}/files/${process.env.PLACEHOLDER_IMAGE_ID}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`;

    const newUser = await saveUserDb({
      userId: newUserAccount?.$id,
      name,
      email,
      username: firstName,
      avatarUrl,
      phone,
    });

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("prestige-learning-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("ERROR: ", error);
  }
};
export const getUser = async () => {
  sessionCookie = cookies().get("prestige-learning-session");

  try {
    const { account } = await createSessionClient(sessionCookie?.value);

    const user = await account.get();

    const newUser = await getUserInfo({ userId: user.$id });

    return parseStringify(newUser);
  } catch {
    user = null;
    sessionCookie = null;
  }
};
export const logoutAccount = async () => {
  try {
    sessionCookie = cookies().get("prestige-learning-session");
    const { account } = await createSessionClient(sessionCookie?.value);
    cookies().delete("prestige-learning-session");
    await account.deleteSession("current");
  } catch {
    return null;
  }
  user = null;
  sessionCookie = null;
};

export const updateUser = async (id: string, userData: { role: string }) => {
  try {
    const { database } = await createAdminClient();

    const updatedUser = await database.updateDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID_USERS!,
      id,
      userData
    );
    return parseStringify(updatedUser);
  } catch (error) {
    console.log("[UPDATE_USER]", error);
  }
};

export const saveUserDb = async ({
  userId,
  name,
  email,
  username,
  avatarUrl,
  phone,
}: SaveUserProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.createDocument(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID_USERS!,
      ID.unique(),
      {
        userId,
        name,
        email,
        username,
        avatarUrl,
        phone,
      }
    );
    return parseStringify(user);
  } catch {
    return null;
  }
};

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID_USERS!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const { database } = await createAdminClient();
    const users = await database.listDocuments(
      process.env.DATABASE_ID!,
      process.env.COLLECTION_ID_USERS!
    );

    return parseStringify(users.documents);
  } catch (error) {
    console.log("[GET_ALL_USERS]", error);

    throw error;
  }
};
