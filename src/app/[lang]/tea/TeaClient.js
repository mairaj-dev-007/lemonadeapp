"use client"

import React, { useState } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import tea from "../../../../assets/tea.png";
import honey from "../../../../assets/honey.png";
import drop from "../../../../assets/drop.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function TeaClient({ dict, lang }) {
  const [teaLeaves, setTeaLeaves] = useState(0);
  const [honeyAmount, setHoneyAmount] = useState(0);
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
    "Lahore": 4.99,
    "Multan": 3.99,
    "Islamabad": 5.99,
    "Karachi": 6.99,
    "Faislabad": 2.99
  });

  // Sale modal state
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    location: '',
    price: 0,
    newTotal: 0
  });

  const addTea = () => {
    if(teaLeaves < 10) {
      setTeaLeaves(teaLeaves + 1);
    }
  }

  const addHoney = () => {
    if(honeyAmount < 10) {
      setHoneyAmount(honeyAmount + 1);
    }
  }

  const addWater = () => {
    setWater(water + 1);
  }

  const click = () => {
    let resultMessage = "";
    let isPerfect = false;
    
    if(water === 3 && teaLeaves === 1 && honeyAmount === 1 && water > 0 && teaLeaves > 0 && honeyAmount > 0){
      resultMessage = dict.drinks.tea.perfectMessage;
      isPerfect = true;
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      
      if (glasses + 1 >= 5) {
        resultMessage += " " + dict.drinks.tea.readyToSell;
        setCanSell(true);
      }
    }
    else if(teaLeaves === 0 || honeyAmount === 0 || water === 0){
      resultMessage = dict.drinks.tea.needAll;
    }
    else if(water !== 3 || teaLeaves !== 1 || honeyAmount !== 1){
      resultMessage = dict.drinks.tea.almostThere;
    }
    else {
      resultMessage = dict.drinks.tea.tryDifferent;
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
            if (goal.type === 'tea' && !goal.completed) {
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
    setTeaLeaves(0);
    setHoneyAmount(0);
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
      alert(dict.drinks.tea.outOfStock);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1>
            {dict.drinks.tea.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.roundDisplay}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.tea.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.tea.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.tea.nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.tea.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.tea.ingredients}</h3>
          <img
            src={tea.src}
            alt="Tea Leaves"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.tea.tea} {teaLeaves}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.tea.teaDesc}</p>
            <button onClick={addTea} className={styles.tea}>{dict.drinks.tea.addTea}</button>
          </div>

          <img
            src={honey.src}
            alt="Honey"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.tea.honey} {honeyAmount}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.tea.honeyDesc}</p>
            <button onClick={addHoney} className={styles.honey}>{dict.drinks.tea.addHoney}</button>
          </div>

          <img
            src={drop.src}
            alt="Water"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.tea.water} {water}/∞</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.tea.waterDesc}</p>
            <button onClick={addWater} className={styles.water}>{dict.drinks.tea.addWater}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.tea.perfectRatio}</strong>
              </p>
              <p>
                <strong>{dict.drinks.tea.currentRatio.replace('{ratio}', `${water}:${teaLeaves}:${honeyAmount}`)}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={click}>{dict.drinks.tea.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Recipe Result Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.tea.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                🫖 {dict.drinks.tea.teaUsed.replace('{count}', teaLeaves)}
              </p>
              <p className={styles.modalText}>
                🍯 {dict.drinks.tea.honeyUsed.replace('{count}', honeyAmount)}
              </p>
              <p className={styles.modalText}>
                💧 {dict.drinks.tea.waterUsed.replace('{count}', water)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.tea.ratio.replace('{ratio}', `${water}:${teaLeaves}:${honeyAmount}`)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.tea.perfectRatioStatus.replace('{status}', water === 3 && teaLeaves === 1 && honeyAmount === 1 ? dict.common.perfect : dict.common.notYet)}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.tea.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {dict.drinks.tea.nextRound}
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
            <h2 className={styles.saleTitle}>{dict.drinks.tea.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.tea.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.tea.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.tea.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.tea.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.tea.continueSelling}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 