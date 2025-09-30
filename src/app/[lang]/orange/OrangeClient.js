"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import orange from "../../../../assets/orange.png";
import drop from "../../../../assets/drop.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function OrangeClient({ dict, lang }) {
  const [oranges, setOranges] = useState(0);
  const [water, setWater] = useState(0);
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

  const addOranges = () => {
    if(oranges<10){
      setOranges(oranges + 1);
    }
  }

  const addWater = () => {
    setWater(water+1);
  }

  const click = () =>{
    let resultMessage = "";
    let isPerfect = false;
    
    if(oranges > 0 && water > 0 && oranges/water === 5/2){
      resultMessage = dict.drinks.orange.perfectMessage;
      isPerfect = true;
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      
      if (glasses + 1 >= 5) {
        resultMessage += " " + dict.drinks.orange.readyToSell;
        setCanSell(true);
      }
    }
    else if(oranges === 0 || water === 0){
      resultMessage = dict.drinks.orange.needBoth;
    }
    else if(oranges/water < 5/2){
      resultMessage = dict.drinks.orange.tooManyOranges;
    }
    else if(oranges/water > 5/2){
      resultMessage = dict.drinks.orange.almostThere;
    }
    else {
      resultMessage = dict.drinks.orange.tryDifferent;
    }
    
    // Update game stats
    setTotalRounds(totalRounds + 1);
    if (isPerfect) {
      setScore(score + 10);
      setPerfectRounds(perfectRounds + 1);
      
      // Update goal progress in localStorage
      if (typeof window !== 'undefined') {
        const savedGoals = localStorage.getItem('dailyGoals');
        if (savedGoals) {
          const goals = JSON.parse(savedGoals);
          const updatedGoals = goals.map(goal => {
            if (goal.type === 'orange' && !goal.completed) {
              const newCurrent = Math.min(goal.current + 1, goal.target);
              const isCompleted = newCurrent >= goal.target;
              
              // If goal just completed, add points to total
              if (isCompleted && !goal.completed) {
                const currentPoints = parseInt(localStorage.getItem('totalPoints') || '0');
                const currentCompleted = parseInt(localStorage.getItem('completedGoals') || '0');
                localStorage.setItem('totalPoints', (currentPoints + goal.reward).toString());
                localStorage.setItem('completedGoals', (currentCompleted + 1).toString());
              }
              
              return {
                ...goal,
                current: newCurrent,
                completed: isCompleted
              };
            }
            return goal;
          });
          localStorage.setItem('dailyGoals', JSON.stringify(updatedGoals));
        }
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
    setOranges(0);
    setWater(0);
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
      alert(dict.drinks.orange.outOfStock);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1>
            {dict.drinks.orange.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.roundDisplay}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.orange.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.orange.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.orange.nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.orange.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.orange.ingredients}</h3>
          <img
            src={orange.src}
            alt="Fresh Oranges"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.orange.oranges} {oranges}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.orange.orangesDesc}</p>
            <button onClick={addOranges} className={styles.orrange}>{dict.drinks.orange.addOranges}</button>
          </div>

          <img
            src={drop.src}
            alt="Pure Water"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.orange.sparklingWater} {water}/∞</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.orange.sparklingWaterDesc}</p>
            <button onClick={addWater} className={styles.water}>{dict.drinks.orange.addSparklingWater}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.orange.perfectRatio}</strong>
              </p>
              <p>
                <strong>{dict.drinks.orange.currentRatio.replace('{ratio}', oranges > 0 && water > 0 ? (oranges/water).toFixed(2) : "0")}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={click}>{dict.drinks.orange.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Recipe Result Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.orange.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                🍊 {dict.drinks.orange.orangesUsed.replace('{count}', oranges)}
              </p>
              <p className={styles.modalText}>
                💧 {dict.drinks.orange.sparklingWaterUsed.replace('{count}', water)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.orange.ratio.replace('{ratio}', oranges > 0 && water > 0 ? (oranges/water).toFixed(2) : "N/A")}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.orange.perfectRatioStatus.replace('{status}', oranges > 0 && water > 0 && oranges/water === 5/2 ? dict.common.perfect : dict.common.notYet)}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.orange.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {dict.drinks.orange.nextRound}
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
            <h2 className={styles.saleTitle}>{dict.drinks.orange.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.orange.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.orange.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.orange.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.orange.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.orange.continueSelling}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 