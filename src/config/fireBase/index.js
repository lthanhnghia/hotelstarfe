import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../configApi";

const uploadImageToFirebase = async (file) => {
    const avatarRef = ref(imageDb, `files/${new Date().getTime()}_${file.name}`);
    await uploadBytes(avatarRef, file);
    const url = await getDownloadURL(avatarRef);
    
    return url;
};
export default uploadImageToFirebase;