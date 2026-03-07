// Referral reward tiers
export const REWARD_TIERS = {
    FRIEND_SIGNUP: {
        referrer: 50,
        referred: 100,
        action: 'signup'
    },
    FRIEND_FIRST_GAME: {
        referrer: 50,
        referred: 0,
        action: 'complete_level_1'
    },
    FRIEND_PURCHASE: {
        referrer: 200,
        referred: 50,
        action: 'first_purchase'
    },
    FRIEND_REFERS: {
        referrer: 25,
        referred: 0,
        action: 'friend_refers_someone'
    }
};

// Referral milestones
export const REFERRAL_MILESTONES = [
    { friends: 5, bonus: 250, badge: "Influencer Bronze" },
    { friends: 10, bonus: 600, badge: "Influencer Silver" },
    { friends: 25, bonus: 1500, badge: "Influencer Gold" },
    { friends: 50, bonus: 3500, badge: "Influencer Platinum" },
    { friends: 100, bonus: 10000, badge: "Pool Regular" }
];

// Generate unique referral code
export function generateReferralCode(userId: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';

    // Simple hash from userId
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = ((hash << 5) - hash) + userId.charCodeAt(i);
        hash = hash & hash;
    }

    // Generate 6-character code
    for (let i = 0; i < 6; i++) {
        const index = Math.abs(hash + i) % chars.length;
        code += chars[index];
    }

    return code;
}

// Get referral link
export function getReferralLink(code: string): string {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/r/${code}`;
    }
    return `https://pool8.live/r/${code}`;
}

// Share messages
export const SHARE_MESSAGES = {
    whatsapp: (link: string) =>
        `🎮 Descobri o pool8.live - O melhor jogo de Pool 8 real!\n\nUsa o meu link e ganhamos os dois créditos grátis:\n${link}\n\nVamos ver quem ganha a partida! 🏆`,

    facebook: (link: string) =>
        `Já jogaste no pool8.live? 🎱\n\nRegista-te e ganha créditos para torneios com o meu link: ${link}`,

    twitter: (link: string) =>
        `Desafio Pool 8! 🎯\n\nJoga grátis em ${link} e vamos competir no leaderboard!\n\n#Pool8 #Billiards`,

    email: (link: string) => ({
        subject: 'Vem jogar Pool 8 comigo!',
        body: `Olá!\n\nDescobri um site incrível de Pool 8 com 150 níveis progressivos.\n\nRegista-te com o meu link e ganhamos os dois créditos grátis:\n${link}\n\nVamos ver quem ganha a partida! 🏆\n\nAbraço!`
    })
};
