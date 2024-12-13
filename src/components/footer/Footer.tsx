import React from 'react'
import HeroLogo from '../ui/HeroLogo'

const Footer = () => {
    return (
        <footer className="bg-light shadow-md dark:bg-gray-900 py-4">
            <div className="container flex justify-center items-center gap-2 mx-auto text-center">
                <HeroLogo/>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thank you for reading. All rights reserved <span className='text-primary-600'>&copy; {new Date().getFullYear()}</span>
                </p>
            </div>
        </footer>

    )
}

export default Footer