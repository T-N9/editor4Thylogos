import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 py-4">
            <div className="container mx-auto text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for reading. All rights reserved <span className='text-indigo-600'>&copy; {new Date().getFullYear()}</span>
                </p>
            </div>
        </footer>

    )
}

export default Footer