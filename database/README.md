# Database Setup for eX Twitter Clone

This Docker setup provides a PostgreSQL database with pgAdmin for testing and development.

## Services

- **PostgreSQL 15**: Main database server
- **pgAdmin 4**: Web-based database administration tool

## Quick Start

1. **Start the database**:
   ```bash
   docker-compose up -d
   ```

2. **Stop the database**:
   ```bash
   docker-compose down
   ```

3. **Reset database (removes all data)**:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

## Access Information

### Database Connection
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `ex_twitter_test`
- **Username**: `ex_user`
- **Password**: `ex_password123`
- **Connection URL**: `postgresql://ex_user:ex_password123@localhost:5432/ex_twitter_test`

### pgAdmin Web Interface
- **URL**: http://localhost:8080
- **Email**: `admin@example.com`
- **Password**: `admin123`

## Database Schema

The database includes the following tables:

- **users**: User accounts with profiles
- **tweets**: Tweet content and metadata
- **follows**: User follow relationships
- **likes**: Tweet likes
- **retweets**: Tweet retweets

## Sample Data

The database is initialized with sample test data including:
- 5 test users
- 8 sample tweets
- Follow relationships
- Likes and retweets

## Environment Variables

Copy `.env.local` to your backend directory and use these environment variables:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ex_twitter_test
DB_USER=ex_user
DB_PASSWORD=ex_password123
DATABASE_URL=postgresql://ex_user:ex_password123@localhost:5432/ex_twitter_test
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Connect to database directly
docker exec -it ex-postgres-test psql -U ex_user -d ex_twitter_test

# Backup database
docker exec ex-postgres-test pg_dump -U ex_user ex_twitter_test > backup.sql

# Restore database
docker exec -i ex-postgres-test psql -U ex_user ex_twitter_test < backup.sql
```

## Health Check

The PostgreSQL container includes a health check. You can verify it's running:

```bash
docker-compose ps
```

Look for "healthy" status in the output.
