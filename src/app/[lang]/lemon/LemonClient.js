"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import lemon from "../../../../assets/lemon.png";
import drop from "../../../../assets/drop.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function LemonClient({ dict, lang }) {
  const [lemons, setLemons] = useState(0);
  const [water, setWater] = useState(0);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [goal, setGoal] = useState(0);
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [perfectRounds, setPerfectRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [round, setRound] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("");

  // New state for glass management
  const [glasses, setGlasses] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [locationPrices] = useState({
    "Lahore": 5.99,
    "Multan": 4.99,
    "Islamabad": 6.99,
    "Karachi": 7.99,
    "Faislabad": 3.99
  });

  // Add new state for sale success modal
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    location: '',
    price: 0,
    newTotal: 0
  });

  const addLemons = () => {
    if(lemons<10){
      setLemons(lemons + 1);
    }
  }

  const addWater = () => {
    setWater(water+1);
  }

  const testRecipe = () => {
    setTotalRounds(totalRounds + 1);
    const ratio = water / (lemons || 1);
    
    if (water === 0 || lemons === 0) {
      setMessage(dict.drinks.lemon.needBoth);
      return;
    }

    if (Math.abs(ratio - 4) < 0.1) {
      setMessage(dict.drinks.lemon.perfectMessage);
      setPerfectRounds(perfectRounds + 1);
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      if (glasses + 1 >= 5) {
        setMessage(dict.drinks.lemon.perfectMessage + " " + dict.drinks.lemon.readyToSell);
        setCanSell(true);
      }
      setShowModal(true);
    } else if (ratio > 4) {
      setMessage(dict.drinks.lemon.tooManyLemons);
      setShowModal(true);
    } else {
      setMessage(dict.drinks.lemon.almostThere);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (canSell) {
      setShowLocationPrompt(true);
    }
    resetIngredients();
  };

  const resetIngredients = () => {
    setLemons(0);
    setWater(0);
  };

  const handleLocationSubmit = (location) => {
    const price = locationPrices[location] || 4.99;
    setCurrentLocation(location);
    if (glasses > 0) {
      setGlasses(glasses - 1);
      const newTotal = totalPrice + price;
      setTotalPrice(newTotal);
      
      // Show sale success modal instead of alert
      setSaleDetails({
        location,
        price,
        newTotal
      });
      setShowSaleModal(true);
      
      if (glasses - 1 === 0) {
        setCanSell(false);
      }
    }
    setShowLocationPrompt(false);
  };

  const sellMoreGlasses = () => {
    if (glasses > 0) {
      setShowLocationPrompt(true);
    }
  };

  const handleLocationSkip = () => {
    setShowLocationPrompt(false);
  };

  const closeSaleModal = () => {
    setShowSaleModal(false);
    if (glasses === 0) {
      alert(dict.drinks.lemon.outOfStock);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1 className={styles.drinkTitle}>
            {dict.drinks.lemon.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.round}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.lemon.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.lemon.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display with sell more button */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.lemon.nowSelling}</h1>
              <div className={styles.locationName}>{currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass</div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.lemon.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.lemon.ingredients}</h3>
          <img
            src={lemon.src}
            alt="Fresh Lemons"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.lemon.lemons} {lemons}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.lemon.lemonsDesc}</p>
            <button onClick={addLemons} className={styles.lemon}>{dict.drinks.lemon.addLemons}</button>
          </div>

          <img
            src={drop.src}
            alt="Pure Water"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.lemon.water} {water}/∞</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.lemon.waterDesc}</p>
            <button onClick={addWater} className={styles.water}>{dict.drinks.lemon.addWater}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.lemon.perfectRatio}</strong>
              </p>
              <p>
                <strong>{dict.drinks.lemon.currentRatio.replace('{ratio}', lemons > 0 ? (water/lemons).toFixed(2) : "0")}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={testRecipe}>{dict.drinks.lemon.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.lemon.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                🍋 {dict.drinks.lemon.lemonsUsed.replace('{count}', lemons)}
              </p>
              <p className={styles.modalText}>
                💧 {dict.drinks.lemon.waterUsed.replace('{count}', water)}
              </p>
              <p className={styles.modalText}>
                ⚖️ {dict.drinks.lemon.ratio.replace('{ratio}', (water/(lemons || 1)).toFixed(2))}
              </p>
              <p className={styles.modalText}>
                🎯 {dict.drinks.lemon.targetRatio}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.lemon.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {canSell ? dict.drinks.lemon.sellNow : dict.drinks.lemon.nextRound}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Success Modal */}
      {showSaleModal && (
        <div className={styles.saleModalOverlay}>
          <div className={styles.saleModal}>
            <div className={styles.saleSuccessIcon}>🎉</div>
            <h2 className={styles.saleTitle}>{dict.drinks.lemon.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.lemon.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.lemon.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.lemon.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.lemon.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.lemon.continueSelling}
            </button>
          </div>
        </div>
      )}

      {showLocationPrompt && (
        <LocationPrompt
          dictionary={dict}
          onSubmit={handleLocationSubmit}
          onSkip={handleLocationSkip}
        />
      )}
    </div>
  );
} 