'use client';

import Feed from '../../components/Feed';
import Layout from '../../components/Layout';
import { Tweet } from '../../types/Tweet';

// Discover/Explore feed - trending and public tweets
const discoverTweets: Tweet[] = [
  {
    id: 'discover1',
    author: 'Tech News',
    content: 'BREAKING: Major breakthrough in AI development announced today! 🤖 The future of technology is here. What are your thoughts on the latest advancements?',
    createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    avatarUrl: '/globe.svg',
    likes: 342,
    replies: 89,
    retweets: 156,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'discover2',
    author: 'Dev Community',
    content: '🔥 TRENDING: Top 5 JavaScript frameworks in 2025:\n1. React ⚛️\n2. Vue.js 💚\n3. Angular 🅰️\n4. Svelte ⭐\n5. Solid.js 🚀\n\nWhich one is your favorite?',
    createdAt: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    avatarUrl: '/file.svg',
    likes: 234,
    replies: 67,
    retweets: 89,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'discover3',
    author: 'Open Source',
    content: '🎉 We just reached 10,000 stars on GitHub! Thank you to our amazing community for making this project possible. #OpenSource #GitHub',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    likes: 567,
    replies: 123,
    retweets: 234,
    isLiked: false,
    isRetweeted: true
  },
  {
    id: 'discover4',
    author: 'Design Inspiration',
    content: 'Latest UI/UX trends for 2025: ✨ Glassmorphism is making a comeback, minimalism with bold typography, and micro-interactions are more important than ever!',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    avatarUrl: '/window.svg',
    likes: 445,
    replies: 78,
    retweets: 167,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'discover5',
    author: 'Startup World',
    content: '💡 Idea: What if we could build applications that write themselves? With the rise of AI-powered development tools, this might not be science fiction much longer...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    likes: 189,
    replies: 45,
    retweets: 67,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'discover6',
    author: 'Web Dev Tips',
    content: '🚀 Performance tip: Use React.memo() wisely! It prevents unnecessary re-renders but don\'t overuse it. Profile first, optimize second. #ReactJS #Performance',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    likes: 156,
    replies: 34,
    retweets: 78,
    isLiked: false,
    isRetweeted: false
  }
];

export default function TweetsPage() {
  return (
    <Layout>
      <Feed 
        title="Explore"
        initialTweets={discoverTweets}
        showComposer={false}
        defaultAuthor="You"
        defaultAvatarUrl="/vampicorn.jpeg"
      />
    </Layout>
  );
}
