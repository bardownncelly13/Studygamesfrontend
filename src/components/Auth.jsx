import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "../context/Authcontext";
import supabase from "../databaseClient";

export default function AuthToggle() {
  const { user, logout } = useAuth();

  return (
    <div>
      <div className="bg-[#101030] p-6 rounded-lg shadow-lg shadow-[0_0_20px_rgba(206,206,251,0.6)] w-full max-w-md">
        {user ? (
          <div className="text-white text-center">
            <p className="mb-4">Logged in as {user.email}</p>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            theme="dark"
          />
        )}
      </div>
    </div>
  );
}
