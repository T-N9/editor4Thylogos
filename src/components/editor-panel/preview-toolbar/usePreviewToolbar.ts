import {usePathname, useRouter} from 'next/navigation';

import {useEditorState} from '@/context/EditorStateContext';

const usePreviewToolbar = () => {
  const {isPreviewMode, setIsPreviewMode} = useEditorState();
  const pathname = usePathname();
  const router = useRouter();
  const handleClickPreview = () => {
    // console.log({pathname});
    if (pathname === '/preview') {
      setIsPreviewMode(false);
      router.push('/upload');

    }else {
      setIsPreviewMode(true);
      router.push('/preview')
    }
  };

  return {
    isPreviewMode,
    handleClickPreview,
  };
};

export default usePreviewToolbar;
