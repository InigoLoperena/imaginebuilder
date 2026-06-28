CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'ambassador',
    'premium_ambassador',
    'admin'
);


--
-- Name: handle_new_ambassador(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_ambassador() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'ambassador');
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: ambassador_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ambassador_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    nickname text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    full_name text
);


--
-- Name: store_submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ambassador_id uuid NOT NULL,
    store_name text NOT NULL,
    store_url text NOT NULL,
    city text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    admin_notes text,
    commission_amount numeric(10,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    approved_at timestamp with time zone,
    approved_by uuid,
    CONSTRAINT store_submissions_status_check CHECK ((status = ANY (ARRAY['submitted'::text, 'confirmed'::text, 'rejected'::text])))
);


--
-- Name: ambassador_leaderboard; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.ambassador_leaderboard WITH (security_invoker='true') AS
 SELECT ap.nickname,
    count(ss.id) AS stores_count,
    COALESCE(sum(ss.commission_amount), (0)::numeric) AS total_earned
   FROM (public.ambassador_profiles ap
     LEFT JOIN public.store_submissions ss ON (((ap.user_id = ss.ambassador_id) AND (ss.status = 'confirmed'::text))))
  GROUP BY ap.user_id, ap.nickname
 HAVING (count(
        CASE
            WHEN (ss.status = 'confirmed'::text) THEN 1
            ELSE NULL::integer
        END) > 0)
  ORDER BY COALESCE(sum(ss.commission_amount), (0)::numeric) DESC, (count(ss.id)) DESC;


--
-- Name: bank_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bank_accounts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    account_holder_name text NOT NULL,
    bank_name text,
    account_number text NOT NULL,
    routing_number text NOT NULL,
    account_type text DEFAULT 'checking'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waitlist (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ambassador_profiles ambassador_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_profiles
    ADD CONSTRAINT ambassador_profiles_pkey PRIMARY KEY (id);


--
-- Name: ambassador_profiles ambassador_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_profiles
    ADD CONSTRAINT ambassador_profiles_user_id_key UNIQUE (user_id);


--
-- Name: bank_accounts bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: bank_accounts bank_accounts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_user_id_key UNIQUE (user_id);


--
-- Name: store_submissions store_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_submissions
    ADD CONSTRAINT store_submissions_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: waitlist waitlist_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_email_key UNIQUE (email);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: ambassador_profiles on_ambassador_profile_created; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_ambassador_profile_created AFTER INSERT ON public.ambassador_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_new_ambassador();


--
-- Name: ambassador_profiles update_ambassador_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_ambassador_profiles_updated_at BEFORE UPDATE ON public.ambassador_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: bank_accounts update_bank_accounts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: store_submissions update_store_submissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_store_submissions_updated_at BEFORE UPDATE ON public.store_submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: ambassador_profiles ambassador_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ambassador_profiles
    ADD CONSTRAINT ambassador_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: bank_accounts bank_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: store_submissions store_submissions_ambassador_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_submissions
    ADD CONSTRAINT store_submissions_ambassador_id_fkey FOREIGN KEY (ambassador_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: store_submissions store_submissions_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_submissions
    ADD CONSTRAINT store_submissions_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can manage all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: store_submissions Admins can update all submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all submissions" ON public.store_submissions FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: store_submissions Admins can view all submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all submissions" ON public.store_submissions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: store_submissions Ambassadors can create submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ambassadors can create submissions" ON public.store_submissions FOR INSERT WITH CHECK ((auth.uid() = ambassador_id));


--
-- Name: store_submissions Ambassadors can view their own submissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ambassadors can view their own submissions" ON public.store_submissions FOR SELECT USING ((auth.uid() = ambassador_id));


--
-- Name: waitlist Anyone can insert to waitlist; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can insert to waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);


--
-- Name: ambassador_profiles Anyone can view ambassador nicknames for leaderboard; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view ambassador nicknames for leaderboard" ON public.ambassador_profiles FOR SELECT USING (true);


--
-- Name: store_submissions Anyone can view confirmed submissions for leaderboard; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view confirmed submissions for leaderboard" ON public.store_submissions FOR SELECT USING ((status = 'confirmed'::text));


--
-- Name: ambassador_profiles Users can create their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own profile" ON public.ambassador_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bank_accounts Users can delete their own bank account; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own bank account" ON public.bank_accounts FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: bank_accounts Users can insert their own bank account; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own bank account" ON public.bank_accounts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: bank_accounts Users can update their own bank account; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own bank account" ON public.bank_accounts FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: ambassador_profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.ambassador_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: bank_accounts Users can view their own bank account; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own bank account" ON public.bank_accounts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ambassador_profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.ambassador_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: ambassador_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ambassador_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: bank_accounts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

--
-- Name: store_submissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.store_submissions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: waitlist; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


