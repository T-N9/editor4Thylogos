// lib/firebase.ts
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage';
import {storage, db} from '../../firebaseConfig';
import {collection, doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export interface BlogItem {
  title: string;
  slug: string;
  tags: string[];
  'featureImage': string;
  'image-captions': string;
  summary: string;
  content: string;
  createdAt: Date;
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

export const fetchAllBlogData = async () => {
  const blogDataCollection = collection(db, 'blog-data');

  try {
    const querySnapshot = await getDocs(blogDataCollection);
    const blogData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
    //  ...doc.data(),
    title : doc.data().title,
    image : doc.data().featureImage,
    summary : doc.data().summary,
    tags : doc.data().tags,
    slug : doc.data().slug
    }));
    return blogData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
}

export const fetchBlogDataBySlug = async (slug: string) => {
  try {
    const blogDataCollection = collection(db, "blog-data");
    const q = query(blogDataCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        title : doc.data().title,
        image : doc.data().featureImage,
        summary : doc.data().summary,
        tags : doc.data().tags,
        slug : doc.data().slug,
        content : doc.data().content,
        featureImage : doc.data().featureImage,
        imageCaption : doc.data().imageCaption,
        createdAt : doc.data().createdAt,
      };
    } else {
      console.log("No blog post found with the provided slug.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog data by slug:", error);
    return null;
  }
};