
-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;

-- Admin policies for bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admin policies for meetings
CREATE POLICY "Admins can do everything with meetings" ON public.meetings
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admin policies for gallery (insert/update/delete)
CREATE POLICY "Admins can insert gallery" ON public.gallery
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update gallery" ON public.gallery
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete gallery" ON public.gallery
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
