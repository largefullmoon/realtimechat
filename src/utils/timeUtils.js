export const formatRelativeTime = (timestamp) => {
    if(timestamp === null) {
        return '';
    }
    // Use local times directly
    const now = new Date();
    const past = new Date(timestamp);
    
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSeconds < 60) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffMonths < 1) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    }
};

// Utility to convert local time to UTC ISO string
export const convertToUTCISOString = (localTimestamp) => {
    const date = new Date(localTimestamp);
    return date.toISOString();
};
