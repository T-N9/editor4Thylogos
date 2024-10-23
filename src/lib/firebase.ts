// lib/firebase.ts
import {ref, uploadBytes, getDownloadURL, listAll} from 'firebase/storage';
import {storage, db} from '../../firebaseConfig';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  or,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import {v4 as uuidv4} from 'uuid';
import {ThumbnailBlogItem} from '@/components/blog-catalogue/useBlogCatalogue';

const uuid = uuidv4();
export interface BlogItem {
  id?: string;
  title: string;
  slug: string;
  tags: string[];
  featureImage: string;
  imageCaption: string;
  summary: string;
  content: string;
  createdAt: Date;
  htmlData ?: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `feature-images/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const uploadImageData = async (fileURL: string, caption: string) => {
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

export const uploadBlogItemData = async (blog: BlogItem): Promise<boolean> => {
  try {
    const docRef = doc(db, 'blog-data', blog.title + uuid.split('-')[1]);
    await setDoc(docRef, blog);
    // alert('Blog data stored successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

export const updateBlogItemData = async (
  id: string,
  blog: BlogItem,
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'blog-data', id);
    await updateDoc(docRef, {...blog});
    // alert('Blog data updated successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

export const updateDraftedBlogItemData = async (
  id: string,
  blog: BlogItem,
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'drafted-blog-data', id);
    if (blog.title) {
      await updateDoc(docRef, {id: blog.title + uuid.split('-')[1], ...blog});
    } else {
      await updateDoc(docRef, {blog});
    }

    // alert('Blog data updated successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

export const deleteBlogItemData = async (id: string): Promise<boolean> => {
  const docRef = doc(db, 'blog-data', id);

  try {
    await deleteDoc(docRef);
    // alert('Document successfully deleted!');
    return true;
  } catch (error) {
    return false;
    console.error('Error deleting document: ', error);
  }
};

export const deleteUnpublishedBlogItemData = async (
  id: string,
): Promise<boolean> => {
  const docRef = doc(db, 'unpublished-blog-data', id);

  try {
    await deleteDoc(docRef);
    // alert('Document successfully deleted!');
    return true;
  } catch (error) {
    return false;
    console.error('Error deleting document: ', error);
  }
};

export const unpublishedBlogItemData = async (
  id: string,
  blog: BlogItem,
): Promise<boolean> => {
  try {
    const docRef = doc(db, 'unpublished-blog-data', id);
    await deleteBlogItemData(id);
    await setDoc(docRef, blog);
    // alert('Blog data unpublish successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

/* Unpublished to Publish */
export const publishBlogItemData = async (
  id: string,
  blog: BlogItem,
): Promise<boolean> => {
  try {
    await deleteUnpublishedBlogItemData(id);
    await uploadBlogItemData(blog);
    // alert('Blog data status changed to Public successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

/* Draft to Publish */
export const publishDraftBlogItemData = async (
  id: string,
  blog: BlogItem,
): Promise<boolean> => {
  try {
    await deleteDraftedBlogData(id);
    await uploadBlogItemData(blog);
    // alert('Blog data status changed to Public successfully!');
    return true;
  } catch (error) {
    console.error('Error storing blog data:', error);
    return false;
  }
};

export const draftBlogItemData = async (blog: BlogItem): Promise<boolean> => {
  try {
    const docRef = doc(
      db,
      'drafted-blog-data',
      blog.title ? blog.title + uuid.split('-')[1] : uuid.split('-')[1],
    );
    await setDoc(docRef, {id: blog.title + uuid.split('-')[1], ...blog});
    return true;
    // alert('Blog data draft successfully!');
  } catch (error) {
    return false;
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

export const fetchAllBlogData = async (): Promise<ThumbnailBlogItem[]> => {
  const blogDataCollection = collection(db, 'blog-data');

  try {
    const blogDataQuery = query(
      blogDataCollection,
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(blogDataQuery);

    // Filter out documents with "pinned" tag
    const blogData = querySnapshot.docs
      .filter(doc => !doc.data().tags.includes('Pinned'))
      .map(doc => ({
        id: doc.id,
        title: doc.data().title,
        image: doc.data().featureImage,
        summary: doc.data().summary,
        tags: doc.data().tags,
        slug: doc.data().slug,
        createdAt: doc.data().createdAt,
      }));

    return blogData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
};

export const fetchAllPinnedBlogData = async (): Promise<ThumbnailBlogItem[]> => {
  const blogDataCollection = collection(db, 'blog-data');

  try {
    // Query for documents that contain "Pined" in the "tags" array
    const pinedQuery = query(
      blogDataCollection,
      where('tags', 'array-contains', 'Pinned')
    );
    const querySnapshot = await getDocs(pinedQuery);
    
    const blogData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      image: doc.data().featureImage,
      summary: doc.data().summary,
      tags: doc.data().tags,
      slug: doc.data().slug,
      createdAt: doc.data().createdAt,
    }));

    return blogData;
  } catch (error) {
    console.error('Error fetching pined blog data:', error);
    return [];
  }
};

export const fetchAllUnpublishedBlogData = async (): Promise<
  ThumbnailBlogItem[]
> => {
  const blogDataCollection = collection(db, 'unpublished-blog-data');

  try {
    const blogDataQuery = query(
      blogDataCollection,
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(blogDataQuery);
    const blogData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      image: doc.data().featureImage,
      summary: doc.data().summary,
      tags: doc.data().tags,
      slug: doc.data().slug,
      createdAt: doc.data().createdAt,
    }));
    return blogData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
};

export const fetchAllDraftedBlogData = async (): Promise<
  ThumbnailBlogItem[]
> => {
  const blogDataCollection = collection(db, 'drafted-blog-data');

  try {
    const blogDataQuery = query(
      blogDataCollection,
      orderBy('createdAt', 'desc'),
    );
    const querySnapshot = await getDocs(blogDataQuery);
    const blogData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      image: doc.data().featureImage,
      summary: doc.data().summary,
      tags: doc.data().tags,
      slug: doc.data().slug,
      createdAt: doc.data().createdAt,
    }));
    return blogData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return [];
  }
};

export const fetchBlogDataBySlug = async (slug: string) => {
  try {
    const blogDataCollection = collection(db, 'blog-data');
    const q = query(blogDataCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];

      // console.log({fetchedId: doc.id});
      return {
        id: doc.id,
        title: doc.data().title,
        image: doc.data().featureImage,
        summary: doc.data().summary,
        tags: doc.data().tags,
        slug: doc.data().slug,
        content: doc.data().content,
        featureImage: doc.data().featureImage,
        imageCaption: doc.data().imageCaption,
        createdAt: doc.data().createdAt,
        htmlData : doc.data().htmlData
      };
    } else {
      console.log('No blog post found with the provided slug.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog data by slug:', error);
    return null;
  }
};

export const fetchUnpublishedBlogDataBySlug = async (slug: string) => {
  try {
    const blogDataCollection = collection(db, 'unpublished-blog-data');
    const q = query(blogDataCollection, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];

      // console.log({fetchedId: doc.id});
      return {
        id: doc.id,
        title: doc.data().title,
        image: doc.data().featureImage,
        summary: doc.data().summary,
        tags: doc.data().tags,
        slug: doc.data().slug,
        content: doc.data().content,
        featureImage: doc.data().featureImage,
        imageCaption: doc.data().imageCaption,
        createdAt: doc.data().createdAt,
      };
    } else {
      console.log('No blog post found with the provided slug.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching blog data by slug:', error);
    return null;
  }
};

export const fetchDraftedBlogData = async (draftPara: string) => {
  try {
    /* Fetch by Id part */
    if (draftPara.includes('?draft')) {
      // console.log('Fetch by Id',draftPara.split('/')[3].split('?')[0]);
      const docRef = doc(
        db,
        'drafted-blog-data',
        draftPara.split('/')[3].split('?')[0],
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const doc = docSnap;
        // console.log(doc.data());
        return {
          id: doc.id,
          title: doc.data()?.title,
          image: doc.data()?.featureImage,
          summary: doc.data()?.summary,
          tags: doc.data()?.tags,
          slug: doc.data()?.slug,
          content: doc.data()?.content,
          featureImage: doc.data()?.featureImage,
          imageCaption: doc.data()?.imageCaption,
          createdAt: doc.data()?.createdAt,
        };
      } else {
        console.log('No blog post found with the provided id.');
        return null;
      }
    } else {
    /* Fetch by Slug part */
      const blogDataCollection = collection(db, 'drafted-blog-data');
      const q = query(
        blogDataCollection,
        where('slug', '==', draftPara.split('/')[3]),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          title: doc.data().title,
          image: doc.data().featureImage,
          summary: doc.data().summary,
          tags: doc.data().tags,
          slug: doc.data().slug,
          content: doc.data().content,
          featureImage: doc.data().featureImage,
          imageCaption: doc.data().imageCaption,
          createdAt: doc.data().createdAt,
        };
      } else {
        console.log('No blog post found with the provided slug.');
        return null;
      }
    }
  } catch (error) {
    console.error(`Error fetching blog data`, error);
    return null;
  }
};

export const deleteDraftedBlogData = async (draftPara: string) => {
  const docRef = doc(db, 'drafted-blog-data', draftPara);

  try {
    await deleteDoc(docRef);
    // alert('Document successfully deleted!');
    return true;
  } catch (error) {
    console.error('Error deleting document: ', error);
    return false;
  }
};
