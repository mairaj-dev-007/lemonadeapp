"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import mangoes from "../../../../assets/mango.png";
import milks from "../../../../assets/milk.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function MangoClient({ dict, lang }) {
  const [mango, setMango] = useState(0);
  const [milk, setMilk] = useState(0);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [perfectRounds, setPerfectRounds] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  // Glass management state
  const [glasses, setGlasses] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [canSell, setCanSell] = useState(false);
  const [locationPrices] = useState({
    "Lahore": 6.99,
    "Multan": 5.99,
    "Islamabad": 7.99,
    "Karachi": 8.99,
    "Faislabad": 4.99
  });

  // Sale modal state
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    location: '',
    price: 0,
    newTotal: 0
  });

  const addMango = () => {
    if (mango < 10) {
      setMango(mango + 1);
    }
  }
  
  const addMilk = () => {
    if (milk < 10) {
      setMilk(milk + 1);
    }
  }

  const click = () => {
    let resultMessage = "";
    let isPerfect = false;
    
    // Perfect mango shake: mango:milk = 1:1
    if (mango > 0 && milk > 0 && mango === milk) {
      resultMessage = dict.drinks.mango.perfectMessage;
      isPerfect = true;
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      
      if (glasses + 1 >= 5) {
        resultMessage += " " + dict.drinks.mango.readyToSell;
        setCanSell(true);
      }
    } else if (mango === 0 || milk === 0) {
      resultMessage = dict.drinks.mango.needBoth;
    } else if (mango > milk) {
      resultMessage = dict.drinks.mango.tooMuchMango;
    } else if (mango < milk) {
      resultMessage = dict.drinks.mango.almostThere;
    } else {
      resultMessage = dict.drinks.mango.tryDifferent;
    }
    
    // Update game stats
    setTotalRounds(totalRounds + 1);
    if (isPerfect) {
      setScore(score + 10);
      setPerfectRounds(perfectRounds + 1);
      
      // Send goal update message to home page
      if (typeof window !== 'undefined') {
        window.postMessage({
          type: 'GOAL_UPDATE',
          goalType: 'mango',
          perfectCount: 1
        }, '*');
      }
    } else {
      setScore(score + 1);
    }
    
    setMessage(resultMessage);
    setModalMessage(resultMessage);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
    if (canSell) {
      setShowLocationPrompt(true);
    }
    resetIngredients();
  }

  const resetIngredients = () => {
    setMango(0);
    setMilk(0);
  }

  const handleLocationSubmit = (location) => {
    const price = locationPrices[location] || 4.99;
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
    }
    setShowLocationPrompt(false);
  }

  const sellMoreGlasses = () => {
    if (glasses > 0) {
      setShowLocationPrompt(true);
    }
  }

  const handleLocationSkip = () => {
    setShowLocationPrompt(false);
  }

  const closeSaleModal = () => {
    setShowSaleModal(false);
    if (glasses === 0) {
      alert(dict.drinks.mango.outOfStock);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1>
            {dict.drinks.mango.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.roundDisplay}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.mango.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.mango.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.mango.nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.mango.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.mango.ingredients}</h3>
          <img
            src={mangoes.src}
            alt="Fresh Mangoes"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.mango.mangoes} {mango}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.mango.mangoesDesc}</p>
            <button onClick={addMango} className={styles.mango}>{dict.drinks.mango.addMangoes}</button>
          </div>

          <img
            src={milks.src}
            alt="Fresh Milk"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.mango.milk} {milk}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.mango.milkDesc}</p>
            <button onClick={addMilk} className={styles.milk}>{dict.drinks.mango.addMilk}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.mango.perfectRatio}</strong>
              </p>
              <p>
                <strong>{dict.drinks.mango.currentRatio.replace('{ratio}', mango > 0 && milk > 0 ? (mango/milk).toFixed(2) : "0")}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={click}>{dict.drinks.mango.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Recipe Result Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.mango.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                🥭 {dict.drinks.mango.mangoesUsed.replace('{count}', mango)}
              </p>
              <p className={styles.modalText}>
                🥛 {dict.drinks.mango.milkUsed.replace('{count}', milk)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.mango.ratio.replace('{ratio}', mango > 0 && milk > 0 ? (mango/milk).toFixed(2) : "N/A")}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.mango.perfectRatioStatus.replace('{status}', mango > 0 && milk > 0 && mango === milk ? dict.common.perfect : dict.common.notYet)}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.mango.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {dict.drinks.mango.nextRound}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Selection Prompt */}
      {showLocationPrompt && (
        <LocationPrompt
          dictionary={dict}
          onSubmit={handleLocationSubmit}
          onSkip={handleLocationSkip}
        />
      )}

      {/* Sale Success Modal */}
      {showSaleModal && (
        <div className={styles.saleModalOverlay}>
          <div className={styles.saleModal}>
            <div className={styles.saleSuccessIcon}>🎉</div>
            <h2 className={styles.saleTitle}>{dict.drinks.mango.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.mango.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.mango.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.mango.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.mango.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.mango.continueSelling}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 