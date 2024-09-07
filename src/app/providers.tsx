'use client';
import { EditorStateProvider } from '@/context/EditorStateContext';
import { GeneralStateProvider } from '@/context/GeneralStateContext';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider themes={['light', 'dark', 'serena', 'monochrome']} attribute="class" defaultTheme="system" enableSystem>
			<NextUIProvider>
				<GeneralStateProvider>
					<EditorStateProvider>
						{children}
					</EditorStateProvider>
				</GeneralStateProvider>
			</NextUIProvider>
		</ThemeProvider>
	);
}