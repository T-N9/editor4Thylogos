import React from 'react'
import Link from 'next/link'

const NavBar = () => {
    return (
        <nav className='text-gray-800 flex gap-5 p-5'>
            <Link href={"/"}>
                Home
            </Link>
            <Link href={"/blog"}>
                Blog
            </Link>
        </nav>
    )
}

export default NavBar