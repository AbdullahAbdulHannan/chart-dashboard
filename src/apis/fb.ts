import axios from 'axios';

// Facebook Page ID and Access Token
const pageId = '198771776656112';
const accessToken = 'EAASbD3SBqFoBO04ZCM9mBXanMAC5XXY4SZBrTWp3wQAmhQ7XLcLumFMduZCAty6bnIrobGcm2KX9r5kE3mVZAI5esETT0XycHzozBQ9mR1N7uvmvA5dCHwnYlitKM8uryZBlXEKZAKdeNZC6a8qUu7dliKoxA3j0zC7dFcKyjbsO1GyAQXqzGnPUzqXCYtYdiwZD';

// Fb.ts
const uploadMediaToFacebook = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('source', file);
    formData.append('published', 'false');
    formData.append('access_token', accessToken);

    // Determine endpoint based on file type
    const endpoint = file.type.startsWith('video') 
      ? `${pageId}/videos` 
      : `${pageId}/photos`;

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.id;
  } catch (error:any) {
    console.error('Error uploading media:', error.response?.data || error.message);
    throw error;
  }
};

export const postToFacebook = async (message: string, mediaFiles?: File[]) => {
  try {
    let mediaIds: string[] = [];

    if (mediaFiles && mediaFiles.length > 0) {
      // Upload each image and get its media ID
      for (const file of mediaFiles) {
        const mediaId = await uploadMediaToFacebook(file);
        mediaIds.push(mediaId);
      }
    }

    const postData: any = {
      message,
      access_token: accessToken,
    };

    // Attach multiple media
    if (mediaIds.length > 0) {
      postData.attached_media = mediaIds.map(id => ({ media_fbid: id }));
    }

    // Send the final post request
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      postData
    );

    return response.data;
  } catch (error) {
    console.error('Error posting to Facebook:', error.response?.data || error.message);
    throw error;
  }
};



// Function to get Unix timestamps
const getTimeRanges = () => {
  const now = new Date();
  const nowUTC = Math.floor(now.getTime() / 1000); // Convert to UTC timestamp

  const thirtyDaysAgoUTC = nowUTC - 30 * 24 * 60 * 60;
  const yesterdayUTC = nowUTC - 24 * 60 * 60;

  const startOfTodayUTC = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000
  );
  const currentTimeUTC = nowUTC;

  return { now: nowUTC, thirtyDaysAgo: thirtyDaysAgoUTC, yesterday: yesterdayUTC, startOfToday: startOfTodayUTC, currentTime: currentTimeUTC };
};

function getMonthTimestamps(monthsAgo:any) {
  const now = new Date();
  now.setMonth(now.getMonth() - monthsAgo);  // Move back by monthsAgo
  now.setDate(1);  // Set to first day of the month
  now.setHours(0, 0, 0, 0);

  const startOfMonth = Math.floor(now.getTime() / 1000);  // Convert to UNIX timestamp

  now.setMonth(now.getMonth() + 1);  // Move to next month
  now.setDate(0);  // Set to last day of the previous month
  now.setHours(23, 59, 59, 999);

  const endOfMonth = Math.floor(now.getTime() / 1000);

  return { start: startOfMonth, end: endOfMonth };
}

// Get timestamps
const currentMonth = getMonthTimestamps(0);
const previousMonth = getMonthTimestamps(1);
const secondPreviousMonth = getMonthTimestamps(2);

console.log("Current Month:", currentMonth);
console.log("Previous Month:", previousMonth);
console.log("Second Previous Month:", secondPreviousMonth);

// Build API URLs dynamically
const buildFacebookApiUrls = () => {
  const { now, thirtyDaysAgo, yesterday,startOfToday,currentTime } = getTimeRanges();

  return {
    followers: `https://graph.facebook.com/v18.0/${pageId}?fields=followers_count&access_token=${accessToken}`,
    dailyLikes: `https://graph.facebook.com/v19.0/${pageId}/insights/page_fan_adds?since=${startOfToday}&until=${currentTime}&period=day&access_token=${accessToken}`,
    dailyViews: `https://graph.facebook.com/v19.0/${pageId}/insights/page_views_total?since=${startOfToday}&until=${currentTime}&period=day&access_token=${accessToken}`,
    totalPosts: `https://graph.facebook.com/v22.0/${pageId}/feed?fields=created_time,message,id,reactions.summary(total_count),shares,comments.summary(total_count)&access_token=${accessToken}`,
    totalReels: `https://graph.facebook.com/v22.0/${pageId}/videos?type=uploaded&access_token=${accessToken}`,
    filteredPosts: `https://graph.facebook.com/v22.0/${pageId}/feed?fields=created_time,message,id,reactions.summary(total_count),shares,comments.summary(total_count)&since=${thirtyDaysAgo}&until=${now}&access_token=${accessToken}`,
    filteredReels: `https://graph.facebook.com/v22.0/${pageId}/videos?type=uploaded&since=${thirtyDaysAgo}&until=${now}&access_token=${accessToken}`,
    postEngagements: `https://graph.facebook.com/v22.0/${pageId}/feed?fields=created_time,message,id,reactions.summary(total_count),shares,comments.summary(total_count)&access_token=${accessToken}`,
    dailyReactions: `https://graph.facebook.com/v22.0/${pageId}/insights?metric=page_actions_post_reactions_total&period=days_28&access_token=${accessToken}`,
   dailyFollow:`https://graph.facebook.com/v19.0/198771776656112/insights/page_daily_follows?since=${thirtyDaysAgo}&until=${yesterday}&period=day&access_token=EAASbD3SBqFoBO7CgUP9vZCj4Ut3vBl5DkNQXRam2by8kH5TXOFdmyqSLO0EEhKIA6RkbNJzkZBqJZAjVyUwZAMoeYZAeXFTedvlBF04p8a7AhdTdeaOPLblXKt1Dtgoqqcp1YQIDtacnZCNENOmZCP5JyA40bwITn3kO5feSD2kuyEpldqaxXlqurtWrSys5JULs2Q8SgfmXzgDAnEZD`
  } as const;
};

// TypeScript Interface for Facebook Data
export interface FacebookData {
  followers: any;
  dailyLikes: any;
  dailyFollow:any;
  dailyViews: any;
  totalPosts: any;
  totalReels: any;
  filteredPosts: any;
  filteredReels: any;
  postEngagements: any;
  filteredpostEngagements: any;
  dailyReactions: any;
}

// Function to fetch Facebook Data
export const fetchFacebookData = async (): Promise<FacebookData> => {
  try {
    const urls = buildFacebookApiUrls();
    const requests = (Object.keys(urls) as Array<keyof typeof urls>).map(key =>
      axios.get(urls[key]).then(response => ({ [key]: response.data }))
    );

    const results = await Promise.all(requests);
    const data = results.reduce((acc, result) => ({ ...acc, ...result }), {}) as FacebookData;

    return data;
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
    throw error;
  }
};

async function getFollowersCount(start: number, end: number, label: string) {
  const url = `https://graph.facebook.com/v19.0/${pageId}/insights?metric=page_fans&period=day&since=${start}&until=${end}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.data && data.data[0] && data.data[0].values.length > 0) {
      const followersStart = data.data[0].values[0].value; 
      const followersEnd = data.data[0].values[data.data[0].values.length - 1].value;

      return { month: label, followers: followersEnd - followersStart };
    } else {
      return { month: label, followers: 0 };
    }
  } catch (error) {
    console.error(`Error fetching ${label} data:`, error);
    return { month: label, followers: 0 };
  }
}



export const fetchBarData = async () => {
  const current = await getFollowersCount(currentMonth.start, currentMonth.end, "Current Month");
  const previous = await getFollowersCount(previousMonth.start, previousMonth.end, "Previous Month");
  const secondPrevious = await getFollowersCount(secondPreviousMonth.start, secondPreviousMonth.end, "Second Previous Month");

  return [
    { name: "Current Month", followers: current.followers },
    { name: "Previous Month", followers: previous.followers },
    { name: "Second Previous Month", followers: secondPrevious.followers },
  ];
};