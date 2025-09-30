"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../page.module.css';

export default function LanguageSwitcher({ currentLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    setIsOpen(false);
    // Get current path and replace the language part
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${langCode}${pathWithoutLang}`;
    router.push(newPath);
  };

  return (
    <div className={styles.languageSwitcher} ref={dropdownRef}>
      <button 
        className={styles.languageButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className={styles.languageFlag}>{currentLanguage.flag}</span>
        <span className={styles.languageName}>{currentLanguage.name}</span>
        <span className={`${styles.dropdownArrow} ${isOpen ? styles.rotated : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className={styles.languageDropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${styles.languageOption} ${currentLang === language.code ? styles.active : ''}`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className={styles.languageFlag}>{language.flag}</span>
              <span className={styles.languageName}>{language.name}</span>
              {currentLang === language.code && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 