
import { Difficulty, LevelData } from './types';

export const TOTAL_LEVELS = 150;

const baseReviews = [
  { name: "Sarah Jenkins", role: "Pool Enthusiast", text: "The best 8 Ball Pool app I've ever played. The physics are perfectly balanced and the UI is incredibly polished.", rating: 5 },
  { name: "Mark Thompson", role: "Daily Player", text: "I love the credit system. It adds a competitive layer to the tournaments that you don't find in other apps. Highly recommended!", rating: 5 },
  { name: "Elena Rodriguez", role: "Billiard Master", text: "The sound effects and background music are so immersive. It's my favorite way to compete after work.", rating: 5 },
  { name: "David Kim", role: "Pro Player", text: "Finally, a Pool app that challenges me. The 'Expert' tournaments are truly difficult and rewarding to win.", rating: 4 },
  { name: "Jessica Low", role: "Casual Gamer", text: "Clean design, no intrusive ads, and the transition between matches is seamless. 10/10 experience.", rating: 5 }
];

const names = ["James", "Maria", "Robert", "Ana", "John", "Lucia", "Michael", "Sofia", "William", "Beatriz", "David", "Guilherme", "Richard", "Emanuel", "Joseph", "Ricardo", "Thomas", "Tiago", "Charles", "Patricia"];
const roles = ["Pool Master", "Billiard Trainer", "Table Specialist", "Geometry Teacher", "Professional", "Grandmaster", "Casual Player", "Mobile Gamer"];
const templates = [
  "This app is a game changer for my practice. {} is exactly what I needed.",
  "I've tried many Pool apps, but {} stands out with its beautiful interface.",
  "The tables are {} and the tournament progression is spot on.",
  "I highly recommend {} to anyone looking for a sharp competitive workout.",
  "The best part is definitely the {}. It makes it so much more engaging.",
  "Simple, elegant, and challenging. {} is the gold standard for Pool.",
  "I use this every day to keep my skills sharp. Perfect for {}."
];
const keywords = ["the credit system", "the minimalist design", "pool8.live", "challenging tables", "the music", "the trophy system", "all ages"];

export const TESTIMONIALS = [
  ...baseReviews
];

export const CREDIT_PACKS = [
  { id: 'starter', pack: "STARTER PACK", qty: 100, price: 2.99, amount: "$2.99", bonus: "5 Free Matches" },
  { id: 'pro', pack: "PRO PACK", qty: 500, price: 9.99, amount: "$9.99", bonus: "Precision Aim", active: true },
  { id: 'master', pack: "MASTER PACK", qty: 1200, price: 19.99, amount: "$19.99", bonus: "VIP Support" },
];

export const LEVELS: LevelData[] = Array.from({ length: TOTAL_LEVELS }, (_, i) => {
  const id = i + 1;
  let difficulty: Difficulty = 'Easy';
  let clues = 45;

  if (id > 120) {
    difficulty = 'Expert';
    clues = 24;
  } else if (id > 70) {
    difficulty = 'Hard';
    clues = 30;
  } else if (id > 30) {
    difficulty = 'Medium';
    clues = 36;
  }

  return { id, difficulty, clues };
});
