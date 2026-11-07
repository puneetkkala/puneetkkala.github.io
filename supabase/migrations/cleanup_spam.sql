-- ============================================================
-- cleanup_spam.sql
-- Safe cleanup script for spam and test records in Supabase
-- Run this script in the Supabase SQL Editor
-- ============================================================

-- 1. Remove obvious bot and test submissions from orders table
DELETE FROM public.orders 
WHERE client_email ILIKE '%test@berlinmobilelabs.de%'
   OR client_email ILIKE '%@powerdesigninc.us%'
   OR client_name ILIKE '%Ujthzdab%'
   OR client_name ILIKE '%Verification Test%'
   OR LENGTH(billing_address) < 8;

-- 2. Remove bot submissions from service_orders table (if populated by legacy/intake forms)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_orders') THEN
    DELETE FROM public.service_orders 
    WHERE email ILIKE '%test@berlinmobilelabs.de%'
       OR email ILIKE '%@powerdesigninc.us%'
       OR company_name ILIKE '%Ujthzdab%'
       OR company_name ILIKE '%Verification Test%'
       OR LENGTH(billing_address) < 8;
  END IF;
END $$;

-- 3. Remove spam inquiries from contact_messages
DELETE FROM public.contact_messages 
WHERE email ILIKE '%@powerdesigninc.us%'
   OR email ILIKE '%test@berlinmobilelabs.de%'
   OR name ILIKE '%Ujthzdab%'
   OR message ILIKE '%http%hnyjxf.com%';

-- ============================================================
-- Note for Supabase Auth Users:
-- Please execute deletion of unverified spam user accounts manually 
-- in the Supabase Dashboard under:
-- Authentication -> Users
-- 
-- Recommended Procedure:
-- 1. Filter or search by unverified email addresses or recent bot patterns.
-- 2. CAUTION: Ensure you do NOT delete genuine admin or member accounts.
-- 3. To prevent recurring auth spam, enable Turnstile Captcha:
--    Supabase Dashboard -> Authentication -> Attack Protection -> Enable Captcha
-- ============================================================
