// Utility to adjust timestamp based on timezone difference
export const adjustTimestamp = (timestamp, hourDifference = 0) => {
    const date = new Date(timestamp);
    // Adjust the time by adding or subtracting hours
    date.setHours(date.getHours() + hourDifference);
    return date.toISOString();
};

// Function to get the timezone offset
export const getTimezoneOffset = () => {
    // Get the timezone offset in hours
    // getTimezoneOffset() returns minutes, with opposite sign
    const offsetMinutes = new Date().getTimezoneOffset();
    return -offsetMinutes / 60;
};

export const formatRelativeTime = (timestamp, serverTimezoneOffset = null) => {
    if(timestamp === null) {
        return '';
    }
    
    // If no server timezone offset is provided, calculate it
    const localTimezoneOffset = getTimezoneOffset();
    const timezoneOffset = serverTimezoneOffset ?? 0; // Default to 0 if no server offset

    // Calculate the total offset adjustment
    // Subtract local timezone offset and add server timezone offset
    const totalOffset = timezoneOffset - localTimezoneOffset;
    
    // Adjust the timestamp based on the total offset
    const adjustedTimestamp = adjustTimestamp(timestamp, -totalOffset);
    
    // Ensure the timestamp is parsed as a Date object
    const past = new Date(adjustedTimestamp);
    const now = new Date();

    // Convert both to UTC to remove timezone differences
    const nowUtc = Date.UTC(
        now.getUTCFullYear(), 
        now.getUTCMonth(), 
        now.getUTCDate(), 
        now.getUTCHours(), 
        now.getUTCMinutes(), 
        now.getUTCSeconds()
    );
    
    const pastUtc = Date.UTC(
        past.getUTCFullYear(), 
        past.getUTCMonth(), 
        past.getUTCDate(), 
        past.getUTCHours(), 
        past.getUTCMinutes(), 
        past.getUTCSeconds()
    );

    const diffMs = nowUtc - pastUtc;
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
