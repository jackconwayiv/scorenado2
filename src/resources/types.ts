import { SupabaseClient } from "@supabase/supabase-js";

type supabaseType = SupabaseClient<any, "public", any>;
export default supabaseType;
