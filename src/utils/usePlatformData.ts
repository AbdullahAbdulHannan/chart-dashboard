import { useEffect, useState } from 'react';
import { fetchInstagramData } from '../apis/ig';
import { fetchBarData, fetchFacebookData } from '../apis/fb';
import { generateChartData, generateLineDataPlatform } from './dataTransformers'
import { PlatformData, ComparisonPlatform } from '../types';
import { getCountsByDate, getPostMetricsByDate, getIgPostMetricsByDate, getLinkedInCountsByDate, getInPostMetricsByDate } from '../components/DetailedMetrics';
import fetchLinkedInData from '../apis/in';

let barData:any;
fetchBarData().then((data) => {
  barData = data;
  console.log(barData); // Data is now assigned
});

export const usePlatformData = () => {
  const [platformData, setPlatformData] = useState<{
    exampleData: PlatformData[];
    comparePlatform: ComparisonPlatform[];
    sampleData: Record<string, { title: string; engagementScore: number; datePosted: string }[]>;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const ig_data = await fetchInstagramData();
      const fb_data = await fetchFacebookData();
      const in_data=await fetchLinkedInData()
console.log(fb_data);

      const posts = ig_data.posts.data;
      let reelsCount = 0;
      let postsCount = 0;

      posts.forEach(post => {
        if (post.media_type === 'VIDEO' || post.media_type === 'REEL') {
          reelsCount++;
        } else {
          postsCount++;
        }
      });

      const fb_postsByDate = getCountsByDate(fb_data.filteredPosts, "created_time");
      const fb_reelsByDate = getCountsByDate(fb_data.filteredReels, "updated_time");
      const ig_postsByDate = getCountsByDate(ig_data.filteredPosts, "timestamp");
      const ig_reelsByDate = getCountsByDate(ig_data.filteredPosts, "timestamp", "VIDEO");
      const fb_postMetricsByDate = getPostMetricsByDate(fb_data.filteredPosts);
      const ig_postMetricsByDate = getIgPostMetricsByDate(ig_data.filteredPosts, 'timestamp');
      const in_postMetricsByDate = getInPostMetricsByDate(in_data.engagements);
      const linkedInPostsByDate = getLinkedInCountsByDate(in_data.totalPosts, "publishedAt");

const linkedInReelsByDate = getLinkedInCountsByDate(
  { elements: in_data.totalPosts.elements.filter(el => el.content?.media?.id?.startsWith('urn:li:video:')) }, 
  "publishedAt"
);

  
  
      // const linkedInPostMetricsByDate = getPostMetricsByDate(in_data.totalPosts.elements, "publishedAt");
  console.log(in_data);
  
      // Generate Chart Data
      const linkedInChartData = generateChartData(linkedInPostsByDate, linkedInReelsByDate, in_postMetricsByDate);
      const facebookChartData = generateChartData(fb_postsByDate, fb_reelsByDate, fb_postMetricsByDate);
      const instagramChartData = generateChartData(ig_postsByDate, ig_reelsByDate, ig_postMetricsByDate);

      const exampleData: PlatformData[] = [
        {
          id: 'facebook',
          name: 'Facebook',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png',
          followers: fb_data.followers.followers_count,
          new_following: fb_data.dailyFollow.data[0].values[fb_data.dailyFollow.data[0].values.length-1].value,
          views: fb_data.dailyViews.data[0].values[0].value,
          chartData: facebookChartData,
          donutData: [
            { name: 'Posts', value: fb_data.totalPosts.data.length, color: '#FF5733' },
            { name: 'Stories', value: 5, color: '#3c71e5' },
            { name: 'Reels', value: fb_data.totalReels.data.length, color: '#5D3FD3' }
          ]
        },
        {
          id: 'instagram',
          name: 'Instagram',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png',
          followers: ig_data.followers.followers_count,
          new_following: 5,
          views: ig_data.views.data[0].total_value.value||0,
          chartData: instagramChartData,
          donutData: [
            { name: 'Posts', value: postsCount, color: '#FF5733' },
            { name: 'Stories', value: 5, color: '#3c71e5' },
            { name: 'Reels', value: reelsCount, color: '#5D3FD3' }
          ]
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
          followers: in_data.followers?.firstDegreeSize||0,
          new_following: in_data.dailyFollowers?.elements[0]?.followerGains.organicFollowerGain,
          views: in_data.pageViews?.elements?.[0]?.totalPageStatistics?.views?.allPageViews?.pageViews || 0,
          chartData: linkedInChartData,
          donutData: [
            { name: 'Posts', value: in_data.totalPosts.elements.length, color: '#FF5733' },
            { name: 'Stories', value: 4, color: '#3c71e5' },
            { name: 'Reels or Videos', value: in_data.totalPosts.elements
              .map(el => el.content?.media?.id)
              .filter(id => id?.startsWith('urn:li:video:')).length, color: '#5D3FD3' }
          ]
        }
      ];

      const sampleData = {
        instagram: ig_data.posts.data.slice(0, 3).map((post) => ({
          title: post.caption ? post.caption.split(" ").slice(0, 5).join(" ") + "..." : "No title for this post",
          engagementScore: (post.like_count || 0) + (post.comments_count || 0),
          datePosted: post.timestamp?.split("T")[0] || "Unknown Date",
        })),
        facebook: fb_data.totalPosts.data.slice(0, 3).map((post) => ({
          title: post.message ? post.message.split(" ").slice(0, 5).join(" ") + "..." : "No title for this post",
          engagementScore: (post.reactions?.summary?.total_count || 0) + (post.comments?.summary?.total_count || 0),
          datePosted: post.created_time?.split("T")[0] || "Unknown Date",
        })),
        linkedin: in_data.postEngagements.slice(0, 3).map((post, index) => {
          const commentCount = post.data.commentSummary?.count || 0;
          const reactionCount = Object.values(post.data.reactionSummaries || {}).reduce(
            (sum, reaction) => sum + (reaction.count || 0),
            0
          );
      
          return {
            title: in_data.totalPosts.elements[index]?.commentary
              ? in_data.totalPosts.elements[index].commentary.split(" ").slice(0, 5).join(" ") + "..."
              : "No title for this post",
            engagementScore: commentCount + reactionCount,
            datePosted: new Date(in_data.totalPosts?.elements[index]?.publishedAt).toLocaleDateString(),
          };
        }),
      };
      

      const lineDataPlatform = generateLineDataPlatform(fb_postMetricsByDate, ig_postMetricsByDate,in_postMetricsByDate);

      const comparePlatform: ComparisonPlatform[] = [
        {
          donutDataPlatform: [
            { name: 'Facebook', value: fb_data.followers.followers_count, color: '#FF5733' },
            { name: 'Linkedin', value: in_data.followers?.firstDegreeSize||0, color: 'skyblue' },
            { name: 'Instagram', value: ig_data.followers.followers_count, color: '#5D3FD3' }
          ],
          lineDataPlatform,
          barDataPlatform: [
            { name: barData[2].name, linkedin: 1, facebook: barData[2].followers, instagram: 2 },
            { name: barData[1].name, linkedin: 1, facebook: barData[1].followers, instagram: 2 },
            { name: barData[0].name, linkedin: 2, facebook: barData[0].followers, instagram: 1 },
            
            
          ]
        }
      ];

      setPlatformData({ exampleData, comparePlatform, sampleData });
    };

    fetchData();
  }, []);

  return platformData;
};