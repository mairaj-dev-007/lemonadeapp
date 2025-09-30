"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../../page.module.css";
import lemon from "../../../assets/lemon.png";
import orange from "../../../assets/orange.png";
import blueberry from "../../../assets/blueberries.png";
import tea from "../../../assets/tea.png";
import coffee from "../../../assets/coffee-beans.png";
import mangoShake from "../../../assets/mango.png";
import LanguageSwitcher from "./LanguageSwitcher";

export default function HomeClient({ dict, lang }) {
  // Add hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Daily goals state
  const [dailyGoals, setDailyGoals] = useState([
    {
      id: 1,
      title: dict.goals.lemonMaster.title,
      description: dict.goals.lemonMaster.description,
      target: 3,
      current: 0,
      completed: false,
      reward: 50,
      type: "lemon"
    },
    {
      id: 2,
      title: dict.goals.smoothieExpert.title,
      description: dict.goals.smoothieExpert.description,
      target: 2,
      current: 0,
      completed: false,
      reward: 40,
      type: "blueberry"
    },
    {
      id: 3,
      title: dict.goals.teaConnoisseur.title,
      description: dict.goals.teaConnoisseur.description,
      target: 2,
      current: 0,
      completed: false,
      reward: 60,
      type: "tea"
    },
    {
      id: 4,
      title: dict.goals.juiceSpecialist.title,
      description: dict.goals.juiceSpecialist.description,
      target: 2,
      current: 0,
      completed: false,
      reward: 45,
      type: "orange"
    },
    {
      id: 5,
      title: dict.goals.coffeeBarista.title,
      description: dict.goals.coffeeBarista.description,
      target: 2,
      current: 0,
      completed: false,
      reward: 55,
      type: "coffee"
    },
    {
      id: 6,
      title: dict.goals.tropicalMaster.title,
      description: dict.goals.tropicalMaster.description,
      target: 2,
      current: 0,
      completed: false,
      reward: 35,
      type: "mango"
    }
  ]);

  const [totalPoints, setTotalPoints] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [completedGoal, setCompletedGoal] = useState(null);

  // Set hydration state on mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load data from localStorage on component mount (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    const savedGoals = localStorage.getItem('dailyGoals');
    const savedPoints = localStorage.getItem('totalPoints');
    const savedCompleted = localStorage.getItem('completedGoals');
    const lastReset = localStorage.getItem('lastResetDate');
    
    const today = new Date().toDateString();
    
    // Reset goals if it's a new day
    if (lastReset !== today) {
      localStorage.setItem('lastResetDate', today);
      localStorage.setItem('dailyGoals', JSON.stringify(dailyGoals));
      localStorage.setItem('totalPoints', '0');
      localStorage.setItem('completedGoals', '0');
    } else {
      // Load saved data
      if (savedGoals) setDailyGoals(JSON.parse(savedGoals));
      if (savedPoints) setTotalPoints(parseInt(savedPoints));
      if (savedCompleted) setCompletedGoals(parseInt(savedCompleted));
    }
  }, [isHydrated]);

  // Save data to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    
    localStorage.setItem('dailyGoals', JSON.stringify(dailyGoals));
    localStorage.setItem('totalPoints', totalPoints.toString());
    localStorage.setItem('completedGoals', completedGoals.toString());
  }, [dailyGoals, totalPoints, completedGoals, isHydrated]);

  // Update goals when dictionary changes (language change)
  useEffect(() => {
    if (!isHydrated) return;
    
    setDailyGoals(prevGoals => {
      return prevGoals.map(goal => {
        let newTitle, newDescription;
        
        switch (goal.type) {
          case 'lemon':
            newTitle = dict.goals.lemonMaster.title;
            newDescription = dict.goals.lemonMaster.description;
            break;
          case 'blueberry':
            newTitle = dict.goals.smoothieExpert.title;
            newDescription = dict.goals.smoothieExpert.description;
            break;
          case 'tea':
            newTitle = dict.goals.teaConnoisseur.title;
            newDescription = dict.goals.teaConnoisseur.description;
            break;
          case 'orange':
            newTitle = dict.goals.juiceSpecialist.title;
            newDescription = dict.goals.juiceSpecialist.description;
            break;
          case 'coffee':
            newTitle = dict.goals.coffeeBarista.title;
            newDescription = dict.goals.coffeeBarista.description;
            break;
          case 'mango':
            newTitle = dict.goals.tropicalMaster.title;
            newDescription = dict.goals.tropicalMaster.description;
            break;
          default:
            newTitle = goal.title;
            newDescription = goal.description;
        }
        
        return {
          ...goal,
          title: newTitle,
          description: newDescription
        };
      });
    });
  }, [dict, isHydrated]);

  // Listen for goal completion messages from other pages
  useEffect(() => {
    if (!isHydrated) return;
    
    const handleGoalUpdate = (event) => {
      console.log('Received message:', event.data); // Debug log
      if (event.data.type === 'GOAL_UPDATE') {
        console.log('Processing goal update:', event.data.goalType, event.data.perfectCount); // Debug log
        updateGoalProgress(event.data.goalType, event.data.perfectCount);
      }
    };

    window.addEventListener('message', handleGoalUpdate);
    return () => window.removeEventListener('message', handleGoalUpdate);
  }, [isHydrated]);

  const updateGoalProgress = (goalType, perfectCount) => {
    console.log('Updating goal progress:', goalType, perfectCount); // Debug log
    setDailyGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        if (goal.type === goalType && !goal.completed) {
          const newCurrent = Math.min(goal.current + perfectCount, goal.target);
          const isCompleted = newCurrent >= goal.target;
          
          console.log(`Goal ${goal.type}: current=${goal.current}, newCurrent=${newCurrent}, target=${goal.target}, completed=${isCompleted}`); // Debug log
          
          if (isCompleted && !goal.completed) {
            // Goal just completed
            console.log('Goal completed! Adding points:', goal.reward); // Debug log
            setTotalPoints(prev => prev + goal.reward);
            setCompletedGoals(prev => prev + 1);
            setCompletedGoal(goal);
            setShowGoalModal(true);
          }
          
          return {
            ...goal,
            current: newCurrent,
            completed: isCompleted
          };
        }
        return goal;
      });
      return updatedGoals;
    });
  };

  const closeGoalModal = () => {
    setShowGoalModal(false);
    setCompletedGoal(null);
  };

  const openGoalsModal = () => {
    setShowGoalsModal(true);
  };

  const closeGoalsModal = () => {
    setShowGoalsModal(false);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  // Don't render until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.headerWithLanguage}>
          <div className={styles.headerContent}>
            <h1>{dict.home.title}</h1>
            <p>{dict.home.subtitle}</p>
            <button className={styles.goalsButton} disabled>
              {dict.home.viewGoalsButton} (0/6)
            </button>
          </div>
          <LanguageSwitcher currentLang={lang} />
        </div>
        <div className={styles.cardContainer}>
          {/* Loading skeleton */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.image} style={{ backgroundColor: '#f0f0f0' }}></div>
              <div className={styles.content}>
                <h2 style={{ backgroundColor: '#f0f0f0', height: '20px', width: '60%' }}></h2>
                <p style={{ backgroundColor: '#f0f0f0', height: '16px', width: '80%' }}></p>
                <div className={styles.btn} style={{ backgroundColor: '#f0f0f0', height: '40px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerWithLanguage}>
        <div className={styles.headerContent}>
          <h1 className={styles.drinkTitle}>
            {dict.home.title}
          </h1>
          
          {/* Daily Goals Button */}
          <button className={styles.goalsButton} onClick={openGoalsModal}>
            {dict.home.viewGoalsButton} ({completedGoals}/6)
          </button>
        </div>
        <LanguageSwitcher currentLang={lang} />
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <img
            src={lemon.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.lemon.title}</h2>
            <p>
              {dict.drinks.lemon.subtitle}
            </p>
            <a href={`/${lang}/lemon`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <img
            src={blueberry.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.blueberry.title}</h2>
            <p>
              {dict.drinks.blueberry.subtitle}
            </p>
            <a href={`/${lang}/blueberry`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <img
            src={tea.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.tea.title}</h2>
            <p>
              {dict.drinks.tea.subtitle}
            </p>
            <a href={`/${lang}/tea`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <img
            src={orange.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.orange.title}</h2>
            <p>
              {dict.drinks.orange.subtitle}
            </p>
            <a href={`/${lang}/orange`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <img
            src={coffee.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.coffee.title}</h2>
            <p>
              {dict.drinks.coffee.subtitle}
            </p>
            <a href={`/${lang}/coffee`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
        <div className={styles.card}>
          <img
            src={mangoShake.src}
            alt="Nature"
            className={styles.image}
          />
          <div className={styles.content}>
            <h2>{dict.drinks.mango.title}</h2>
            <p>
              {dict.drinks.mango.subtitle}
            </p>
            <a href={`/${lang}/mango`} className={styles.btn}>
              {dict.home.startMixing}
            </a>
          </div>
        </div>
      </div>

      {/* Daily Goals Modal */}
      {showGoalsModal && (
        <div className={styles.modalOverlay} onClick={closeGoalsModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{dict.goals.title}</h2>
              <button className={styles.closeButton} onClick={closeGoalsModal}>×</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.goalsStats}>
                <div className={styles.goalsStat}>
                  <span className={styles.statLabel}>{dict.goals.totalPoints}</span>
                  <span className={styles.statValue}>{totalPoints}</span>
                </div>
                <div className={styles.goalsStat}>
                  <span className={styles.statLabel}>{dict.goals.completed}</span>
                  <span className={styles.statValue}>{completedGoals}/6</span>
                </div>
              </div>
              
              <div className={styles.goalsGrid}>
                {dailyGoals.map((goal) => (
                  <div key={goal.id} className={`${styles.goalCard} ${goal.completed ? styles.goalCompleted : ''}`}>
                    <div className={styles.goalHeader}>
                      <h3>{goal.title}</h3>
                      <div className={styles.goalReward}>{dict.goals.lemonMaster.reward.replace('{points}', goal.reward)}</div>
                    </div>
                    <p className={styles.goalDescription}>{goal.description}</p>
                    <div className={styles.goalProgress}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill}
                          style={{ width: `${getProgressPercentage(goal.current, goal.target)}%` }}
                        ></div>
                      </div>
                      <div className={styles.progressText}>
                        {goal.current}/{goal.target}
                      </div>
                    </div>
                    {goal.completed && (
                      <div className={styles.goalCompletedBadge}>
                        {dict.goals.completed}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalBtn} onClick={closeGoalsModal}>
                {dict.home.continuePlaying}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goal Completion Modal */}
      {showGoalModal && completedGoal && (
        <div className={styles.modalOverlay} onClick={closeGoalModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{dict.goals.goalCompleted}</h2>
              <button className={styles.closeButton} onClick={closeGoalModal}>×</button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.goalCompletionIcon}>
                🏆
              </div>
              <h3 className={styles.goalCompletionTitle}>{completedGoal.title}</h3>
              <p className={styles.goalCompletionMessage}>
                {dict.goals.congratulations}
              </p>
              <div className={styles.goalRewardDisplay}>
                <span className={styles.rewardLabel}>{dict.goals.rewardEarned}</span>
                <span className={styles.rewardValue}>{dict.goals.points.replace('{points}', completedGoal.reward)}</span>
              </div>
              <div className={styles.goalCompletionStats}>
                <p>{dict.goals.totalPoints.replace('{points}', totalPoints)}</p>
                <p>{dict.goals.goalsCompleted.replace('{completed}', completedGoals)}</p>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalBtn} onClick={closeGoalModal}>
                {dict.home.continuePlaying}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 