import {useLocalStorage} from 'react-use';
import {LocalEditorState} from './text-editor/TextEditor';
import {LocalFormState} from './useFormData';
import { usePathname } from 'next/navigation';

const useLocalData = () => {

  const pathname = usePathname();
  const isUpdateRoute = pathname.includes('/update');

  const [localizedEditorState, setLocalizedEditorState] =
    useLocalStorage<LocalEditorState | null>('my-editor-state-key', null);
  const [localizedFormState, setLocalizedFormState] =
    useLocalStorage<LocalFormState | null>('my-form-state-key', null);

  return {
    pathname,
    isUpdateRoute,

    localizedFormState,
    localizedEditorState,

    setLocalizedFormState,
    setLocalizedEditorState,

  };
};

export default useLocalData;
