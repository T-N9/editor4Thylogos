'use client'
import Link from "next/link";
import { Button } from "@nextui-org/react";
import LogoutButton from "./LogOutButton";
import { usePathname } from "next/navigation";

const NavBar = () => {
    const pathname = usePathname();
    return (
        <>
            {
                (pathname === '/manage' || pathname === '/manage/unpublished' || pathname === '/manage/drafts') &&
                <nav className="container flex justify-between mx-auto py-2 px-4 rounded-md shadow">
                    <div>

                    </div>
                    <div className="flex gap-2">
                        <Button href='/manage/unpublished' as={Link} className="flex gap-2 justify-center items-center dark:bg-gray-300 dark:text-black" color="secondary">
                            Unpublished
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                        </Button>

                        <Button href='/manage/drafts' as={Link} className="flex gap-2 justify-center items-center" color="warning">
                            Drafts
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                            </svg>
                        </Button>


                        <Button href='/manage/upload' as={Link} className="flex gap-2 justify-center items-center bg-primary-600" color="primary">
                            New Post
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                        </Button>

                    </div>
                    <div>
                        <LogoutButton />
                    </div>
                </nav>
            }
        </>

    )
}

export default NavBar