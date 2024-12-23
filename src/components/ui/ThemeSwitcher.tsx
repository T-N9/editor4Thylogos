'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import Link from 'next/link';
import { Logo } from './Logo';

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
        <div className="fixed top-0 left-0 z-50 px-2 right-0 lg:px-5 py-2  bg-white dark:bg-slate-800 shadow">
            <div className="max-w-[1350px] flex justify-between mx-auto">
                <Link href='/'>
                    <Logo width={40} height={40} />
                </Link>

                <div className='flex gap-4 items-center'>
                    {/* <div className=' text-primary-600 flex justify-center items-center'>
                        <Link className='flex gap-2 justify-center items-center' href={'/marks'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                            </svg>
                            <span>Marks</span>
                        </Link>
                    </div> */}
                    <div className=' text-primary-600 flex justify-center items-center'>
                        <Link className='flex gap-2 justify-center items-center' href={'/api/rss'}>
                            <svg width={24} height={24} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>RSS</title><path fill='#FFA500' d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" /></svg>
                        </Link>
                    </div>
                    <Dropdown className='dark:text-white'>
                        <DropdownTrigger>
                            <Button
                                variant="faded"
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

        </div>
    );
};

export default ThemeSwitcher;