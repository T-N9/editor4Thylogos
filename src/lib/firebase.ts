// lib/firebase.ts
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage';
import {storage, db} from '../../firebaseConfig';
import {collection, doc, getDocs, setDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface BlogItem {
  title: string;
  slug: string;
  tags: string[];
  'feature-image': string;
  'image-captions': string;
  summary: string;
  content: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `feature-images/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const uploadImageData = async (fileURL: string, caption: string) => {
  const uuid = uuidv4();
  try {
    const docRef = doc(db, 'feature-image-data', uuid.split('-')[1]);
    await setDoc(docRef, {
      imageUrl: fileURL,
      caption: caption,
    });
    console.log('Image data stored successfully!');
  } catch (error) {
    console.error('Error storing image data:', error);
  }
};

export const uploadBlogItemData = async (blog: BlogItem) => {
  try {
    const docRef = doc(db, 'blog-data', blog.title);
    await setDoc(docRef, blog);
    alert('Blog data stored successfully!');
  } catch (error) {
    console.error('Error storing blog data:', error);
  }
};

export const fetchAllImages = async (
  directoryPath: string,
): Promise<string[]> => {
  const imagesRef = ref(storage, directoryPath);
  const result = await listAll(imagesRef);

  const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
  const urls = await Promise.all(urlPromises);

  return urls;
};

export const fetchFeatureImages = async () => {
  const featureImagesCollection = collection(db, 'feature-image-data');

  try {
    const querySnapshot = await getDocs(featureImagesCollection);
    const imageData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      caption: doc.data().caption,
      imageUrl: doc.data().imageUrl,
    }));
    return imageData;
  } catch (error) {
    console.error('Error fetching feature images:', error);
    return [];
  }
};

export const fetchTags = async () => {
  const featureTagsCollection = collection(db, 'tags');

  try {
    const querySnapshot = await getDocs(featureTagsCollection);
    const tagData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      tagName: doc.data().tagName,
    }));
    return tagData;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};
