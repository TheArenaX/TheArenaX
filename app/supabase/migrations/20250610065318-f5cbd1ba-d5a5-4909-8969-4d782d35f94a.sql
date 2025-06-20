
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,
  email TEXT,
  wallet_balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  game TEXT NOT NULL,
  description TEXT,
  entry_fee INTEGER NOT NULL,
  prize_pool INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournament_participants table
CREATE TABLE public.tournament_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

-- Create wallet_transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  description TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Tournaments policies
CREATE POLICY "Anyone can view tournaments" ON public.tournaments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Tournament creators can update their tournaments" ON public.tournaments
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Tournament creators can delete their tournaments" ON public.tournaments
  FOR DELETE USING (auth.uid() = created_by);

-- Tournament participants policies
CREATE POLICY "Users can view tournament participants" ON public.tournament_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join tournaments" ON public.tournament_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tournaments they joined" ON public.tournament_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update tournament participant count
CREATE OR REPLACE FUNCTION public.update_tournament_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tournaments 
    SET current_participants = current_participants + 1,
        status = CASE 
          WHEN current_participants + 1 >= max_participants THEN 'full'
          ELSE status
        END
    WHERE id = NEW.tournament_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tournaments 
    SET current_participants = current_participants - 1,
        status = CASE 
          WHEN current_participants - 1 < max_participants AND status = 'full' THEN 'open'
          ELSE status
        END
    WHERE id = OLD.tournament_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for tournament participant count
CREATE TRIGGER tournament_participants_count_insert
  AFTER INSERT ON public.tournament_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_tournament_participants();

CREATE TRIGGER tournament_participants_count_delete
  AFTER DELETE ON public.tournament_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_tournament_participants();

-- Enable realtime for all tables
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.tournaments REPLICA IDENTITY FULL;
ALTER TABLE public.tournament_participants REPLICA IDENTITY FULL;
ALTER TABLE public.wallet_transactions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tournament_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;
