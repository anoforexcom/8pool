"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Timer, Heart, Trophy, ChevronRight, LayoutGrid, Pause, Play,
  RefreshCw, Hourglass, AlertCircle, Users, Star, Wallet, Plus, RotateCcw,
  Volume2, VolumeX, Music, Music2, Settings, X, MessageCircle, CheckCircle, Gift
} from 'lucide-react';
import SudokuGrid from '../components/SudokuGrid';
import Controls from '../components/Controls';
import LevelSelector from '../components/LevelSelector';
import Leaderboard from '../components/Leaderboard';
import LandingPage from '../components/LandingPage';
import AuthPage from '../components/AuthPage';
import PolicyPages from '../components/PolicyPages';
import ChatGroup from '../components/ChatGroup';
import ReviewsPage from '../components/ReviewsPage';
import ProfilePage from '../components/ProfilePage';
import PurchaseModal from '../components/PurchaseModal';
import PaymentPage from '../components/PaymentPage';
import AdminDashboard from '../components/AdminDashboard';
import ReferralPage from '../components/ReferralPage';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import KidsMode from '../components/KidsMode';
import { SudokuState, UserProfile, LeaderboardEntry, View, ChatMessage, Purchase, CreditPack, GlobalSettings } from '../types';
import { LEVELS, TOTAL_LEVELS, CREDIT_PACKS } from '../constants';
import { generatePuzzle } from '../services/sudokuLogic';
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
  const [state, setState] = useState<SudokuState | null>(null);
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
    const { initial, solution } = generatePuzzle(levelData.id, levelData.clues);
    let timeLimit = 20 * 60;
    if (levelData.difficulty === 'Medium') timeLimit = 15 * 60;
    else if (levelData.difficulty === 'Hard') timeLimit = 12 * 60;
    else if (levelData.difficulty === 'Expert') timeLimit = 10 * 60;

    setState({
      board: initial.map(row => [...row]),
      initialBoard: initial.map(row => [...row]),
      solution,
      notes: Array(9).fill(0).map(() => Array(9).fill(0).map(() => new Set<number>())),
      selectedCell: null,
      mistakes: 0,
      maxMistakes: 3,
      isComplete: false,
      level: levelId,
      timer: 0,
      timeLeft: timeLimit,
      isPaused: false,
      history: [initial.map(row => [...row])]
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
    if (!state || state.isPaused || state.isComplete || state.timeLeft <= 0 || isLevelChanging) return;
    const interval = setInterval(() => {
      setState(s => s ? { ...s, timer: s.timer + 1, timeLeft: Math.max(0, s.timeLeft - 1) } : null);
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.isPaused, state?.isComplete, state?.timeLeft, isLevelChanging]);

  const updateCell = (num: number) => {
    if (!state || !state.selectedCell || state.isComplete || state.isPaused || state.timeLeft <= 0 || state.mistakes >= state.maxMistakes) return;
    const [r, c] = state.selectedCell;
    if (state.initialBoard[r][c] !== null) return;

    if (notesMode) {
      setState(s => {
        if (!s) return null;
        const newNotes = s.notes.map((row, ri) => row.map((cellSet, ci) => {
          if (ri === r && ci === c) {
            const nextSet = new Set(cellSet);
            if (nextSet.has(num)) nextSet.delete(num);
            else nextSet.add(num);
            return nextSet;
          }
          return cellSet;
        }));
        return { ...s, notes: newNotes };
      });
      return;
    }

    setState(s => {
      if (!s) return null;
      if (s.board[r][c] === num) return s;
      const isCorrect = s.solution[r][c] === num;
      let newMistakes = s.mistakes;
      if (!isCorrect) {
        newMistakes += 1;
        if (userProfile?.soundEnabled) audioService.playIncorrect();
      } else {
        if (userProfile?.soundEnabled) audioService.playCorrect();
      }
      const newBoard = s.board.map((row, ri) => row.map((val, ci) => ri === r && ci === c ? num : val));
      const isComplete = newBoard.every((row, ri) => row.every((val, ci) => val === s.solution[ri][ci]));
      if (isComplete) {
        const points = settings.pointsPerLevel + (s.timeLeft * settings.timeBonusMultiplier);
        setLastGainedPoints(points);
        if (userProfile) {
          const updatedProfile = { ...userProfile, totalScore: userProfile.totalScore + points };
          setUserProfile(updatedProfile);

          // Sync with Supabase
          syncProgress(s.level, updatedProfile.totalScore);
        }
        setCompletedLevels(prev => [...new Set([...prev, s.level])]);
      }
      return { ...s, board: newBoard, mistakes: newMistakes, isComplete, history: [...(s.history || []), newBoard] };
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
    if (action === 'notes') setNotesMode(!notesMode);
    else if (action === 'pause') setState({ ...state, isPaused: !state.isPaused });
    else if (action === 'undo' && state.history.length > 1) {
      const h = [...state.history]; h.pop();
      setState({ ...state, board: h[h.length - 1], history: h });
    } else if (action === 'reset') transitionToLevel(state.level);
    else if (action === 'erase') {
      const [r, c] = state.selectedCell || [-1, -1];
      if (r !== -1 && state.initialBoard[r][c] === null) {
        const nb = state.board.map((row, ri) => row.map((v, ci) => ri === r && ci === c ? null : v));
        setState({ ...state, board: nb, history: [...state.history, nb] });
      }
    } else if (action === 'reveal') {
      if (!userProfile || userProfile.credits < 10) return alert("No credits!");
      const [r, c] = state.selectedCell || [-1, -1];
      if (r !== -1 && state.initialBoard[r][c] === null) {
        setUserProfile({ ...userProfile, credits: userProfile.credits - 10 });
        updateCell(state.solution[r][c]);
      }
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
    if (view === 'kids') return <KidsMode onBack={() => setView('landing')} />;
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

    const isGameOver = state.mistakes >= state.maxMistakes || state.timeLeft <= 0;

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
                <img src="/favicon.svg" alt="Pool8Live Logo" className="w-8 h-8 object-contain" />
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
              <span className="text-[9px] font-black text-slate-400 uppercase">Mistakes</span>
              <div className="flex justify-center gap-1 mt-1">
                {[1, 2, 3].map(i => <Heart key={i} size={16} fill={i <= state.mistakes ? 'none' : 'currentColor'} className={i <= state.mistakes ? 'text-slate-200' : 'text-rose-500'} />)}
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
            {state.isComplete && (
              <div className="absolute inset-0 z-30 bg-emerald-600/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-white p-10 text-center">
                <Trophy size={64} className="mb-4 text-amber-400" />
                <h3 className="text-3xl font-black">WINNER! +{lastGainedPoints}</h3>
                <button onClick={() => transitionToLevel(state.level + 1 > TOTAL_LEVELS ? 1 : state.level + 1)} className="mt-6 px-8 py-3 bg-white text-emerald-600 rounded-xl font-black">NEXT LEVEL</button>
              </div>
            )}
            <SudokuGrid state={state} onCellClick={(r, c) => setState({ ...state!, selectedCell: [r, c] })} />
          </div>

          <Controls onNumberClick={updateCell} onAction={handleAction} notesMode={notesMode} canUndo={state.history.length > 1} />
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
        <PurchaseModal
          onClose={() => setShowPurchaseModal(false)}
          onSelectPack={(pack) => {
            setSelectedPack(pack);
            setShowPurchaseModal(false);
            setView('payment');
          }}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
};

export default App;
