"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import blueberry from "../../../../assets/blueberries.png";
import milk from "../../../../assets/milk.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function BlueberryClient({ dict, lang }) {
  const [blueberries, setBlueberries] = useState(0);
  const [milkAmount, setMilkAmount] = useState(0);
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
    "Lahore": 7.99,
    "Multan": 6.99,
    "Islamabad": 8.99,
    "Karachi": 9.99,
    "Faislabad": 5.99
  });

  // Sale modal state
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    location: '',
    price: 0,
    newTotal: 0
  });

  const addBlueberries = () => {
    setBlueberries(blueberries + 1);
  }

  const addMilk = () => {
    setMilkAmount(milkAmount + 1);
  }

  const testRecipe = () => {
    setTotalRounds(totalRounds + 1);
    
    if (blueberries === 0 || milkAmount === 0) {
      setMessage(dict.drinks.blueberry.needBoth);
      setShowModal(true);
      return;
    }

    const isBlueberriesEven = blueberries % 2 === 0;
    const isMilkMultipleOfThree = milkAmount % 3 === 0;

    if (isBlueberriesEven && isMilkMultipleOfThree) {
      setMessage(dict.drinks.blueberry.perfectMessage);
      setPerfectRounds(perfectRounds + 1);
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      
      if (glasses + 1 >= 5) {
        setMessage(dict.drinks.blueberry.perfectMessage + " " + dict.drinks.blueberry.readyToSell);
        setCanSell(true);
      }
    } else if (!isBlueberriesEven) {
      setMessage(dict.drinks.blueberry.blueberriesEven);
    } else {
      setMessage(dict.drinks.blueberry.milkMultiple);
    }
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
    setBlueberries(0);
    setMilkAmount(0);
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
      alert(dict.drinks.blueberry.outOfStock);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1 className={styles.drinkTitle}>
            {dict.drinks.blueberry.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.round}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.blueberry.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.blueberry.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.blueberry.nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.blueberry.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.blueberry.ingredients}</h3>
          <img
            src={blueberry.src}
            alt="Fresh Blueberries"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.blueberry.blueberries} {blueberries}</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.blueberry.blueberriesDesc}</p>
            <button onClick={addBlueberries} className={styles.blueberry}>{dict.drinks.blueberry.addBlueberries}</button>
          </div>

          <img
            src={milk.src}
            alt="Fresh Milk"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.blueberry.milk} {milkAmount}</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.blueberry.milkDesc}</p>
            <button onClick={addMilk} className={styles.milk}>{dict.drinks.blueberry.addMilk}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.blueberry.perfectPattern}</strong>
              </p>
              <p>
                <strong>{dict.drinks.blueberry.currentStatus.replace('{blueberriesStatus}', blueberries % 2 === 0 ? '✅' : '❌').replace('{milkStatus}', milkAmount % 3 === 0 ? '✅' : '❌')}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={testRecipe}>{dict.drinks.blueberry.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Recipe Result Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.blueberry.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                🫐 {dict.drinks.blueberry.blueberriesUsed.replace('{count}', blueberries)}
              </p>
              <p className={styles.modalText}>
                🥛 {dict.drinks.blueberry.milkUsed.replace('{count}', milkAmount)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.blueberry.blueberriesEvenStatus.replace('{status}', blueberries % 2 === 0 ? '✅' : '❌')}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.blueberry.milkMultipleStatus.replace('{status}', milkAmount % 3 === 0 ? '✅' : '❌')}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.blueberry.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {dict.drinks.blueberry.nextRound}
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
            <h2 className={styles.saleTitle}>{dict.drinks.blueberry.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.blueberry.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.blueberry.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.blueberry.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.blueberry.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.blueberry.continueSelling}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 