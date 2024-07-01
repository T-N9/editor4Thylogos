import { Dispatch } from 'react'

/* Util */
import { scrollToTop } from '@/app/utils/scrollToTop';

/* Icons */
import { EyeIcon } from '@heroicons/react/24/outline';

import usePreviewToolbar from './usePreviewToolbar';

const PreviewToolBar: React.FC = () => {

    const {handleClickPreview} = usePreviewToolbar();

    return (
        <div className='fixed right-5 bottom-8 z-30 bg-white px-5 py-1 rounded-md shadow-md'>
            <button
                onClick={handleClickPreview}
                className='toolbar-item'
            >
                <EyeIcon className="size-5" />
            </button>
        </div >
    )
}

export default PreviewToolBar