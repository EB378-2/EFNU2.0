// /providers/auth-provider/auth-provider.server.ts
import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server";
import { cookies } from "next/headers";

export const authProviderServer: Pick<AuthProvider, "check" | "getPermissions"> = {
  check: async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    const { user } = data;

    if (error || !user) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },

  getPermissions: async () => {
    const role = cookies().get("user-role")?.value || "anonymous";
    return role;
  },
};