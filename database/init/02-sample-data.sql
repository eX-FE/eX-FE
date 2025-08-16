-- Insert sample test data for development and testing

-- Insert test users
INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar_url, followers_count, following_count, verified) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'testuser1', 'test1@example.com', '$2b$10$example.hash.for.password123', 'Test User One', 'I love testing applications! 🧪', '/vampicorn.jpeg', 150, 75, false),
('550e8400-e29b-41d4-a716-446655440002', 'johndev', 'john@dev.com', '$2b$10$example.hash.for.password123', 'John Developer', 'Full-stack developer passionate about React and Node.js 💻', '/vampicorn.jpeg', 500, 200, true),
('550e8400-e29b-41d4-a716-446655440003', 'sarahdesign', 'sarah@design.com', '$2b$10$example.hash.for.password123', 'Sarah Wilson', 'UX/UI Designer creating beautiful digital experiences ✨', '/vampicorn.jpeg', 300, 150, false),
('550e8400-e29b-41d4-a716-446655440004', 'techexplorer', 'tech@explorer.com', '$2b$10$example.hash.for.password123', 'Tech Explorer', 'Exploring the latest in technology and AI 🚀', '/vampicorn.jpeg', 1200, 800, true),
('550e8400-e29b-41d4-a716-446655440005', 'codemaster', 'code@master.com', '$2b$10$example.hash.for.password123', 'Code Master', 'Teaching coding to the next generation 👨‍💻', '/vampicorn.jpeg', 2500, 500, true);

-- Insert test tweets
INSERT INTO tweets (id, user_id, content, likes_count, retweets_count, replies_count, created_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Just finished setting up my Twitter clone! Ready to start tweeting 🎉', 12, 3, 2, NOW() - INTERVAL '5 minutes'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Working on some React components today. TypeScript makes everything so much cleaner! 💻', 25, 8, 5, NOW() - INTERVAL '30 minutes'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Beautiful sunrise this morning! ☀️ Hope everyone has a great day ahead.', 45, 12, 8, NOW() - INTERVAL '2 hours'),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'AI is revolutionizing how we build applications. The future is here! 🤖', 89, 34, 15, NOW() - INTERVAL '4 hours'),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Teaching kids to code is so rewarding. They pick it up so fast! 👶💻', 156, 45, 23, NOW() - INTERVAL '6 hours'),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Love this new database setup with Docker! Makes testing so much easier 🐳', 8, 2, 1, NOW() - INTERVAL '1 hour'),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', 'PostgreSQL + Docker = Perfect development environment 🔥', 32, 10, 4, NOW() - INTERVAL '3 hours'),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Designing the user interface for our Twitter clone. Clean and modern! ✨', 67, 18, 12, NOW() - INTERVAL '5 hours');

-- Insert test follows
INSERT INTO follows (follower_id, following_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001');

-- Insert test likes
INSERT INTO likes (user_id, tweet_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001');

-- Insert test retweets
INSERT INTO retweets (user_id, tweet_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002');
