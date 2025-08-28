-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Polls policies
CREATE POLICY "Anyone can view active polls" ON public.polls
  FOR SELECT USING (
    is_active = true AND 
    (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Authenticated users can create polls" ON public.polls
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.uid() = created_by
  );

CREATE POLICY "Poll creators can update their own polls" ON public.polls
  FOR UPDATE USING (
    auth.uid() = created_by
  );

CREATE POLICY "Poll creators can delete their own polls" ON public.polls
  FOR DELETE USING (
    auth.uid() = created_by
  );

-- Poll options policies
CREATE POLICY "Anyone can view options for active polls" ON public.poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

CREATE POLICY "Poll creators can insert options for their polls" ON public.poll_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

CREATE POLICY "Poll creators can update options for their polls" ON public.poll_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

CREATE POLICY "Poll creators can delete options for their polls" ON public.poll_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Users can view votes for active polls" ON public.votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true
    ) OR 
    auth.uid() = user_id
  );

CREATE POLICY "Authenticated users can vote on active polls" ON public.votes
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

CREATE POLICY "Users can update their own votes" ON public.votes
  FOR UPDATE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );

CREATE POLICY "Users can delete their own votes" ON public.votes
  FOR DELETE USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.polls 
      WHERE polls.id = votes.poll_id 
      AND polls.is_active = true 
      AND (polls.expires_at IS NULL OR polls.expires_at > NOW())
    )
  );