import Feed from '../components/Feed';
import { Tweet } from '../types/Tweet';

// Home feed - more personal/following content with diverse, engaging tweets
const homeFeedTweets: Tweet[] = [
  {
    id: 'home1',
    author: 'Alex Chen',
    content: 'Just shipped a new feature at work! 🚀 The feeling when your code passes all tests on the first try is unmatched ✨\n\n#DevLife #TypeScript #React',
    createdAt: new Date('2025-08-16T10:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    likes: 42,
    replies: 8,
    retweets: 12,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'home2',
    author: 'Maya Patel',
    content: 'Coffee shops are the best coworking spaces. The ambient noise, the caffeine, the creative energy... ☕️✨\n\nCurrently working on my startup pitch deck. Any fellow entrepreneurs here?',
    createdAt: new Date('2025-08-16T09:35:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    likes: 156,
    replies: 23,
    retweets: 34,
    isLiked: false,
    isRetweeted: true
  },
  {
    id: 'home3',
    author: 'David Rodriguez',
    content: 'Hot take: The best way to learn a new programming language is to build something you actually want to use 🔥\n\nCurrently learning Rust by building a CLI tool. What are you building?',
    createdAt: new Date('2025-08-16T09:15:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    likes: 234,
    replies: 67,
    retweets: 89,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'home4',
    author: 'Sophie Kim',
    content: 'Just watched the sunrise from my balcony and had to share this moment 🌅\n\nSometimes you need to step away from the screen and appreciate the simple things in life.',
    createdAt: new Date('2025-08-16T08:30:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    likes: 789,
    replies: 45,
    retweets: 123,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'home5',
    author: 'Marcus Johnson',
    content: 'AI is changing everything, but the fundamentals of good software engineering remain the same:\n\n• Write clean, readable code\n• Test thoroughly\n• Document well\n• Think about the user\n\n#SoftwareEngineering #AI',
    createdAt: new Date('2025-08-16T07:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    likes: 1247,
    replies: 156,
    retweets: 445,
    isLiked: true,
    isRetweeted: true
  },
  {
    id: 'home6',
    author: 'Emma Thompson',
    content: 'Reminder: Your first draft doesn\'t have to be perfect. Whether it\'s code, writing, or design - just start. You can always refactor later 💪\n\n#MotivationMonday #ProductivityTips',
    createdAt: new Date('2025-08-16T04:00:00Z'), // Static timestamp
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    likes: 567,
    replies: 34,
    retweets: 178,
    isLiked: false,
    isRetweeted: false
  }
];

export default function Home() {
  return (
    <div>
      <Feed 
        title="Home"
        initialTweets={homeFeedTweets}
        showComposer={true}
        defaultAuthor="You"
        defaultAvatarUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      />
    </div>
  );
}
