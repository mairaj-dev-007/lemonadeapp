"use client"

import React, { useState } from 'react';
import styles from "../../../page.module.css";
import LocationPrompt from './LocationPrompt';

export default function DrinkSelling({ dict, drinkType, onSaleComplete }) {
  // State for glass management
  const [glasses, setGlasses] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    location: '',
    price: 0,
    newTotal: 0
  });

  // Location prices for different drinks
  const locationPrices = {
    lemon: {
      "Lahore": 5.99,
      "Multan": 4.99,
      "Islamabad": 6.99,
      "Karachi": 7.99,
      "Faislabad": 3.99
    },
    blueberry: {
      "Lahore": 7.99,
      "Multan": 6.99,
      "Islamabad": 8.99,
      "Karachi": 9.99,
      "Faislabad": 5.99
    },
    orange: {
      "Lahore": 6.99,
      "Multan": 5.99,
      "Islamabad": 7.99,
      "Karachi": 8.99,
      "Faislabad": 4.99
    },
    tea: {
      "Lahore": 4.99,
      "Multan": 3.99,
      "Islamabad": 5.99,
      "Karachi": 6.99,
      "Faislabad": 2.99
    },
    coffee: {
      "Lahore": 8.99,
      "Multan": 7.99,
      "Islamabad": 9.99,
      "Karachi": 10.99,
      "Faislabad": 6.99
    },
    mango: {
      "Lahore": 6.99,
      "Multan": 5.99,
      "Islamabad": 7.99,
      "Karachi": 8.99,
      "Faislabad": 4.99
    }
  };

  const handlePerfectDrink = () => {
    setGlasses(glasses + 1);
    if (glasses + 1 >= 5) {
      setCanSell(true);
      return true;
    }
    return false;
  };

  const handleLocationSubmit = (location) => {
    const price = locationPrices[drinkType][location] || 4.99;
    setCurrentLocation(location);
    if (glasses > 0) {
      setGlasses(glasses - 1);
      const newTotal = totalPrice + price;
      setTotalPrice(newTotal);
      
      setSaleDetails({
        location,
        price,
        newTotal
      });
      setShowSaleModal(true);
      
      if (glasses - 1 === 0) {
        setCanSell(false);
      }

      // Notify parent component of the sale
      if (onSaleComplete) {
        onSaleComplete(newTotal);
      }
    }
    setShowLocationPrompt(false);
  };

  const sellMoreGlasses = () => {
    if (glasses > 0) {
      setShowLocationPrompt(true);
    }
  };

  const closeSaleModal = () => {
    setShowSaleModal(false);
    if (glasses === 0) {
      alert(dict.drinks[drinkType].outOfStock);
    }
  };

  return (
    <>
      {/* Game Stats */}
      <div className={styles.gameStats}>
        <p><strong>{dict?.drinks?.[drinkType]?.glassesReady?.replace('{count}', glasses) || `Glasses Ready: ${glasses}/5`}</strong></p>
        <p><strong>${totalPrice.toFixed(2)} {dict?.drinks?.[drinkType]?.earnings || 'Total Earnings'}</strong></p>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks[drinkType].nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[drinkType][currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks[drinkType].sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Prompt */}
      {showLocationPrompt && (
        <LocationPrompt
          dictionary={dict}
          onSubmit={handleLocationSubmit}
          onSkip={() => setShowLocationPrompt(false)}
        />
      )}

      {/* Sale Success Modal */}
      {showSaleModal && (
        <div className={styles.saleModalOverlay}>
          <div className={styles.saleModal}>
            <div className={styles.saleSuccessIcon}>🎉</div>
            <h2 className={styles.saleTitle}>{dict.drinks[drinkType].saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks[drinkType].soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks[drinkType].price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks[drinkType].remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks[drinkType].totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks[drinkType].continueSelling}
            </button>
          </div>
        </div>
      )}
    </>
  );
} 