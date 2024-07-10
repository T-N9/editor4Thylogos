/* Icons */
import { EyeIcon , EyeSlashIcon} from '@heroicons/react/24/outline';

import usePreviewToolbar from './usePreviewToolbar';

const PreviewToolBar: React.FC = () => {

    const {isPreviewMode,handleClickPreview} = usePreviewToolbar();

    return (
        <div className='fixed right-10 bottom-9 z-30 bg-white rounded-md shadow-md'>
            <button
                onClick={handleClickPreview}
                className='toolbar-item'
            >
                {
                    isPreviewMode? (
                        <EyeSlashIcon className="size-5" />
                    ) : (
                        <EyeIcon className="size-5" />
                    )
                }
            </button>
        </div >
    )
}

export default PreviewToolBar