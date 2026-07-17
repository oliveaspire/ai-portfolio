import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    // If there's no token in the URL (e.g. user pressed back to reach this page),
    // immediately redirect to /login — do NOT re-authenticate.
    if (!token) {
      // replace: true removes /auth/callback from history so back works correctly
      navigate({ to: "/login", replace: true });
      return;
    }

    try {
      // Validate token format (throws if malformed)
      jwtDecode(token);

      // Save to localStorage
      localStorage.setItem("admin_token", token);
      if (refreshToken) {
        localStorage.setItem("admin_refresh_token", refreshToken);
      }

      // IMPORTANT: replace: true removes /auth/callback?token=... from history.
      // Without this, pressing Back from /admin would return to this page,
      // re-read the token from the URL, and re-authenticate — bypassing logout.
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      console.error("Invalid token received:", err);
      setError("Authentication failed. Invalid token received from server.");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-destructive bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="mb-2 text-xl font-bold">Authentication Error</h2>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => navigate({ to: "/login", replace: true })}
            className="mt-6 rounded bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4">
      <Loader2 className="mb-4 h-8 w-8 animate-spin text-terminal" />
      <p className="text-terminal text-glow">Authenticating...</p>
      <p className="mt-2 text-xs text-muted-foreground">Please wait while we log you in</p>
    </div>
  );
}
