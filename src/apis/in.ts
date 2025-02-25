import axios from 'axios';

const BASE_URL = 'https://linkedinapi-kappa.vercel.app/api/linkedin';

// Helper function to fetch LinkedIn data
const fetchLinkedInData = async () => {
  try {
    const endpoints = {
      followers: `${BASE_URL}/followers`,
      dailyFollowers: `${BASE_URL}/daily-followers`,
      pageViews: `${BASE_URL}/page-views`,
      totalPosts: `${BASE_URL}/total-posts`,
      engagements: `${BASE_URL}/engagements`,
      postEngagements: `${BASE_URL}/post-engagements`,
    };

    // Fetch all data in parallel
    const requests = Object.entries(endpoints).map(([key, url]) =>
      axios.get(url).then(response => ({ [key]: response.data }))
    );

    const results = await Promise.all(requests);
    
    // Merge all responses into a single object
    const data = results.reduce((acc, result) => ({ ...acc, ...result }), {});

    return data;
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    throw error;
  }
};

export default fetchLinkedInData;
