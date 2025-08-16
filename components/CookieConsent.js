import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './CookieConsent.module.css';
import Link from 'next/link';

const COOKIE_NAME = 'cookie_consent';
const COOKIE_EXPIRE_DAYS = 365;

export default function CookieConsent({ onConsentChange }) {
  const [show, setShow] = useState(false);
  const [focusIdx, setFocusIdx] = useState(0);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_NAME);
    if (!consent) setShow(true);
  }, []);

  function handleConsent(value) {
    Cookies.set(COOKIE_NAME, value, { expires: COOKIE_EXPIRE_DAYS, sameSite: 'Lax' });
    setShow(false);
    if (onConsentChange) onConsentChange(value);
  }

  if (!show) return null;

  return (
    <div className={styles.banner} role="dialog" aria-modal="true" aria-label="Cookie consent" tabIndex={-1}>
      <div className={styles.content}>
        <p>
          We use cookies to improve your experience and to analyze site usage. Non-essential cookies (like analytics) are only set with your consent. See our <Link href="/privacy-policy" legacyBehavior><a target="_blank" rel="noopener" className={styles.link}>Privacy Policy</a></Link> for details.
        </p>
        <div className={styles.actions}>
          <button
            className={styles.accept}
            onClick={() => handleConsent('accepted')}
            autoFocus={focusIdx === 0}
            aria-label="Accept all cookies"
          >
            Accept All
          </button>
          <button
            className={styles.reject}
            onClick={() => handleConsent('rejected')}
            autoFocus={focusIdx === 1}
            aria-label="Reject all non-essential cookies"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
}

export function resetCookieConsent() {
  Cookies.remove(COOKIE_NAME);
}

export function getCookieConsent() {
  return Cookies.get(COOKIE_NAME);
}
