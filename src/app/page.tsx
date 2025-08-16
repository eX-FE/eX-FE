import Feed from '../components/Feed';
import IntegrationTest from '../components/IntegrationTest';
import { Tweet } from '../types/Tweet';

// Home feed - more personal/following content
const homeFeedTweets: Tweet[] = [
  {
    id: 'home1',
    author: 'You',
    content: 'Just finished setting up my Twitter clone! Ready to start tweeting 🎉',
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    avatarUrl: '/vampicorn.jpeg',
    likes: 0,
    replies: 0,
    retweets: 0,
    isLiked: false,
    isRetweeted: false
  },
  {
    id: 'home2',
    author: 'John Doe',
    content: 'Working on some React components today. TypeScript makes everything so much cleaner! 💻',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    avatarUrl: '/vampicorn.jpeg',
    likes: 8,
    replies: 2,
    retweets: 1,
    isLiked: true,
    isRetweeted: false
  },
  {
    id: 'home3',
    author: 'Sarah Wilson',
    content: 'Beautiful sunrise this morning! ☀️ Hope everyone has a great day ahead.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 24,
    replies: 5,
    retweets: 3,
    isLiked: false,
    isRetweeted: false
  }
];

export default function Home() {
  return (
    <div>
      <IntegrationTest />
      <Feed 
        title="Home"
        initialTweets={homeFeedTweets}
        showComposer={true}
        defaultAuthor="You"
        defaultAvatarUrl="/vampicorn.jpeg"
      />
    </div>
  );
}
