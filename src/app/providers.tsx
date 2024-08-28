'use client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider themes={['light', 'dark', 'sepia', 'grayscale']} attribute="class" defaultTheme="system" enableSystem>
			{children}
		</ThemeProvider>
	);
}