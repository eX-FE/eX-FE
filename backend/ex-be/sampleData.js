const tweetStore = require('./models/Tweet');
const userStore = require('./models/User');

// Create sample users and tweets for testing
async function initializeSampleData() {
  console.log('Initializing sample data...');
  
  // Create sample users
  const sampleUsers = [
    {
      id: 'user1',
      username: 'johndev',
      displayName: 'John Developer',
      email: 'john@example.com',
      password: 'password123',
      bio: 'Full-stack developer passionate about React and Node.js',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: false,
      stats: { followers: 245, following: 189, tweets: 0 }
    },
    {
      id: 'user2', 
      username: 'sarahdesign',
      displayName: 'Sarah Designer',
      email: 'sarah@example.com',
      password: 'password123',
      bio: 'UI/UX Designer crafting beautiful digital experiences',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      stats: { followers: 1250, following: 432, tweets: 0 }
    },
    {
      id: 'user3',
      username: 'mikecto',
      displayName: 'Mike CTO',
      email: 'mike@example.com',
      password: 'password123', 
      bio: 'CTO @TechStartup | Building the future of software',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      stats: { followers: 5670, following: 234, tweets: 0 }
    }
  ];

  // Add users to store
  const createdUsers = {};
  for (const userData of sampleUsers) {
    try {
      // Create user with basic required fields
      const user = await userStore.create({
        email: userData.email,
        password: userData.password,
        username: userData.username
      });
      
      // Store the user ID for later use
      createdUsers[userData.id] = user.id;
      
      // Update the created user with additional fields
      const userId = user.id;
      const rawUser = userStore.findRawById(userId);
      if (rawUser) {
        rawUser.displayName = userData.displayName;
        rawUser.bio = userData.bio;
        rawUser.avatarUrl = userData.avatarUrl;
        rawUser.verified = userData.verified;
        rawUser.stats = userData.stats;
      }
      
      console.log(`Created user: ${userData.username}`);
    } catch (error) {
      console.log(`User ${userData.username} already exists`);
    }
  }

  // Create sample tweets
  const sampleTweets = [
    {
      userId: 'user1',
      content: 'Just shipped a new feature! 🚀 The satisfaction of seeing clean code in production never gets old. #DevLife #JavaScript #React'
    },
    {
      userId: 'user2',
      content: 'Design tip: White space is not wasted space. It gives your content room to breathe and improves readability. ✨ #UXDesign #WebDesign'
    },
    {
      userId: 'user3',
      content: 'Hot take: The best code is the code you don\'t have to write. Sometimes the simplest solution is the right one. 💡 #TechLeadership #KISS'
    },
    {
      userId: 'user1',
      content: 'Learning Rust and loving the compile-time safety! 🦀 Coming from JavaScript, the type system is a game changer. #RustLang #LearningInPublic'
    },
    {
      userId: 'user2',
      content: 'Working on a new design system for our company. Consistency is key! 🎨 Anyone else love building component libraries? #DesignSystems #Figma'
    },
    {
      userId: 'user3',
      content: 'Reminder: Your team\'s happiness is just as important as your product metrics. Invest in people, not just processes. 👥 #Leadership #TeamBuilding'
    }
  ];

  // Add tweets to store
  sampleTweets.forEach(tweetData => {
    try {
      // Use the actual user ID from the created users
      const actualUserId = createdUsers[tweetData.userId];
      if (!actualUserId) {
        console.log(`Skipping tweet - user ${tweetData.userId} not found`);
        return;
      }

      const tweet = tweetStore.create({
        ...tweetData,
        userId: actualUserId
      });
      console.log(`Created tweet: ${tweet.content.substring(0, 50)}...`);
      
      // Update user tweet count
      const user = userStore.findRawById(actualUserId);
      if (user && user.stats) {
        user.stats.tweets += 1;
      }
    } catch (error) {
      console.error('Error creating sample tweet:', error);
    }
  });

  console.log('Sample data initialization complete!');
}

module.exports = { initializeSampleData };
