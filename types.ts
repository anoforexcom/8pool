
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type View = 'landing' | 'auth' | 'game' | 'privacy' | 'terms' | 'support' | 'reviews' | 'profile' | 'payment' | 'admin' | 'referral' | 'kids';
export type KidsGridSize = '4x4' | '6x6';
export type KidsColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';

export interface GlobalSettings {
  appName: string;
  primaryColor: string;
  pointsPerLevel: number;
  timeBonusMultiplier: number;
  mistakePenalty: number;
  stripePublicKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  paypalClientId?: string;
  paymentMode: 'simulated' | 'real';
}

export interface CreditPack {
  id: string;
  pack: string;
  qty: number;
  amount: string;
  price: number;
  bonus: string;
  active?: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalUsers: number;
  totalPacksSold: number;
  averageTicket: number;
}

export interface UserProfile {
  name: string;
  email: string;
  totalScore: number;
  completedLevelCount: number;
  credits: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  selectedTrackIndex?: number;
  avatar?: string;
  purchaseHistory: Purchase[];
  referralCode?: string;
  referredBy?: string;
  referralData?: ReferralData;
  referralMilestones?: string[];
}

export interface ReferralData {
  code: string;
  userId: string;
  createdAt: number;
  totalReferred: number;
  totalEarned: number;
  referredUsers: ReferredUser[];
}

export interface ReferredUser {
  id: string;
  name: string;
  status: 'pending' | 'signed_up' | 'played' | 'purchased';
  signupDate: number;
  creditsEarned: number;
  hasReferred: boolean;
}

export interface Purchase {
  id: string;
  date: number;
  credits: number;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isMe?: boolean;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  levels: number;
  isCurrentUser?: boolean;
}

export interface PoolBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'cue' | 'solid' | 'stripe' | 'black';
  number: number;
  isPotted: boolean;
  color: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

export interface PoolGameState {
  balls: PoolBall[];
  cueBall: PoolBall;
  cueTarget: { x: number, y: number } | null;
  cuePower: number;
  gameState: 'aiming' | 'moving' | 'potted' | 'won' | 'lost' | 'opponent_thinking';
  currentTurn: 'player' | 'opponent';
  playerType: 'solid' | 'stripe' | null;
  opponentType: 'solid' | 'stripe' | null;
  opponentName: string;
  score: number;
  shots: number;
  maxShots: number;
  pottedBalls: PoolBall[];
  turnStartPottedCount?: number;
  level: number;
  difficulty?: string;
  useSuperAim?: boolean;
  timer: number;
  timeLeft: number;
  isPaused: boolean;
}

export interface PoolLevelData {
  id: number;
  difficulty: Difficulty;
  targetBalls: number;
  maxShots: number;
}

export interface KidsState {
  board: (KidsColor | null)[][];
  initialBoard: (KidsColor | null)[][];
  solution: KidsColor[][];
  selectedCell: [number, number] | null;
  isComplete: boolean;
  gridSize: KidsGridSize;
  level: number;
}
