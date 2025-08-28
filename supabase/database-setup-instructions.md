# Supabase Database Setup Instructions

## Overview
This document provides instructions for setting up the database schema for the polling application using Supabase.

## Database Schema

### Tables Created
1. **profiles** - User profiles extending auth.users
2. **polls** - Main polls table
3. **poll_options** - Options for each poll
4. **votes** - User votes on poll options

### Key Features
- **Row Level Security (RLS)** enabled on all tables
- **Automatic profile creation** on user signup
- **Vote count tracking** with triggers
- **Poll expiration** support
- **Multiple/single vote** options per poll
- **Comprehensive indexes** for performance

## Setup Instructions

### Method 1: Using Supabase Dashboard (Recommended)

1. **Login to your Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project dashboard

2. **Run the migrations**
   - Go to SQL Editor in the left sidebar
   - Create a new query
   - Copy and paste the content of each migration file in order:
     1. `001_create_initial_tables.sql`
     2. `002_setup_rls_policies.sql`
     3. `003_create_functions_and_triggers.sql`
     4. `004_seed_development_data.sql` (optional)
   - Run each query

### Method 2: Using Supabase CLI

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Initialize Supabase in your project**
   ```bash
   supabase init
   ```

3. **Link to your remote project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Push migrations to remote**
   ```bash
   supabase db push
   ```

## Database Schema Details

### profiles table
- Extends `auth.users` with additional user information
- Automatically created via trigger when user signs up
- Stores username, full_name, avatar_url, bio

### polls table
- Main poll entity with title, description, settings
- Tracks creator, creation/expiration dates
- Supports multiple vote types and anonymity settings
- Includes vote count caching for performance

### poll_options table
- Individual options for each poll
- Maintains position/order and vote counts
- Linked to polls with cascade delete

### votes table
- Records individual user votes
- Prevents duplicate votes (unless multiple votes allowed)
- Includes metadata for fraud prevention

## Security Features

### Row Level Security (RLS)
- **profiles**: Users can view all profiles, but only modify their own
- **polls**: Public read access for active polls, authenticated create/update/delete
- **poll_options**: Tied to poll visibility and ownership
- **votes**: Users can vote on active polls and view their own votes

### Data Validation
- Check constraints on text lengths
- Vote count consistency via triggers
- Poll expiration validation
- Option uniqueness within polls

## Functions and Triggers

### Automatic Profile Creation
- `handle_new_user()` - Creates profile when user signs up
- Triggered on `auth.users` INSERT

### Vote Count Management
- `update_vote_counts()` - Maintains accurate vote counts
- Triggered on votes INSERT/UPDATE/DELETE
- Updates both option counts and poll totals

### Utility Functions
- `can_user_vote()` - Checks if user can vote on a poll
- `get_poll_results()` - Returns poll results with percentages
- `validate_and_cast_vote()` - Safely casts a vote with validation

## Development Helpers

### Sample Data Creation
- `create_sample_poll()` - Creates a poll with options
- `simulate_votes_for_poll()` - Adds test votes to a poll

### Usage Examples
```sql
-- Create a sample poll
SELECT create_sample_poll(
  'user-uuid-here',
  'Favorite Color',
  'What is your favorite color?',
  ARRAY['Red', 'Blue', 'Green', 'Yellow'],
  false, -- single vote
  7 -- expires in 7 days
);

-- Get poll results
SELECT * FROM get_poll_results('poll-uuid-here');

-- Check if user can vote
SELECT can_user_vote('poll-uuid-here', 'user-uuid-here');
```

## Performance Considerations

### Indexes Created
- Poll lookup by creator, date, status
- Option lookup by poll
- Vote lookup by poll, user, option
- Optimized for common query patterns

### Caching Strategy
- Vote counts cached in poll_options and polls tables
- Updated via triggers for consistency
- Reduces need for COUNT queries

## Next Steps

1. Run the migrations in your Supabase project
2. Test user registration to ensure profile creation works
3. Create sample polls using the helper functions
4. Update your application code to use the new schema
5. Consider adding indexes for specific query patterns as your app grows

## Troubleshooting

### Common Issues
- **RLS blocking queries**: Ensure you're authenticated when testing
- **Profile not created**: Check if the trigger is properly installed
- **Vote counts wrong**: Verify the trigger is firing correctly
- **Can't vote**: Check poll expiration and multiple vote settings

### Useful Queries for Debugging
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```