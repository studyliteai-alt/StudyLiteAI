import { storage } from "../lib/firebase";
import {
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";

export const storageService = {
    async uploadFile(userId: string, file: File) {
        if (!storage) throw new Error("Storage not initialized");
        try {
            const fileRef = ref(storage, `users/${userId}/uploads/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return {
                url: downloadURL,
                path: fileRef.fullPath,
                name: file.name
            };
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        }
    }
};
