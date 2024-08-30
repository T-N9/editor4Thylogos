'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import Image from 'next/image';

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="lg:px-5 py-2 flex justify-between lg:shadow lg:rounded-md">
            <Button className='bg-indigo-600 border-2 border-indigo-600' as={Link} href='/' isIconOnly>
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg> */}
                <Image src={'/images/Logo.png'} width={50} height={50} alt="TN Notes Logo" />
            </Button>

            <div className='flex gap-2'>
                <div className='flex justify-center items-center gap-2 text-primary'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                    </svg>
                    <Link href={'/marks'}>Marks</Link>
                </div>
                <Dropdown className='dark:text-white'>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            className="capitalize"
                        >
                            {theme}
                        </Button>
                    </DropdownTrigger>


                    <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={theme}
                    // onSelectionChange={setTheme}
                    >
                        <DropdownItem onClick={() => setTheme('light')} key="text">Light</DropdownItem>
                        <DropdownItem onClick={() => setTheme('dark')} key="dark">Dark</DropdownItem>
                        <DropdownItem onClick={() => setTheme('serena')} key="serena">Serena</DropdownItem>
                        <DropdownItem onClick={() => setTheme('monochrome')} key="monochrome">Monochrome</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
};

export default ThemeSwitcher;