import { useState } from 'react';

/* Hooks */
import { useEditorState } from '@/context/EditorStateContext';
import { useForm } from 'react-hook-form';

export interface LocalFormState {
    title: string;
    slug: string;
    image: string;
    tags: string[];
    summary: string;
}

const useImageUpload = () => {

    const { control, handleSubmit, setValue, watch } = useForm();
    const { editorState: contextEditorState } = useEditorState();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const featureImage = watch('feature-image');



    const onSubmit = (data: any) => {
        console.log('Submitted data:', data);
        console.log(JSON.parse(contextEditorState.editorState));
    };

    return {
        control, setImagePreview, setValue, imagePreview, onSubmit, handleSubmit
    };
};

export default useImageUpload;
