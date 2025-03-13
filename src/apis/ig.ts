import axios from 'axios';

const accessToken = 'EAASbD3SBqFoBO04ZCM9mBXanMAC5XXY4SZBrTWp3wQAmhQ7XLcLumFMduZCAty6bnIrobGcm2KX9r5kE3mVZAI5esETT0XycHzozBQ9mR1N7uvmvA5dCHwnYlitKM8uryZBlXEKZAKdeNZC6a8qUu7dliKoxA3j0zC7dFcKyjbsO1GyAQXqzGnPUzqXCYtYdiwZD';
const instagramId = '17841459272541177';
const imgBBApiKey = 'c47c4917c956b698312765c570258778';

const getTimeRanges = () => {
  const now = new Date();
  const nowUTC = Math.floor(now.getTime() / 1000);
  const thirtyDaysAgoUTC = nowUTC - 30 * 24 * 60 * 60;
  const startOfToday = Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000);
  const ninetyDaysAgo = startOfToday - 90 * 24 * 60 * 60;
  
  return {
    nowUTC,
    startOfToday,
    thirtyDaysAgo: thirtyDaysAgoUTC,
    ninetyDaysAgo,
  };
};

const buildApiUrls = () => {
  const times = getTimeRanges();
  return {
      followers: `https://graph.facebook.com/v22.0/${instagramId}?fields=followers_count&access_token=${accessToken}`,
      views: `https://graph.facebook.com/v18.0/${instagramId}/insights?metric=profile_views&period=day&metric_type=total_value&access_token=${accessToken}`,
      newFollowers: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=follows_and_unfollows&metric_type=total_value&period=day&access_token=${accessToken}`,
      // newFollowers: `https://graph.facebook.com/v19.0/${instagramId}/insights?metric=follower_count&period=day&since=${times.startOfToday}&until=${times.currentTime}&access_token=${accessToken}`,
  
      posts: `https://graph.facebook.com/v22.0/${instagramId}/media?fields=id,media_type,caption,timestamp,comments_count,like_count&access_token=${accessToken}`,
      filteredPosts: `https://graph.facebook.com/v22.0/${instagramId}/media?fields=id,media_type,caption,timestamp,comments_count,like_count,insights.metric(saved)&since=${times.thirtyDaysAgo}&until=${times.nowUTC}&access_token=${accessToken}`,
      interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.thirtyDaysAgo}&until=${times.nowUTC}&metric_type=total_value&period=day&access_token=${accessToken}`,
      dailyFollow:`https://graph.facebook.com/v22.0/${instagramId}/insights?metric=follower_count&period=day&since=${times.thirtyDaysAgo}&until=${times.nowUTC}&access_token=${accessToken}`
      // total_interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.pageCreationDate}&until=${times.now}&metric_type=total_value&period=day&access_token=${accessToken}`,
      // bar_interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.ninetyDaysAgo}&until=${times.now}&metric_type=total_value&period=day&access_token=${accessToken}`
    }as const;
};

export interface InstagramData {
  followers: any;
  views: any;
  dailyFollow: any;
  newFollowers: any;
  posts: any;
  filteredPosts: any;
  interactions: any;
}

export const fetchInstagramData = async (): Promise<InstagramData> => {
  try {
    const urls = buildApiUrls();
    const requests = (Object.keys(urls) as Array<keyof typeof urls>).map(key =>
      axios.get(urls[key]).then(response => ({ [key]: response.data }))
    );
    
    const results = await Promise.all(requests);
    return results.reduce((acc, result) => ({ ...acc, ...result }), {}) as InstagramData;
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    throw error;
  }
};

const uploadToImgBB = async (image: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('key', imgBBApiKey);

    const { data } = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (!data.data.url) throw new Error('Failed to upload image to ImgBB');
    return data.data.url;
  } catch (error: any) {
    console.error('Error uploading to ImgBB:', error.response?.data || error.message);
    throw error;
  }
};

// Upload multiple images to ImgBB
const uploadMultipleImagesToImgBB = async (images: File[]): Promise<string[]> => {
  return Promise.all(images.map(uploadToImgBB));
};

// Create an Instagram media container for each image
const createMediaContainer = async (imageUrl: string): Promise<string> => {
  try {
    const { data } = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramId}/media`,
      {
        image_url: imageUrl,
        access_token: accessToken,
      }
    );
    if (!data.id) throw new Error('Failed to get media ID from response');
    return data.id;
  } catch (error: any) {
    console.error('Error creating media container:', error.response?.data || error.message);
    throw error;
  }
};

const createCarouselContainer = async (imageUrls: string[], caption: string, videoIds: string[] = []): Promise<string> => {
  try {
    const mediaIds = await Promise.all(imageUrls.map(createMediaContainer));

    const { data } = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramId}/media`,
      {
        media_type: 'CAROUSEL', // Use CAROUSEL for mixed media
        children: [...mediaIds, ...videoIds], // Include both image and video IDs
        caption,
        access_token: accessToken,
      }
    );

    if (!data.id) throw new Error('Failed to create carousel container');
    return data.id;
  } catch (error: any) {
    console.error('Error creating carousel:', error.response?.data || error.message);
    throw error;
  }
};

// Publish the Instagram post (carousel)
const publishToInstagram = async (mediaId: string) => {
  try {
    const { data } = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramId}/media_publish`,
      {
        creation_id: mediaId,
        access_token: accessToken,
      }
    );
    if (!data.id) throw new Error('Failed to publish post');
    return data.id;
  } catch (error: any) {
    console.error('Error publishing post:', error.response?.data || error.message);
    throw error;
  }
};
const uploadVideoToInstagram = async (videoFile: File, caption: string): Promise<string> => {
  try {
    // Step 1: Create a media container for the video
    const { data: containerData } = await axios.post(
      `https://graph.facebook.com/v22.0/${instagramId}/media`,
      {
        media_type: 'REELS', // Use REELS instead of VIDEO
        video_url: URL.createObjectURL(videoFile),
        caption, // Optional caption for the video
        access_token: accessToken,
      }
    );

    if (!containerData.id) throw new Error('Failed to create video media container');
    const containerId = containerData.id;

    // Step 2: Check the status of the video upload
    const checkStatus = async (): Promise<string> => {
      const { data: statusData } = await axios.get(
        `https://graph.facebook.com/v22.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );

      if (statusData.status_code === 'FINISHED') {
        return containerId;
      } else if (statusData.status_code === 'ERROR') {
        throw new Error('Video upload failed');
      } else {
        // Wait for a few seconds and check again
        await new Promise(resolve => setTimeout(resolve, 5000));
        return checkStatus();
      }
    };

    return checkStatus();
  } catch (error: any) {
    console.error('Error uploading video to Instagram:', error.response?.data || error.message);
    throw error;
  }
};
// Final function to post images as a carousel with caption
export const postToInstagram = async (files: File[], caption: string) => {
  try {
    console.log('Uploading files...');
    const imageUrls: string[] = [];
    const videoIds: string[] = [];

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        // Upload images to ImgBB
        const imageUrl = await uploadToImgBB(file);
        imageUrls.push(imageUrl);
      } else if (file.type.startsWith('video/')) {
        // Upload videos directly to Instagram
        const videoId = await uploadVideoToInstagram(file, caption);
        videoIds.push(videoId);
      } else {
        throw new Error('Unsupported file type');
      }
    }

    console.log('Creating carousel container...');
    let mediaId: string;

    if (videoIds.length > 0) {
      // If there are videos, create a carousel with videos
      mediaId = await createCarouselContainer([], caption, videoIds);
    } else {
      // If there are only images, create a carousel with images
      mediaId = await createCarouselContainer(imageUrls, caption);
    }

    console.log('Publishing to Instagram...');
    await publishToInstagram(mediaId);

    console.log('Post successfully published on Instagram!');
  } catch (error: any) {
    console.error('Error posting to Instagram:', error.response?.data || error.message);
    throw error;
  }
};