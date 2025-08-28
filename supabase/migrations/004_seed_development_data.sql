-- Insert seed data for development (only run in development environment)
-- Note: This should be applied after you have at least one user registered

-- Sample polls data
-- You'll need to replace the user IDs with actual user IDs from your auth.users table
-- This is just a template - uncomment and modify with real user IDs when needed

/*
-- Example seed data (uncomment and modify user IDs):

-- Insert sample polls
INSERT INTO public.polls (id, title, description, created_by, is_active, allow_multiple_votes, expires_at) VALUES
(
  gen_random_uuid(),
  'Favorite Programming Language for Web Development',
  'Which programming language do you prefer for building modern web applications?',
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  true,
  false,
  NOW() + INTERVAL '30 days'
),
(
  gen_random_uuid(),
  'Best Time for Team Meetings',
  'When should we schedule our weekly team sync meetings?',
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  true,
  false,
  NOW() + INTERVAL '7 days'
),
(
  gen_random_uuid(),
  'Office Lunch Preferences',
  'What type of food should we order for the office lunch? (Multiple selections allowed)',
  'YOUR_USER_ID_HERE', -- Replace with actual user ID
  true,
  true,
  NOW() + INTERVAL '2 days'
);

-- Get the poll IDs for inserting options
-- Replace these with the actual IDs generated above
SET @poll1_id = 'POLL_1_ID_HERE';
SET @poll2_id = 'POLL_2_ID_HERE';
SET @poll3_id = 'POLL_3_ID_HERE';

-- Insert poll options for Programming Language poll
INSERT INTO public.poll_options (poll_id, text, position) VALUES
(@poll1_id, 'JavaScript', 0),
(@poll1_id, 'TypeScript', 1),
(@poll1_id, 'Python', 2),
(@poll1_id, 'Go', 3),
(@poll1_id, 'Rust', 4);

-- Insert poll options for Meeting Time poll
INSERT INTO public.poll_options (poll_id, text, position) VALUES
(@poll2_id, '9:00 AM', 0),
(@poll2_id, '11:00 AM', 1),
(@poll2_id, '2:00 PM', 2),
(@poll2_id, '4:00 PM', 3);

-- Insert poll options for Lunch poll
INSERT INTO public.poll_options (poll_id, text, position) VALUES
(@poll3_id, 'Pizza', 0),
(@poll3_id, 'Sushi', 1),
(@poll3_id, 'Mexican', 2),
(@poll3_id, 'Italian', 3),
(@poll3_id, 'Healthy/Salads', 4),
(@poll3_id, 'Burgers', 5);

*/

-- Function to create sample poll (for development use)
CREATE OR REPLACE FUNCTION public.create_sample_poll(
  creator_id UUID,
  poll_title TEXT,
  poll_description TEXT,
  options TEXT[],
  allow_multiple BOOLEAN DEFAULT false,
  expires_in_days INTEGER DEFAULT 30
)
RETURNS UUID AS $$
DECLARE
  new_poll_id UUID;
  option_text TEXT;
  i INTEGER := 0;
BEGIN
  -- Insert the poll
  INSERT INTO public.polls (title, description, created_by, allow_multiple_votes, expires_at)
  VALUES (
    poll_title,
    poll_description,
    creator_id,
    allow_multiple,
    CASE 
      WHEN expires_in_days > 0 THEN NOW() + (expires_in_days || ' days')::INTERVAL
      ELSE NULL
    END
  )
  RETURNING id INTO new_poll_id;
  
  -- Insert the options
  FOREACH option_text IN ARRAY options
  LOOP
    INSERT INTO public.poll_options (poll_id, text, position)
    VALUES (new_poll_id, option_text, i);
    i := i + 1;
  END LOOP;
  
  RETURN new_poll_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to simulate votes for development (use with caution)
CREATE OR REPLACE FUNCTION public.simulate_votes_for_poll(
  target_poll_id UUID,
  voter_id UUID,
  num_votes INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  option_record RECORD;
  vote_count INTEGER := 0;
BEGIN
  -- Get random options from the poll
  FOR option_record IN 
    SELECT id FROM public.poll_options 
    WHERE poll_id = target_poll_id 
    ORDER BY RANDOM() 
    LIMIT num_votes
  LOOP
    BEGIN
      INSERT INTO public.votes (poll_id, option_id, user_id)
      VALUES (target_poll_id, option_record.id, voter_id);
      vote_count := vote_count + 1;
    EXCEPTION 
      WHEN unique_violation THEN
        -- Skip if already voted for this option
        CONTINUE;
    END;
  END LOOP;
  
  RETURN vote_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;