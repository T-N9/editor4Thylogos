'use client'
import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdsComponentProps {
  isDisplay?: boolean;
  slotId: string;
  layoutKey?: string;
}

declare global {
    interface Window {
      adsbygoogle: { push: (params?: any) => void }[];
    }
  }
  

const AdsComponent: React.FC<AdsComponentProps> = ({
  isDisplay = true,
  slotId,
  layoutKey = "",
}) => {

  const  pathname  = usePathname();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = pathname;
    // console.log("Route Changed: " + url);

    // Initialize AdSense only for new <ins> elements
    if (adRef.current) {
      try {
        if (window.adsbygoogle && adRef.current.innerHTML.trim() === "") {
          console.log("Initializing AdSense");
          // @ts-ignore
          window.adsbygoogle.push({});
        } else {
          console.log("AdSense already initialized for this element");
        }
      } catch (error) {
        console.error("Error initializing AdSense:", error);
      }
    }
  }, [pathname]);

  return (
    <div className="sticky top-4" ref={adRef}>
      {isDisplay ? (
        <ins
          className="adsbygoogle"
          style={{ display: "flex", justifyContent: "center" }}
          data-ad-client="ca-pub-2340030299315656"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "flex", justifyContent: "center" }}
          data-ad-format="fluid"
          data-ad-layout-key={layoutKey}
          data-ad-client="ca-pub-2340030299315656"
          data-ad-slot={slotId}
        ></ins>
      )}
    </div>
  );
};

export default AdsComponent;
