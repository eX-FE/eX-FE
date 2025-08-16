'use client';

import Feed from '../../components/Feed';
import TweetsLayout from './TweetsLayout';
import SearchBar from '../../components/SearchBar';
import { Tweet } from '../../types/Tweet';

// Discover/Explore feed - trending and public tweets
const discoverTweets: Tweet[] = [
  {
    id: 'discover1',
    author: 'NASA',
    content: '🚀 INCREDIBLE: Our James Webb Space Telescope just captured the most detailed image of a distant galaxy ever recorded! The universe continues to amaze us with its beauty and complexity.\n\n📸 Image processing took 847 hours\n🔭 Distance: 13.1 billion light years\n\n#JWST #Space #Astronomy',
    createdAt: new Date('2025-08-16T09:50:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=150&h=150&fit=crop&crop=face',
    likes: 45678,
    replies: 5643,
    retweets: 18234,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'discover2',
    author: 'OpenAI',
    content: '🤖 GPT-5 development update: We are making incredible progress on reasoning capabilities and multimodal understanding. The next generation of AI will be more helpful, harmless, and honest than ever before.\n\nStay tuned for more updates! 🚀\n\n#AI #GPT5 #Innovation',
    createdAt: new Date('2025-08-16T09:15:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150&h=150&fit=crop&crop=face',
    likes: 23456,
    replies: 4321,
    retweets: 11789,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'discover3',
    author: 'Open Source',
    content: '🎉 We just reached 10,000 stars on GitHub! Thank you to our amazing community for making this project possible. #OpenSource #GitHub',
    createdAt: new Date('2025-08-16T09:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=150&fit=crop&crop=face',
    likes: 567,
    replies: 123,
    retweets: 234,
    isLiked: false,
    isRetweeted: true
  },
  {
    id: 'discover4',
    author: 'Tesla',
    content: '⚡ Supercharger Network Update: We now have 50,000+ Superchargers worldwide! \n\n🌍 Available in 46 countries\n🚗 Compatible with all EVs\n⚡ Up to 250kW charging speed\n🔋 Solar-powered stations\n\nThe future of transportation is electric! #Tesla #EV #Sustainability',
    createdAt: new Date('2025-08-16T07:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=150&h=150&fit=crop&crop=face',
    likes: 34567,
    replies: 2456,
    retweets: 12890,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'discover5',
    author: 'Microsoft',
    content: '🚀 Excited to announce the next generation of Azure AI! Our new multimodal models can understand text, images, audio, and video simultaneously.\n\n🧠 40% faster inference\n💡 95% accuracy improvement\n🌐 Available in 28 languages\n\n#Azure #AI #Cloud #Innovation',
    createdAt: new Date('2025-08-16T04:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&h=150&fit=crop&crop=face',
    likes: 28901,
    replies: 3456,
    retweets: 9876,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'discover6',
    author: 'Google',
    content: '🌟 Bard 2.0 is here! Enhanced with Gemini Pro Ultra, our most capable AI model yet.\n\n🧮 Advanced reasoning\n🎨 Creative writing\n📊 Data analysis\n💬 130+ languages\n🔒 Privacy-first design\n\nExperience the future of AI assistance today! #Bard #GoogleAI #Gemini',
    createdAt: new Date('2025-08-16T02:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=150&h=150&fit=crop&crop=face',
    likes: 41234,
    replies: 5432,
    retweets: 15678,
    isLiked: false,
    isRetweeted: false
  }
];

export default function TweetsPage() {
  return (
    <TweetsLayout>
      <SearchBar placeholder="Search" />
      <Feed 
        title="Explore"
        initialTweets={discoverTweets}
        showComposer={false}
        defaultAuthor="You"
        defaultAvatarUrl="/vampicorn.jpeg"
      />
    </TweetsLayout>
  );
}
