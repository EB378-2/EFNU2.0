import type { AuthProvider } from "@refinedev/core";
import { createSupabaseServerClient } from "@utils/supabase/server";

export const authProviderServer: Pick<AuthProvider, "check" | "getPermissions"> = {
  check: async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    const { user } = data;

    if (error) {
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }

    if (user) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const supabase = await createSupabaseServerClient();
    try {
        const { error } = await supabase.auth.getUser();

        if (error) {
            console.error(error);
            return;
        }

        const role = localStorage.getItem("user-role");
          if (role) return role;

        // fallback in case localStorage is empty
        const { data } = await supabase.rpc("get_my_claim", { claim: "role" });
          if (data) localStorage.setItem("user-role", data);
        return data;
    } catch (error: any) {
        console.error(error);
        return;
    }
  },
};