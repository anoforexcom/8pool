"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Timer, Heart, Trophy, ChevronRight, LayoutGrid, Pause, Play,
  RefreshCw, Hourglass, AlertCircle, Users, Star, Wallet, Plus, RotateCcw,
  Volume2, VolumeX, Music, Music2, Settings, X, MessageCircle, CheckCircle, Gift
} from 'lucide-react';
import PoolTable from '../components/PoolTable';
import Controls from '../components/Controls';
import LevelSelector from '../components/LevelSelector';
import Leaderboard from '../components/Leaderboard';
import LandingPage from '../components/LandingPage';
import AuthPage from '../components/AuthPage';
import PolicyPages from '../components/PolicyPages';
import ChatGroup from '../components/ChatGroup';
import ReviewsPage from '../components/ReviewsPage';
import ProfilePage from '../components/ProfilePage';
import PaymentPage from '../components/PaymentPage';
import AdminDashboard from '../components/AdminDashboard';
import ReferralPage from '../components/ReferralPage';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
// import KidsMode from '../components/KidsMode';
import ShopifyStore from '../components/ShopifyStore';
import { PoolGameState, UserProfile, LeaderboardEntry, View, ChatMessage, Purchase, CreditPack, GlobalSettings, PoolLevelData, PoolBall } from '../types';
import { LEVELS, TOTAL_LEVELS, CREDIT_PACKS, OPPONENT_NAMES } from '../constants';
import { updatePhysics, initializeRack, TABLE_WIDTH, TABLE_HEIGHT, BALL_RADIUS } from '../services/poolPhysics';
import { calculateOpponentShot } from '../services/opponentService';
import { audioService } from '../services/audioService';
import { generateReferralCode } from '../utils/referralUtils';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, orderBy, limit, onSnapshot, addDoc, serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const USER_KEY = 'pool8-user-profile';
const CHAT_KEY = 'pool8-chat-history';
const SETTINGS_KEY = 'pool8-global-settings';

const DEFAULT_SETTINGS: GlobalSettings = {
  appName: 'pool8.live',
  primaryColor: '#4f46e5',
  pointsPerLevel: 100,
  timeBonusMultiplier: 2.0,
  mistakePenalty: 50,
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  paymentMode: 'simulated'
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [state, setState] = useState<PoolGameState | null>(null);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [notesMode, setNotesMode] = useState(false);
  const [isLevelChanging, setIsLevelChanging] = useState(false);
  const [lastGainedPoints, setLastGainedPoints] = useState<number>(0);
  const [pendingPurchase, setPendingPurchase] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number>(0);
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminClicks, setAdminClicks] = useState(0);
  const adminTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Fetch global settings from Firestore
    const settingsRef = doc(db, 'config', 'global');
    const unsub = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as GlobalSettings);
      } else {
        // Initialize settings if they don't exist
        setDoc(settingsRef, DEFAULT_SETTINGS);
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Handle Stripe Redirect Return
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const packId = urlParams.get('packId');

    if (paymentStatus === 'success' && packId && userProfile) {
      // Find the pack
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      if (pack) {
        const newCredits = userProfile.credits + pack.qty;
        setUserProfile({ ...userProfile, credits: newCredits });
        syncCredits(newCredits);
        recordPurchase(pack);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
        alert("🎉 Pagamento concluído com sucesso! Créditos adicionados.");
      }
    } else if (paymentStatus === 'cancel') {
      window.history.replaceState({}, '', window.location.pathname);
      alert("Pagamento cancelado.");
    }
  }, [userProfile, CREDIT_PACKS]);

  useEffect(() => {
    if (view === 'admin') {
      const fetchAdminData = async () => {
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const purchasesSnap = await getDocs(collection(db, 'purchases'));

        const profiles = profilesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const purchases = purchasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (profiles.length > 0) {
          const processedUsers = profiles.map((p: any) => ({
            id: p.id,
            name: p.name || 'Anonymous',
            email: p.email || '',
            totalScore: p.total_score || 0,
            credits: p.credits || 0,
            avatar: p.avatar || '',
            musicEnabled: p.music_enabled,
            soundEnabled: p.sound_enabled,
            completedLevelCount: p.completed_level_count || 0,
            purchaseHistory: (purchases || [])
              .filter((pur: any) => pur.user_id === p.id)
              .map((pur: any) => ({
                id: pur.id,
                date: pur.created_at?.seconds ? (pur.created_at.seconds * 1000) : Date.now(),
                credits: pur.credits,
                amount: pur.amount,
                currency: pur.currency,
                status: pur.status
              }))
          }));
          setAdminUsers(processedUsers);
        }
      };
      fetchAdminData();
    }
  }, [view]);

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    // Force update CSS variable for primary color
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
  }, [settings.primaryColor]);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) setUserProfile(JSON.parse(savedUser));

    const savedLevels = localStorage.getItem('pool8-progress');
    if (savedLevels) setCompletedLevels(JSON.parse(savedLevels));

    const savedChat = localStorage.getItem(CHAT_KEY);
    if (savedChat) setMessages(JSON.parse(savedChat));

    // Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const profile: UserProfile = {
        name: data.name,
        email: data.email,
        totalScore: data.total_score,
        completedLevelCount: data.completed_level_count || 0,
        credits: data.credits,
        soundEnabled: data.sound_enabled,
        musicEnabled: data.music_enabled,
        selectedTrackIndex: data.selected_track_index,
        avatar: data.avatar,
        purchaseHistory: [],
        referralCode: data.referral_code,
        referralData: {
          code: data.referral_code,
          userId: userId,
          createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
          totalReferred: 0,
          totalEarned: 0,
          referredUsers: []
        }
      };
      setUserProfile(profile);
      // Fetch level progress if stored separately, or use a field in profile
      setCompletedLevels(data.completed_levels || []);
      setView('game');
    }
  };

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
      if (userProfile.musicEnabled && (view === 'game' || view === 'landing')) {
        audioService.startBackgroundMusic(userProfile.selectedTrackIndex || 0);
      } else {
        audioService.stopBackgroundMusic();
      }
    }
  }, [userProfile?.musicEnabled, view, userProfile]);

  useEffect(() => {
    localStorage.setItem('pool8-progress', JSON.stringify(completedLevels));
  }, [completedLevels]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (showChat) setLastSeenTimestamp(Date.now());
  }, [showChat, messages.length]);

  const unreadCount = useMemo(() => {
    if (showChat) return 0;
    return messages.filter(m => m.timestamp > lastSeenTimestamp).length;
  }, [messages, lastSeenTimestamp, showChat]);

  // Removed chat simulator for production

  useEffect(() => {
    // Firestore Chat Subscription
    const q = query(collection(db, 'chat_messages'), orderBy('created_at', 'asc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => {
        const m = doc.data();
        return {
          id: doc.id,
          sender: m.sender,
          text: m.text,
          timestamp: (m.created_at && m.created_at.seconds) ? (m.created_at.seconds * 1000) : Date.now(),
          isMe: userProfile?.name === m.sender
        };
      });
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [userProfile?.name]);

  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'profiles'), orderBy('total_score', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);

      const realEntries: LeaderboardEntry[] = querySnapshot.docs.map(doc => {
        const p = doc.data();
        return {
          name: p.name || 'Anonymous',
          score: p.total_score || 0,
          levels: p.completed_level_count || 0,
          isCurrentUser: userProfile?.name === p.name
        };
      });

      // Mock players for Flippa Demo
      const demoPlayers: LeaderboardEntry[] = [
        { name: "PoolMaster_99", score: 12450, levels: 42 },
        { name: "Pro_Gamer_PT", score: 10800, levels: 35 },
        { name: "BilliardKing", score: 9200, levels: 31 },
        { name: "PoolTrain2026", score: 8500, levels: 28 },
        { name: "SmartPuzzles", score: 7100, levels: 22 },
        { name: "DailyPlayer", score: 6400, levels: 19 },
        { name: "MindBender", score: 5800, levels: 15 },
        { name: "FastSolver", score: 4200, levels: 12 },
        { name: "EasyPeasy", score: 3100, levels: 8 },
        { name: "Newbie_101", score: 1500, levels: 4 },
      ];

      const combinedEntries = [...realEntries, ...demoPlayers]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);

      setLeaderboardEntries(combinedEntries);
    };
    fetchLeaderboard();
  }, [userProfile]);

  const leaderboardData = useMemo(() => leaderboardEntries, [leaderboardEntries]);

  const toggleSound = async () => {
    if (!userProfile) return;
    const updated = { ...userProfile, soundEnabled: !userProfile.soundEnabled };
    setUserProfile(updated);
    if (updated.soundEnabled) audioService.playClick();

    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'profiles', user.uid), { sound_enabled: updated.soundEnabled });
    }
  };

  const toggleMusic = async () => {
    if (!userProfile) return;
    const updated = { ...userProfile, musicEnabled: !userProfile.musicEnabled };
    setUserProfile(updated);

    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'profiles', user.uid), { music_enabled: updated.musicEnabled });
    }
  };

  const handleLogin = (userData: { name: string, email: string }) => {
    const referralCode = generateReferralCode(userData.email);
    const newUser: UserProfile = {
      ...userData,
      totalScore: 0,
      completedLevelCount: 0,
      credits: 50,
      soundEnabled: true,
      musicEnabled: true,
      selectedTrackIndex: 0,
      purchaseHistory: [],
      referralCode,
      referralData: {
        code: referralCode,
        userId: userData.email,
        createdAt: Date.now(),
        totalReferred: 0,
        totalEarned: 0,
        referredUsers: []
      },
      referralMilestones: []
    };
    setUserProfile(newUser);
    setView('game');
    initLevel(1);

    if (pendingPurchase) {
      const pack = LEVELS.find(p => (p as any).id === pendingPurchase) || (CREDIT_PACKS.find(p => p.id === pendingPurchase) as any);
      if (pack && pack.qty) {
        setSelectedPack(pack);
        setView('payment');
      } else {
        setShowPurchaseModal(true);
      }
      setPendingPurchase(null);
    }
  };

  const handlePurchase = (pack: CreditPack) => {
    if (!userProfile) return;
    const newPurchase: Purchase = {
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
      credits: pack.qty,
      amount: pack.price,
      currency: pack.amount.charAt(0),
      status: 'completed'
    };
    const updatedProfile = {
      ...userProfile,
      credits: userProfile.credits + pack.qty,
      purchaseHistory: [newPurchase, ...(userProfile.purchaseHistory || [])]
    };
    setUserProfile(updatedProfile);
    setView('game');
    setSelectedPack(null);
  };

  const initLevel = (levelId: number) => {
    const levelData = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    const balls = initializeRack(levelData.id);
    const cueBall: PoolBall = {
      id: 0,
      x: TABLE_WIDTH * 0.25,
      y: TABLE_HEIGHT / 2,
      vx: 0,
      vy: 0,
      radius: BALL_RADIUS,
      type: 'cue',
      number: 0,
      isPotted: false,
      color: '#ffffff',
    };

    let timeLimit = 300; // 5 minutes standard for Pool matches

    setState({
      balls,
      cueBall,
      cueTarget: null,
      cuePower: 0,
      gameState: 'aiming',
      currentTurn: 'player',
      playerType: null,
      opponentType: null,
      opponentName: OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)],
      score: 0,
      shots: 0,
      maxShots: levelData.maxShots,
      pottedBalls: [],
      turnStartPottedCount: 0,
      level: levelId,
      difficulty: levelData.difficulty,
      timer: 0,
      timeLeft: timeLimit,
      isPaused: false,
    });
    setLastGainedPoints(0);
    setShowLevelSelector(false);
  };

  const transitionToLevel = (levelId: number) => {
    if (userProfile?.soundEnabled) audioService.playClick();
    setIsLevelChanging(true);
    setTimeout(() => {
      initLevel(levelId);
      setIsLevelChanging(false);
    }, 400);
  };

  useEffect(() => {
    if (!state || state.isPaused || state.gameState !== 'moving') return;

    let frameId: number;
    const loop = () => {
      setState(s => {
        if (!s || s.isPaused || s.gameState !== 'moving') return s;
        const nextState = updatePhysics(s);

        // Check for win/loss
        const allTargetBallsPotted = nextState.balls.every(b => b.isPotted);

        if (nextState.gameState === 'aiming') {
          const newlyPotted = nextState.pottedBalls.slice(s.turnStartPottedCount || 0);
          const pottedCueBall = newlyPotted.find(pb => pb.type === 'cue') || nextState.cueBall.isPotted;
          const potted8Ball = newlyPotted.find(pb => pb.type === 'black');

          let nextTurn = s.currentTurn;
          let playerType = s.playerType;
          let opponentType = s.opponentType;
          let isFoul = false;

          // 1. Handle Scratch (Cue Ball Potted)
          if (pottedCueBall) {
            isFoul = true;
            nextState.cueBall.x = TABLE_WIDTH * 0.25;
            nextState.cueBall.y = TABLE_HEIGHT / 2;
            nextState.cueBall.vx = 0;
            nextState.cueBall.vy = 0;
            nextState.cueBall.isPotted = false;
            nextState.pottedBalls = nextState.pottedBalls.filter(pb => pb.type !== 'cue');
          }

          // 2. Handle 8-Ball Potted
          if (potted8Ball) {
            const targetType = s.currentTurn === 'player' ? playerType : opponentType;
            // Count remaining balls of their suit. If type not set, they technically have all 7 remaining.
            const remainingSuitBalls = targetType ? nextState.balls.filter(b => b.type === targetType && !b.isPotted).length : 7;

            if (remainingSuitBalls === 0 && !isFoul) {
              // Legitimate Win
              if (s.currentTurn === 'player') {
                const shotsRemaining = Math.max(0, nextState.maxShots - nextState.shots);
                const shotBonus = shotsRemaining * 50;
                const points = (settings.pointsPerLevel || 100) + (nextState.timeLeft * (settings.timeBonusMultiplier || 2)) + shotBonus;
                setLastGainedPoints(points);

                if (userProfile) {
                  const updatedProfile = { ...userProfile, totalScore: userProfile.totalScore + points };
                  setUserProfile(updatedProfile);
                  syncProgress(nextState.level, updatedProfile.totalScore);
                }
                setCompletedLevels(prev => [...new Set([...prev, nextState.level])]);
                return { ...nextState, gameState: 'won' };
              } else {
                return { ...nextState, gameState: 'lost' };
              }
            } else {
              // Illegitimate 8-Ball pot (Foul or balls remaining) -> Loss for the side that potted it
              return { ...nextState, gameState: s.currentTurn === 'player' ? 'lost' : 'won' };
            }
          }

          // 3. Assign Suits (Open Table)
          if (!playerType && newlyPotted.length > 0 && !isFoul) {
            const firstValid = newlyPotted.find(b => b.type === 'solid' || b.type === 'stripe');
            if (firstValid) {
              if (s.currentTurn === 'player') {
                playerType = firstValid.type as 'solid' | 'stripe';
                opponentType = playerType === 'solid' ? 'stripe' : 'solid';
              } else {
                opponentType = firstValid.type as 'solid' | 'stripe';
                playerType = opponentType === 'solid' ? 'stripe' : 'solid';
              }
            }
          }

          // 4. Turn Switching Logic
          if (!isFoul) {
            const targetType = s.currentTurn === 'player' ? playerType : opponentType;
            const pottedOwn = newlyPotted.some(b => b.type === targetType);

            // If they potted their own ball (or any ball on an open table), they keep the turn
            if (!pottedOwn && newlyPotted.length === 0) {
              // Didn't pot anything
              nextTurn = s.currentTurn === 'player' ? 'opponent' : 'player';
            } else if (newlyPotted.some(b => b.type !== targetType && targetType !== null)) {
              // Potted opponent's ball -> Foul/Turn switch
              nextTurn = s.currentTurn === 'player' ? 'opponent' : 'player';
            }
          } else {
            // Foul immediately switches turn
            nextTurn = s.currentTurn === 'player' ? 'opponent' : 'player';
          }

          nextState.currentTurn = nextTurn;
          nextState.playerType = playerType;
          nextState.opponentType = opponentType;

          if (nextTurn === 'opponent') {
            return { ...nextState, gameState: 'opponent_thinking' };
          }
        }

        if (nextState.shots >= nextState.maxShots && nextState.gameState === 'aiming' && !allTargetBallsPotted) {
          return { ...nextState, gameState: 'lost' };
        }

        return nextState;
      });
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [state?.gameState, state?.isPaused]);

  useEffect(() => {
    if (state?.gameState === 'opponent_thinking' && !state.isPaused) {
      const timer = setTimeout(() => {
        const shot = calculateOpponentShot(state);
        if (shot) {
          handleStrike(shot.power, shot.angle);
        } else {
          // Fallback: switch back or skip
          setState(s => s ? { ...s, gameState: 'aiming', currentTurn: 'player' } : null);
        }
      }, 1500 + Math.random() * 1000); // 1.5 - 2.5s "thinking" time
      return () => clearTimeout(timer);
    }
  }, [state?.gameState, state?.isPaused]);

  useEffect(() => {
    if (!state || state.isPaused || state.gameState === 'moving' || state.gameState === 'won' || state.gameState === 'lost' || isLevelChanging) return;
    const interval = setInterval(() => {
      setState(s => s ? { ...s, timer: s.timer + 1, timeLeft: Math.max(0, s.timeLeft - 1) } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.isPaused, state?.gameState, isLevelChanging]);

  const handleStrike = (power: number, angle: number) => {
    if (!state || (state.gameState !== 'aiming' && state.gameState !== 'opponent_thinking') || state.isPaused) return;

    if (userProfile?.soundEnabled) audioService.playClick(); // Replace with strike sound later

    setState(s => {
      if (!s) return null;
      const cueBall = { ...s.cueBall };
      cueBall.vx = -Math.cos(angle) * power;
      cueBall.vy = -Math.sin(angle) * power;

      return {
        ...s,
        cueBall,
        gameState: 'moving',
        shots: s.shots + 1,
        turnStartPottedCount: s.pottedBalls.length,
        useSuperAim: false
      };
    });
  };

  const syncProgress = async (levelId: number, totalScore: number) => {
    const user = auth.currentUser;
    if (user) {
      const profileRef = doc(db, 'profiles', user.uid);
      await updateDoc(profileRef, {
        total_score: totalScore,
        completed_levels: [...completedLevels, levelId],
        completed_level_count: (completedLevels.length + 1)
      });
    }
  };

  const syncCredits = async (newCredits: number) => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'profiles', user.uid), { credits: newCredits });
    }
  };

  const recordPurchase = async (pack: CreditPack) => {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'purchases'), {
        user_id: user.uid,
        credits: pack.qty,
        amount: pack.price,
        currency: '$',
        status: 'completed',
        created_at: serverTimestamp()
      });
    }
  };

  const handleAction = (action: string) => {
    if (!state || isLevelChanging) return;
    if (userProfile?.soundEnabled) audioService.playClick();
    if (action === 'pause') setState({ ...state, isPaused: !state.isPaused });
    else if (action === 'reset') transitionToLevel(state.level);
    else if (action === 'reveal') {
      if (!userProfile || userProfile.credits < 10) return alert("Não tens créditos suficientes!");

      // Better Hint: Super Aim for the current turn
      setState(s => s ? { ...s, useSuperAim: true } : null);

      setUserProfile({ ...userProfile, credits: userProfile.credits - 10 });
      if (userProfile.soundEnabled) audioService.playClick();
    }
  };

  const renderContent = () => {
    if (view === 'landing') return <LandingPage appName={settings.appName} onAdmin={() => setView('admin')} onStart={(intent) => {
      if (intent) {
        // If they clicked buy, we want to show the purchase modal after login.
        // But first we need to get them to Auth. User might be logged out.
        // Simple way: pass intent to auth page or store in state?
        // Better: Set a pending intent state.
        setPendingPurchase(intent);
        setView('auth');
      } else {
        setView('auth');
      }
    }} onNavigate={(v) => v === 'ranking' ? setShowLeaderboard(true) : setView(v)} />;
    if (view === 'auth') return <AuthPage onLogin={handleLogin} onBack={() => setView('landing')} />;
    if (view === 'privacy' || view === 'terms' || view === 'support') return <PolicyPages type={view as any} onBack={() => setView('landing')} />;
    if (view === 'reviews') return <ReviewsPage onBack={() => setView('landing')} />;
    if (view === 'profile' && userProfile) return <ProfilePage userProfile={userProfile} onSave={(p) => { setUserProfile(p); setView('game'); }} onBack={() => setView('game')} />;
    if (view === 'payment' && selectedPack) {
      return (
        <PaymentPage
          pack={selectedPack}
          settings={settings}
          onComplete={(method) => {
            if (userProfile && selectedPack) {
              const newCredits = userProfile.credits + selectedPack.qty;
              setUserProfile({ ...userProfile, credits: newCredits });
              syncCredits(newCredits);
              recordPurchase(selectedPack);
              console.log(`Payment via ${method} completed`);
            }
            setView('game');
            setSelectedPack(null);
          }}
          onBack={() => {
            setView('game');
            setSelectedPack(null);
          }}
        />
      );
    }
    if (view === 'referral' && userProfile) return <ReferralPage user={userProfile} onBack={() => setView('game')} />;
    if (view === 'admin') {
      return (
        <AdminDashboard
          users={adminUsers}
          settings={settings}
          onUpdateSettings={async (s) => {
            setSettings(s);
            try {
              await setDoc(doc(db, 'config', 'global'), s);
            } catch (err) {
              console.error("Error saving terminal settings:", err);
            }
          }}
          onUpdateUser={async (id, updates) => {
            const profileRef = doc(db, 'profiles', id);
            try {
              await updateDoc(profileRef, {
                credits: updates.credits,
                total_score: (updates as any).totalScore,
              });
              setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
            } catch (err) {
              console.error("Error updating user:", err);
            }
          }}
          onBack={() => setView(state ? 'game' : 'landing')}
        />
      );
    }

    if (!state) return null;

    const isGameOver = state.gameState === 'lost' || state.timeLeft <= 0;
    const isWin = state.gameState === 'won';

    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (adminTimerRef.current) clearTimeout(adminTimerRef.current);

                  const newClicks = adminClicks + 1;
                  setAdminClicks(newClicks);

                  if (newClicks >= 6) {
                    setView('admin');
                    setAdminClicks(0);
                  } else {
                    setView('landing');
                    adminTimerRef.current = setTimeout(() => {
                      setAdminClicks(0);
                    }, 2000);
                  }
                }}
                className="bg-white p-0.5 rounded-xl text-white shadow-lg overflow-hidden flex items-center justify-center border border-slate-100"
                title="Logo"
              >
                <img src="/logo.png" alt="Pool8Live Logo" className="w-8 h-8 object-contain" />
              </button>
              <div onClick={() => setShowPurchaseModal(true)} className="flex flex-col text-xs font-black text-indigo-600 cursor-pointer hover:opacity-80 transition-opacity">
                <span className="text-slate-400">CREDITS</span>
                <div className="flex items-center gap-1"><Wallet size={12} /> {userProfile?.credits} <Plus size={10} className="bg-indigo-100 rounded-full p-0.5" /></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-slate-100 px-3 py-1.5 rounded-full font-mono font-black text-indigo-600 text-sm">
                <Timer size={14} className="inline mr-1" /> {Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <button onClick={() => setShowChat(true)} className="p-2 bg-slate-50 rounded-full relative">
                <MessageCircle size={18} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] px-1 rounded-full">{unreadCount}</span>}
              </button>
              <button onClick={() => setShowLeaderboard(true)} className="p-2 bg-slate-50 rounded-full"><Trophy size={18} /></button>
              <button onClick={() => setView('referral')} className="p-2 bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors" title="Convida Amigos">
                <Gift size={18} />
              </button>
              <button onClick={() => setView('profile')} className="p-2 bg-slate-50 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                <div className="w-[18px] h-[18px] flex items-center justify-center text-xs overflow-hidden rounded-full">
                  {userProfile?.avatar?.startsWith('http') ? <img src={userProfile.avatar} alt="P" className="w-full h-full object-cover" /> : (userProfile?.avatar || <Users size={18} />)}
                </div>
              </button>
              <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-50 rounded-full"><Settings size={18} /></button>
              <button onClick={() => setShowLevelSelector(true)} className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-black text-xs">LV. {state.level}</button>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto mt-6 px-4 flex flex-col items-center gap-6">
          <div className="flex w-full gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-1 text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">Score</span>
              <div className="text-2xl font-black">{userProfile?.totalScore.toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex-1 text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase">Shots Used</span>
              <div className="text-2xl font-black mt-1">
                {state.shots} / {state.maxShots}
              </div>
            </div>
          </div>

          <div className={`relative transition-all duration-500 ${isLevelChanging ? 'opacity-0 scale-95' : 'opacity-100'}`}>
            {state.isPaused && !isGameOver && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center">
                <Play size={64} className="text-indigo-600 cursor-pointer" onClick={() => handleAction('pause')} />
                <h3 className="text-xl font-black">PAUSED</h3>
              </div>
            )}
            {isGameOver && (
              <div className="absolute inset-0 z-30 bg-rose-600/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-white p-10 text-center">
                <AlertCircle size={64} className="mb-4" />
                <h2 className="text-3xl font-black">GAME OVER</h2>
                <button onClick={() => transitionToLevel(state.level)} className="mt-6 px-8 py-3 bg-white text-rose-600 rounded-xl font-black">RETRY</button>
              </div>
            )}
            {isWin && (
              <div className="absolute inset-0 z-30 bg-emerald-600/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-white p-10 text-center">
                <Trophy size={64} className="mb-4 text-amber-400" />
                <h3 className="text-3xl font-black">TOURNAMENT WON! +{lastGainedPoints}</h3>
                <button onClick={() => transitionToLevel(state.level + 1 > TOTAL_LEVELS ? 1 : state.level + 1)} className="mt-6 px-8 py-3 bg-white text-emerald-600 rounded-xl font-black">NEXT MATCH</button>
              </div>
            )}
            <PoolTable
              state={state}
              onStrike={handleStrike}
              onAim={(angle) => setState(s => s ? { ...s, cueTarget: { x: Math.cos(angle), y: Math.sin(angle) } } : null)}
            />
          </div>

          <Controls onStrike={() => { }} onAction={handleAction} canUndo={false} />
        </main>
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      {/* Global Modals */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-80 space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h2 className="font-black uppercase tracking-tight">Settings</h2>
              <X className="cursor-pointer text-slate-400" onClick={() => setShowSettings(false)} />
            </div>
            <button onClick={toggleMusic} className="w-full py-3 bg-slate-50 rounded-xl font-bold flex justify-between px-4">
              <span>Music</span>
              <span className={userProfile?.musicEnabled ? 'text-indigo-600' : 'text-slate-400'}>{userProfile?.musicEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {userProfile?.musicEnabled && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Select Track</label>
                <div className="bg-slate-50 rounded-xl overflow-hidden">
                  {audioService.tracks.map((track, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (userProfile) {
                          const updated = { ...userProfile, selectedTrackIndex: i };
                          setUserProfile(updated);
                          audioService.setTrack(i);

                          // Sync with Supabase
                          const user = auth.currentUser;
                          if (user) {
                            updateDoc(doc(db, 'profiles', user.uid), { selected_track_index: i });
                          }
                        }
                      }}
                      className={`w-full py-3 px-4 text-sm font-bold flex items-center justify-between transition-colors ${userProfile?.selectedTrackIndex === i ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      <span className="flex items-center gap-2"><Music2 size={14} /> {track.name}</span>
                      {userProfile?.selectedTrackIndex === i && <CheckCircle size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={toggleSound} className="w-full py-3 bg-slate-50 rounded-xl font-bold flex justify-between px-4">
              <span>SFX</span>
              <span className={userProfile?.soundEnabled ? 'text-emerald-600' : 'text-slate-400'}>{userProfile?.soundEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      )}

      {showLevelSelector && state && <LevelSelector currentLevel={state.level} completedLevels={completedLevels} onClose={() => setShowLevelSelector(false)} onSelect={transitionToLevel} />}
      {showLeaderboard && <Leaderboard entries={leaderboardData} onClose={() => setShowLeaderboard(false)} />}

      {showChat && (
        <ChatGroup
          messages={messages}
          userName={userProfile?.name || 'Guest'}
          onSendMessage={async (t) => {
            const m = { sender: userProfile?.name || 'Guest', text: t };

            // Push to Supabase
            const user = auth.currentUser;
            await addDoc(collection(db, 'chat_messages'), {
              user_id: user?.uid || null,
              sender: m.sender,
              text: m.text,
              created_at: serverTimestamp()
            });
          }}
          onClose={() => setShowChat(false)}
        />
      )}

      {showPurchaseModal && (
        <ShopifyStore
          onClose={() => setShowPurchaseModal(false)}
          onPurchaseSuccess={(credits) => {
            if (userProfile) {
              const newCredits = userProfile.credits + credits;
              setUserProfile({ ...userProfile, credits: newCredits });
              syncCredits(newCredits);
              // Add to purchase history mock
              const mockPack: CreditPack = {
                id: 'shopify-item',
                price: 0,
                qty: credits,
                amount: `$${credits / 50}`,
                pack: 'Shopify Pack',
                bonus: 'Premium Item'
              };
              recordPurchase(mockPack);
            }
            setShowPurchaseModal(false);
          }}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
};

export default App;
