
import React from 'react';

export const VisaIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M15.222 15.333l1.192-7.389h2.383l-1.192 7.389h-2.383zm7.84-7.389l-1.789 7.39h-2.261l3.053-7.39h.997zm-6.048 7.39l.608-3.764.99 3.764h1.889l-1.284-4.88c-.287-1.123-1.01-1.636-2.03-1.636h-1.621l1.791 7.39h1.157c.365 0 .61-.173.74-.53zM9.544 7.944c-.792 0-1.464.456-1.767 1.133L4.172 15.333h2.327l.464-1.28h2.843l.268 1.28h2.091l-1.621-7.389h-1zM7.64 12.333l1.192-3.292 1.192 3.292H7.64zm-5.418-4.389H0l.024.162c1.782.455 2.962 1.554 3.456 2.89L2.835 15.333h2.464l3.696-9.143H6.602l-.24 1.157c-.244-.455-1.025-1.157-2.181-1.157-.95 0-1.959.456-1.959 1.753" fill="#1A1F71" />
    </svg>
);

export const MastercardIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="12" r="7" fill="#EB001B" />
        <circle cx="16" cy="12" r="7" fill="#F79E1B" />
        <path d="M12 12a6.95 6.95 0 0 1 2.5-5.38 6.95 6.95 0 0 0-5 0A6.95 6.95 0 0 0 7 12a6.95 6.95 0 0 0 2.5 5.38 6.95 6.95 0 0 1 5 0A6.95 6.95 0 0 1 12 12z" fill="#FF5F00" />
    </svg>
);

export const MBWayIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#ED0677" />
        <path d="M25 65V35l10 20 10-20v30H35V45l-10 20zm25 0V35l10 10 10-10v30H60V45l-10 20z" fill="white" />
        <circle cx="80" cy="50" r="10" stroke="white" strokeWidth="5" />
    </svg>
);

export const PayPalIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.1 7.1c-.5-3.5-3-4.1-6-4.1H6.5c-.3 0-.6.2-.6.5l-2.4 15.3c0 .3.2.5.5.5h3.6l.8-5h3c3.5 0 6.3-1.4 7.2-5.5.1-.3.1-.6.1-.9-.1-.2-.4-.8-.6-.8z" fill="#003087" />
        <path d="M17.6 8.5c-.7 3.5-3 3.5-6.5 3.5H8.3l-.8 5c0 .3.2.5.5.5h3.1c3.1 0 5.6-1.2 6.4-4.9.4-2 .2-3.4-.9-4.1z" fill="#009CDE" />
        <path d="M11.6 8.5c0 0-2.3 0-3.3 0-.3 0-.5.2-.6.5l-.8 5h3c3.5 0 6.3-1.4 7.2-5.5.1-.3.1-.6.1-.9-.1-.2-.4-.8-.6-.8" fill="#012169" />
    </svg>
);

export const MultibancoIcon: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#0057A0" />
        <rect x="4" y="6" width="16" height="3" rx="1" fill="white" />
        <rect x="4" y="11" width="16" height="3" rx="1" fill="white" />
        <rect x="4" y="16" width="16" height="2" rx="1" fill="white" />
        <path d="M5 6v12M19 6v12" stroke="#0057A0" strokeWidth="1" />
    </svg>
);
