import React, { useState } from 'react';
import { postToFacebook } from '../apis/fb';
import { postToInstagram } from '../apis/ig';
import { postToLinkedIn } from '../apis/in';
import { ImagePlus, X, Loader2 } from 'lucide-react';

export const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  // const [videos, setVideos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle multiple image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 4 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 4MB`);
        return false;
      }
      return true;
    });
    if (e.target.files) {
      setImages((prevImages) => [...prevImages, ...Array.from(e.target.files)]);
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle post submission
  const handlePost = async () => {
    if (!postContent.trim() && images.length === 0) {
      alert('Please enter text or select images to post.');
      return;
    }

    setLoading(true);
    try {
      const postPromises = selectedPlatforms.map(async (platform) => {
        switch (platform) {
          case 'facebook':
            return await postToFacebook(postContent, images);
          case 'instagram':
          return await postToInstagram(images, postContent);
            case 'linkedin':
              return await postToLinkedIn(postContent, images);
          default:
            return null;
        }
      });

      await Promise.all(postPromises);

      alert('Post published successfully!');
      setPostContent('');
      setImages([]);
      setSelectedPlatforms([]);
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Create a New Post</h2>
        
        <div className="space-y-4">
          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="What's on your mind?"
            rows={4}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple
                />
                <ImagePlus className="text-gray-400" />
              </label>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-gray-700">Select Platforms:</label>
            <div className="flex flex-wrap gap-4">
              {['facebook', 'instagram', 'linkedin'].map((platform) => (
                <label
                  key={platform}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors ${
                    selectedPlatforms.includes(platform)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={platform}
                    checked={selectedPlatforms.includes(platform)}
                    onChange={(e) => {
                      const newPlatforms = e.target.checked
                        ? [...selectedPlatforms, platform]
                        : selectedPlatforms.filter((p) => p !== platform);
                      setSelectedPlatforms(newPlatforms);
                    }}
                    className="hidden"
                  />
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          onClick={handlePost}
          disabled={loading || (!postContent.trim() && images.length === 0) || selectedPlatforms.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Posting...
            </>
          ) : (
            'Publish Post'
          )}
        </button>
      </div>
    </div>
  );
};

export default Post