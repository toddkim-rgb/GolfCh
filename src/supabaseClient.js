import { createClient } from "@supabase/supabase-js";

// 골술년 챌린지보드 — 클라우드 DB(Supabase) 연결
// app_data 테이블(key text PK, value jsonb)에 players/courses/rounds/handicaps/schedules 저장
const SUPABASE_URL = "https://ehkwflvymrazsiqwmmhs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kGfcBJHpl_TDmCYWUkMPxA_TVvQYeZG";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const APP_DATA_TABLE = "app_data";
