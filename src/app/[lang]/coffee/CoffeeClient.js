"use client"

import React, { useState, useRef } from "react";
import Image from "next/image";
import styles from "../../../../page.module.css";
import coffee_beans from "../../../../assets/coffee-beans.png";
import milks from "../../../../assets/milk.png";
import LanguageSwitcher from "../LanguageSwitcher";
import LocationPrompt from '../LocationPrompt';

export default function CoffeeClient({ dict, lang }) {
  const [coffee, setCoffee] = useState(0);
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

  const addCoffee = () => {
    if (coffee < 10) {
      setCoffee(coffee + 1);
    }
  }
  
  const addMilk = () => {
    if (milk < 10) {
      setMilk(milk + 1);
    }
  }

  const testRecipe = () => {
    setTotalRounds(totalRounds + 1);
    let resultMessage = "";
    let isPerfect = false;
    
    // Perfect coffee: coffee:milk = 1:2
    if (coffee === 0 || milk === 0) {
      resultMessage = dict.drinks.coffee.needBoth;
    } else if (coffee > 0 && milk > 0 && coffee / 1 === milk / 2) {
      resultMessage = dict.drinks.coffee.perfectMessage;
      isPerfect = true;
      setGlasses(glasses + 1); // Add one glass when recipe is perfect
      
      if (glasses + 1 >= 5) {
        resultMessage += " " + dict.drinks.coffee.readyToSell;
        setCanSell(true);
      }
    } else if (coffee / 1 > milk / 2) {
      resultMessage = dict.drinks.coffee.tooMuchCoffee;
    } else if (coffee / 1 < milk / 2) {
      resultMessage = dict.drinks.coffee.almostThere;
    } else {
      resultMessage = dict.drinks.coffee.tryDifferent;
    }
    
    // Update game stats
    if (isPerfect) {
      setScore(score + 10);
      setPerfectRounds(perfectRounds + 1);
      
      // Update goal progress in localStorage
      if (typeof window !== 'undefined') {
        const savedGoals = localStorage.getItem('dailyGoals');
        if (savedGoals) {
          const goals = JSON.parse(savedGoals);
          const updatedGoals = goals.map(goal => {
            if (goal.type === 'coffee' && !goal.completed) {
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
    setCoffee(0);
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
      alert(dict.drinks.coffee.outOfStock);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1 className={styles.drinkTitle}>
            {dict.drinks.coffee.title}
          </h1>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      {/* Game Header */}
      <div className={styles.gameHeader}>
        <div className={styles.roundInfo}>
          <div className={styles.round}>{dict.game.round.replace('{number}', currentRound)}</div>
          <div className={styles.scoreDisplay}>
            ${totalPrice.toFixed(2)} {dict.drinks.coffee.earnings}
          </div>
        </div>
        <div className={styles.gameStats}>
          <p><strong>{dict.drinks.coffee.glassesReady.replace('{count}', glasses)}</strong></p>
          <p><strong>{dict.game.perfectRounds.replace('{count}', perfectRounds)}</strong></p>
          <p><strong>{dict.game.totalAttempts.replace('{count}', totalRounds)}</strong></p>
        </div>
      </div>

      {/* Location display */}
      {currentLocation && (
        <div className={styles.locationContainer}>
          <div className={styles.locationWrapper}>
            <div className={styles.locationContent}>
              <h1 className={styles.locationLabel}>{dict.drinks.coffee.nowSelling}</h1>
              <div className={styles.locationName}>
                {currentLocation} - ${locationPrices[currentLocation]?.toFixed(2)}/glass
              </div>
              {glasses > 0 && (
                <button 
                  onClick={sellMoreGlasses}
                  className={styles.sellMoreButton}
                >
                  {dict.drinks.coffee.sellMore}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={styles.cardContainer}>
        <div className={styles.card + " " + styles.drinkCard}>
          <h3 className={styles.ingredients}>{dict.drinks.coffee.ingredients}</h3>
          <img
            src={coffee_beans.src}
            alt="Coffee Beans"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.coffee.coffeeBeans} {coffee}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.coffee.coffeeBeansDesc}</p>
            <button onClick={addCoffee} className={styles.tea}>{dict.drinks.coffee.addCoffeeBeans}</button>
          </div>

          <img
            src={milks.src}
            alt="Fresh Milk"
            className={styles.image}
          />

          <div className={styles.content}>
            <h2>{dict.drinks.coffee.milk} {milk}/10</h2>
            <p className={styles.ingredientDesc}>{dict.drinks.coffee.milkDesc}</p>
            <button onClick={addMilk} className={styles.milk}>{dict.drinks.coffee.addMilk}</button>
            <div className={styles.recipeInfo}>
              <p>
                <strong>{dict.drinks.coffee.perfectRatio}</strong>
              </p>
              <p>
                <strong>{dict.drinks.coffee.currentRatio.replace('{ratio}', coffee > 0 && milk > 0 ? (coffee/milk).toFixed(2) : "0")}</strong>
              </p>
            </div>
            <p className={styles.message}>{message}</p>
            <button className={styles.btn} onClick={testRecipe}>{dict.drinks.coffee.testRecipe}</button>
          </div>
        </div>
      </div>

      {/* Recipe Result Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>
              {dict.drinks.coffee.modalTitle.replace('{round}', totalRounds)}
            </h2>
            <div>
              <p className={styles.modalText}>{message}</p>
              <p className={styles.modalText}>
                ☕ {dict.drinks.coffee.coffeeBeansUsed.replace('{count}', coffee)}
              </p>
              <p className={styles.modalText}>
                🥛 {dict.drinks.coffee.milkUsed.replace('{count}', milk)}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.coffee.ratio.replace('{ratio}', coffee > 0 && milk > 0 ? (coffee/milk).toFixed(2) : "N/A")}
              </p>
              <p className={styles.modalText}>
                ✅ {dict.drinks.coffee.perfectRatioStatus.replace('{status}', coffee > 0 && milk > 0 && coffee / 1 === milk / 2 ? dict.common.perfect : dict.common.notYet)}
              </p>
              {canSell && (
                <p className={styles.modalText}>
                  🥤 {dict.drinks.coffee.glassesReady.replace('{count}', glasses)}
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={closeModal}
                className={styles.modalButton}
              >
                {dict.drinks.coffee.nextRound}
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
            <h2 className={styles.saleTitle}>{dict.drinks.coffee.saleSuccess}</h2>
            <div className={styles.saleInfo}>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.coffee.soldAt}</span>
                <span className={styles.saleAmount}>{saleDetails.location}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.coffee.price}</span>
                <span className={styles.saleAmount}>${saleDetails.price.toFixed(2)}</span>
              </div>
              <div className={styles.saleDetail}>
                <span>{dict.drinks.coffee.remainingGlasses}</span>
                <span className={styles.saleAmount}>{glasses}</span>
              </div>
            </div>
            <div className={styles.saleTotal}>
              {dict.drinks.coffee.totalEarnings}: ${saleDetails.newTotal.toFixed(2)}
            </div>
            <button 
              className={styles.saleCloseButton}
              onClick={closeSaleModal}
            >
              {dict.drinks.coffee.continueSelling}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 