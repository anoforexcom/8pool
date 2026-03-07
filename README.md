# 🎱 pool8.live

> Premium pool8.live gaming platform with 150 progressive levels, monetization system, and professional admin dashboard.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://pool8.live)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🎯 Player Experience
- **150 Unique Levels** across 5 difficulty tiers (Beginner → Expert)
- **Smart Hint System** with credit-based economy
- **Real-time Scoring** with time bonuses and mistake penalties
- **Global Leaderboards** with seasonal rankings
- **Profile Management** with avatar support and purchase history
- **Music Toggle** for personalized gameplay
- **100+ Customer Reviews** for social proof

### 💰 Monetization
- **4 Credit Packs** ranging from $2.99 to $29.99
- **Multi-Payment Support**: Visa, Mastercard, PayPal, MB Way, Multibanco
- **Secure Checkout Flow** with professional payment UI
- **Transaction History** tracking for all users

### 📊 Admin Dashboard
- **Financial Analytics** with dynamic charts (revenue trends, sales volume)
- **User Management** with search, filtering, and credit management
- **Transaction Logs** with CSV export
- **Rankings Moderation** with score reset capabilities
- **Global Settings** for branding (app name, primary color)
- **Game Logic Configuration** (points, multipliers, penalties)
- **Date Filtering** (Today, 7 days, 30 days, All Time)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pool8-live.git

# Navigate to project directory
cd pool8-live

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15+** | Fullstack framework (SSG/SSR/CSR) |
| **React 19** | UI framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Recharts** | Analytics charts |
| **Lucide React** | Icon library |
| **next-pwa** | PWA functionality |
| **LocalStorage** | Data persistence |

---

## 📁 Project Structure

```
pool8-live/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout & meta tags
│   ├── page.tsx         # Home page (Server/SSG)
│   ├── AppClient.tsx     # Main Client-side logic
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── LandingPage.tsx
│   ├── ...
├── services/           # Business logic
├── types.ts            # TypeScript definitions
├── constants.ts        # Game configuration
└── package.json        # Dependencies
```

---

## 🎮 How to Play

1. **Start Game**: Click "Play Now" on the landing page
2. **Select Level**: Choose from 150 progressive difficulty levels
3. **Solve Puzzle**: Fill the grid following pool8.live rules
4. **Use Hints**: Spend credits for helpful hints (costs 10 credits)
5. **Earn Points**: Complete levels to earn points and climb the leaderboard
6. **Buy Credits**: Purchase credit packs to unlock more hints

---

## 🔧 Configuration

### Branding
Access the Admin Dashboard (double-click the logo) to customize:
- App name
- Primary color
- Game rules (points, penalties, multipliers)

### Environment Variables
Create a `.env` file for custom configuration:

```env
VITE_APP_NAME=pool8.live
VITE_PRIMARY_COLOR=#4f46e5
```

---

## 🎨 Customization

### Change Pricing
Edit `constants.ts`:
```typescript
export const CREDIT_PACKS = [
  { id: 'starter', pack: "STARTER PACK", qty: 100, price: 2.99, amount: "$2.99" },
  // Add or modify packs
];
```

### Adjust Game Rules
Via Admin Dashboard or directly in `App.tsx`:
```typescript
const DEFAULT_SETTINGS: GlobalSettings = {
  pointsPerLevel: 100,
  timeBonusMultiplier: 2.0,
  mistakePenalty: 50
};
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy 'dist' folder
```

---

## 🔐 Admin Access

**How to Access**: Double-click the logo on the landing page

**Features**:
- View analytics and charts
- Manage users and credits
- Export transaction data
- Configure game settings
- Moderate rankings

---

## 📊 Analytics

The admin dashboard provides:
- **Revenue Tracking**: Daily/weekly/monthly aggregation
- **User Metrics**: Total users, active sessions
- **Sales Reports**: Transaction history with CSV export
- **Performance Data**: Average ticket, conversion rates
- **Dynamic Charts**: Real dates, responsive to filters

---

## 🤝 Contributing

This is a commercial project. For inquiries about licensing or customization, please contact the owner.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎯 Roadmap

- [ ] Backend integration (user authentication)
- [ ] Real payment gateway (Stripe/PayPal API)
- [ ] Mobile apps (React Native)
- [ ] Multiplayer mode
- [ ] Additional puzzle types (Kakuro, KenKen)
- [ ] AI-powered difficulty adjustment

---

## 💡 Support

For questions or issues:
- **Email**: support@pool8.live
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/pool8-live/issues)

---

## 🌟 Acknowledgments

- pool8.live puzzle generation algorithm
- Recharts for beautiful analytics
- Lucide React for crisp icons
- Tailwind CSS for rapid styling

---

**Built with ❤️ for puzzle enthusiasts worldwide**

[Live Demo](https://pool8.live) • [Report Bug](https://github.com/yourusername/pool8-live/issues) • [Request Feature](https://github.com/yourusername/pool8-live/issues)
