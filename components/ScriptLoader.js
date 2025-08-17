import { useEffect } from 'react';

const SCRIPTS = [
  {
    id: 'google-analytics',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-CEBL7KXZEB',
    async: true,
    inject: () => {
      if (!window.gtag) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-CEBL7KXZEB');
      }
    }
  },
  // Add more scripts here as needed
];

export default function ScriptLoader() {
  useEffect(() => {
    SCRIPTS.forEach(script => {
      if (!document.getElementById(script.id)) {
        const s = document.createElement('script');
        s.id = script.id;
        s.src = script.src;
        if (script.async) s.async = true;
        document.head.appendChild(s);
        s.onload = script.inject;
      }
    });
  }, []);
  return null;
}
