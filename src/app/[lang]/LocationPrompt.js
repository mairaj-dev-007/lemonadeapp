'use client';

import { useState } from 'react';
import styles from './location.module.css';

export default function LocationPrompt({ dictionary, onSubmit, onSkip }) {
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError(dictionary.game.location.error);
      return;
    }
    setError('');
    onSubmit(location.trim());
    setLocation('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>
          {dictionary.game.location.title}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={dictionary.game.location.placeholder}
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.submitButton}>
              {dictionary.game.location.submit}
            </button>
            <button 
              type="button" 
              onClick={onSkip} 
              className={styles.skipButton}
            >
              {dictionary.game.location.skip}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 