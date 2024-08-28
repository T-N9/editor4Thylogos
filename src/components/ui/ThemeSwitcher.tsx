'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch } from '@nextui-org/react';
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
                    <DropdownItem onClick={() => setTheme('dark')} key="number">Night</DropdownItem>
                    <DropdownItem onClick={() => setTheme('sepia')} key="date">Sepia</DropdownItem>
                    <DropdownItem onClick={() => setTheme('grayscale')} key="B&B">B&W</DropdownItem>
                </DropdownMenu>
            </Dropdown>



            {/* <Switch className='relative' onClick={() => {

                if (theme === 'light') {
                    setTheme('dark')
                } else {
                    setTheme('light')
                }
            }} defaultSelected size="lg">
                <span className={``}>
                    {
                        theme === 'light' ? <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>
                        </> : <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                        </>
                    }
                </span>
            </Switch> */}
        </div>
    );
};

export default ThemeSwitcher;