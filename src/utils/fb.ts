import axios from 'axios';

const FACEBOOK_API_URL = 'https://graph.facebook.com/v19.0/me/feed';
// const INSTAGRAM_API_URL = 'https://graph.facebook.com/v19.0/me/media';
// const LINKEDIN_API_URL = 'https://api.linkedin.com/v2/ugcPosts';

const uploadImageToFacebook = async (imageUrl: string) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/photos`,
      {
        url: imageUrl, // Direct image URL
        published: false, // Do not publish immediately
        access_token: accessToken,
      }
    );

    return response.data.id; // Return media ID
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Function to create a Facebook post (text + image)
export const postToFacebook = async (message: string, imageUrl?: string) => {
  try {
    let mediaId: string | null = null;

    // If an image is provided, upload it first
    if (imageUrl) {
      mediaId = await uploadImageToFacebook(imageUrl);
    }

    // Prepare post data
    const postData: any = {
      message,
      access_token: accessToken,
    };

    // If image was uploaded, attach it
    if (mediaId) {
      postData.attached_media = [{ media_fbid: mediaId }];
    }

    // Post to Facebook
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      postData
    );

    console.log('Post successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error posting to Facebook:', error);
    throw error;
  }
};