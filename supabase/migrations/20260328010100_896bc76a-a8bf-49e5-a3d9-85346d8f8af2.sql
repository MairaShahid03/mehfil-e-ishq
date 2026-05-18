
-- Add email and flowers columns to bookings
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS flowers text[];
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS services text[];
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS custom_theme text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination_city text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS venue_preference text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS sub_categories text[];

-- Add email to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_note text,
  meeting_date timestamp with time zone,
  meeting_location text,
  status text DEFAULT 'pending',
  user_response text,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- RLS for bookings: users can read own, admins can read all
CREATE POLICY "Users can view own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND status = 'pending');

-- RLS for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- RLS for meetings
CREATE POLICY "Users can view own meetings" ON public.meetings
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON public.meetings
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS for categories and subcategories (public read)
CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read subcategories" ON public.subcategories
  FOR SELECT USING (true);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
