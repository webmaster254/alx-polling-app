-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to tables that need them
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_polls
  BEFORE UPDATE ON public.polls
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update vote counts when votes are added/removed
CREATE OR REPLACE FUNCTION public.update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    -- Update poll_option votes_count
    UPDATE public.poll_options 
    SET votes_count = votes_count + 1
    WHERE id = NEW.option_id;
    
    -- Update poll total_votes
    UPDATE public.polls 
    SET total_votes = total_votes + 1
    WHERE id = NEW.poll_id;
    
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    -- Update poll_option votes_count
    UPDATE public.poll_options 
    SET votes_count = votes_count - 1
    WHERE id = OLD.option_id;
    
    -- Update poll total_votes
    UPDATE public.polls 
    SET total_votes = total_votes - 1
    WHERE id = OLD.poll_id;
    
    RETURN OLD;
  END IF;
  
  -- Handle UPDATE (when user changes their vote)
  IF TG_OP = 'UPDATE' THEN
    -- Decrease count for old option
    UPDATE public.poll_options 
    SET votes_count = votes_count - 1
    WHERE id = OLD.option_id;
    
    -- Increase count for new option
    UPDATE public.poll_options 
    SET votes_count = votes_count + 1
    WHERE id = NEW.option_id;
    
    -- Total votes for poll doesn't change in this case
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update vote counts
CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT OR DELETE OR UPDATE OF option_id ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_vote_counts();

-- Function to check if user can vote (respects single/multiple vote settings)
CREATE OR REPLACE FUNCTION public.can_user_vote(poll_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  poll_record public.polls;
  existing_votes_count INTEGER;
BEGIN
  -- Get poll details
  SELECT * INTO poll_record FROM public.polls WHERE id = poll_uuid;
  
  -- Check if poll exists and is active
  IF poll_record IS NULL OR NOT poll_record.is_active THEN
    RETURN FALSE;
  END IF;
  
  -- Check if poll has expired
  IF poll_record.expires_at IS NOT NULL AND poll_record.expires_at <= NOW() THEN
    RETURN FALSE;
  END IF;
  
  -- If multiple votes are allowed, user can always vote
  IF poll_record.allow_multiple_votes THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has already voted
  SELECT COUNT(*) INTO existing_votes_count 
  FROM public.votes 
  WHERE poll_id = poll_uuid AND user_id = user_uuid;
  
  RETURN existing_votes_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get poll results with vote percentages
CREATE OR REPLACE FUNCTION public.get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  option_position INTEGER,
  votes_count INTEGER,
  percentage NUMERIC(5,2)
) AS $$
DECLARE
  total_votes INTEGER;
BEGIN
  -- Get total votes for the poll
  SELECT COALESCE(p.total_votes, 0) INTO total_votes
  FROM public.polls p
  WHERE p.id = poll_uuid;
  
  RETURN QUERY
  SELECT 
    po.id,
    po.text,
    po.position,
    po.votes_count,
    CASE 
      WHEN total_votes > 0 THEN ROUND((po.votes_count::NUMERIC / total_votes::NUMERIC) * 100, 2)
      ELSE 0::NUMERIC(5,2)
    END
  FROM public.poll_options po
  WHERE po.poll_id = poll_uuid
  ORDER BY po.position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate vote before insertion (used in app logic)
CREATE OR REPLACE FUNCTION public.validate_and_cast_vote(
  poll_uuid UUID, 
  option_uuid UUID, 
  user_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  poll_record public.polls;
  option_record public.poll_options;
  existing_votes_count INTEGER;
BEGIN
  -- Check if user can vote
  IF NOT public.can_user_vote(poll_uuid, user_uuid) THEN
    RAISE EXCEPTION 'User cannot vote on this poll';
  END IF;
  
  -- Verify option belongs to poll
  SELECT COUNT(*) INTO existing_votes_count
  FROM public.poll_options 
  WHERE id = option_uuid AND poll_id = poll_uuid;
  
  IF existing_votes_count = 0 THEN
    RAISE EXCEPTION 'Option does not belong to this poll';
  END IF;
  
  -- Insert the vote
  INSERT INTO public.votes (poll_id, option_id, user_id)
  VALUES (poll_uuid, option_uuid, user_uuid);
  
  RETURN TRUE;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'User has already voted for this option';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error casting vote: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;