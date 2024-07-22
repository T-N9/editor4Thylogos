import Script from 'next/script';

const UploadLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="en">
            <Script src="https://unpkg.com/spacingjs" />
            <body className="">
                {children}
            </body>
        </html>
    )
}

export default UploadLayout