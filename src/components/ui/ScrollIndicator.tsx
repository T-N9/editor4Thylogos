'use client'
import { useEffect, useState } from "react";

const ScrollIndicator = () => {
    const [progressWidth, setProgressWidth] = useState(0);
    useEffect(() => {
        window.onscroll = () => {
            const winScroll =
                document.body.scrollTop || document.documentElement.scrollTop;
            const height =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setProgressWidth(scrolled);
        };
    }, []);

    return (
        <div className="h-1 w-full z-50 fixed top-[56px] left-0 right-0">
            <span className="inline-block absolute top-0 h-1" style={{
                width: progressWidth+'%',
                backgroundColor : '#908aff',
            }}>
                
            </span>
        </div>
    );
};

export default ScrollIndicator;
