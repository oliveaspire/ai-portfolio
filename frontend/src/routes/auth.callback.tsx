import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
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
    // Extract token from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (token) {
      try {
        // Validate token format (will throw if invalid)
        jwtDecode(token);
        
        // Save to localStorage
        localStorage.setItem("admin_token", token);
        
        // Redirect to admin
        navigate({ to: "/admin" });
      } catch (err) {
        console.error("Invalid token received:", err);
        setError("Authentication failed. Invalid token received from server.");
      }
    } else {
      setError("Authentication failed. No token received from server.");
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-lg border border-destructive bg-destructive/10 p-8 text-center text-destructive">
          <h2 className="mb-2 text-xl font-bold">Authentication Error</h2>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => navigate({ to: "/login" })}
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
