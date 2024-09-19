import { ID } from "appwrite";
import { appwriteConfig, databases, storage } from "./config";
import { getRandomNumber, parseStringify } from "../utils";
import { CreateAttachmentProps, ProfileUpdateProps } from "@/types";
import { createAttachment, updateCourse } from "../actions/course.actions";

export async function uploadProfile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.profileStorageId!,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    throw error;
  }
}

export async function uploadThumbnail(data: {
  courseId: string;
  File: File[];
  instructorId: string;
}) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.thumbnailStorageId!,
      ID.unique(),
      data.File[0]
    );

    const thumbnailUrl = getThumbnailPreview(uploadedFile.$id);

    const values = parseStringify({
      imageId: uploadedFile.$id,
      imageUrl: thumbnailUrl,
      instructorId: data.instructorId,
    });

    const updatedCourse = await updateCourse(data.courseId, values);

    return updatedCourse;
  } catch (error) {
    throw error;
  }
}

export async function uploadAttachment(data: CreateAttachmentProps) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.attachmentStorageId!,
      ID.unique(),
      data.File[0]
    );

    const attachmentUrl = getAttachmentUrl(uploadedFile.$id);

    if (!attachmentUrl) {
      await deleteAttachment(uploadedFile.$id);
      throw Error;
    }

    const values = parseStringify({
      courseId: data.courseId,
      userId: data.userId,
      attachmentId: uploadedFile.$id,
      fileUrl: attachmentUrl,
    });

    const createdAttachment = await createAttachment(values);

    if (!createdAttachment) {
      await deleteAttachment(uploadedFile.$id);
      throw Error;
    }

    return createdAttachment;
  } catch (error) {
    console.log("[UPLOAD_ATTACHMENT]", error);

    throw error;
  }
}

// ============================== GET FILE URL
export function getProfilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.profileStorageId!,
      fileId,
      2000,
      2000
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw error;
  }
}

export function getThumbnailPreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.thumbnailStorageId!,
      fileId,
      1920,
      1080
    );
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw error;
  }
}

export function getAttachmentUrl(fileId: string) {
  try {
    const fileUrl = storage.getFileDownload(
      appwriteConfig.attachmentStorageId!,
      fileId
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw error;
  }
}

// ============================== DELETE FILE
export async function deleteProfile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.profileStorageId!, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteThumbnail(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.thumbnailStorageId!, fileId);

    return { status: "ok" };
  } catch (error) {
    throw error;
  }
}

export async function deleteAttachment(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.attachmentStorageId!, fileId);

    return { status: "ok" };
  } catch (error) {
    throw error;
  }
}

export const updateProfile = async (id: string, user: ProfileUpdateProps) => {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let avatar = {
      avatarUrl: user.avatarUrl,
      avatarId: user.avatarId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadProfile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getProfilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteProfile(uploadedFile.$id);
        throw Error;
      }

      avatar = { ...avatar, avatarUrl: fileUrl, avatarId: uploadedFile.$id };
    }

    //  Update user

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      id,
      {
        name: user.name,
        bio: user.bio,
        phone: user.phone,
        avatarUrl: avatar.avatarUrl,
        avatarId: avatar.avatarId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteProfile(avatar.avatarId ?? "");
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.avatarId && hasFileToUpdate) {
      await deleteProfile(user.avatarId);
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// export const createAttachment = async (data: CreateAttachmentProps) => {
//   try {
//     const uploadedFile = await uploadAttachment(data.File[0]);
//     if (!uploadedFile) throw Error;

//     // Get new file url
//     const fileUrl = getAttachmentUrl(uploadedFile.$id);
//     if (!fileUrl) {
//       await deleteAttachment(uploadedFile.$id);
//       throw Error;
//     }

//     const attachment = await databases.createDocument(
//       appwriteConfig.databaseId!,
//       appwriteConfig.attachmentCollectionId!,
//       ID.unique(),
//       {
//         name: `file-${getRandomNumber()}`,
//         url: fileUrl,
//         courseId: data.courseId,
//         attachmentId: uploadedFile.$id,
//       }
//     );

//     // Failed to create attachment
//     if (!attachment) {
//       // Delete new file that has been recently uploaded
//       await deleteAttachment(uploadedFile.$id ?? "");
//     }

//     return attachment;
//   } catch (error) {
//     console.log("[CREATE_ATTACHMENT]", error);
//     throw error;
//   }
// };

export const createNewsletterSub = async (data: { email: string }) => {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.newsletterCollectionId!,
      ID.unique(),
      data
    );
  } catch (error) {
    console.log("[CREATE_NEWSLETTER_SUB]", error);
  }
};
