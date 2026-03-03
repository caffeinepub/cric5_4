import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, User, X } from "lucide-react";
import { useState } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setIsLoading(true);
    // Simulate a tiny async for UX
    setTimeout(() => {
      const success = login(username.trim(), password);
      setIsLoading(false);
      if (success) {
        setUsername("");
        setPassword("");
        onClose();
      } else {
        setError("Invalid username or password. Try player1 / pass123.");
      }
    }, 300);
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError("");
    onClose();
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: modal backdrop
    <div
      data-ocid="login.modal"
      className="fixed inset-0 z-[80] bg-black/70 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={cn(
          "bg-background border border-border w-full sm:max-w-sm",
          "rounded-t-2xl sm:rounded-2xl shadow-2xl",
          "flex flex-col",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Welcome back
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sign in to join contests and win prizes
            </p>
          </div>
          <button
            type="button"
            data-ocid="login.close_button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-username"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="login-username"
                type="text"
                data-ocid="login.username.input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Enter username"
                autoComplete="username"
                className={cn(
                  "w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm",
                  "bg-muted/30 text-foreground placeholder:text-muted-foreground",
                  "border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30",
                  "transition-colors",
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                data-ocid="login.password.input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                autoComplete="current-password"
                className={cn(
                  "w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm",
                  "bg-muted/30 text-foreground placeholder:text-muted-foreground",
                  "border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30",
                  "transition-colors",
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Hint */}
          <p className="text-[11px] text-muted-foreground text-center">
            Hint:{" "}
            <span className="font-mono text-foreground">player1 / pass123</span>{" "}
            or{" "}
            <span className="font-mono text-foreground">player2 / pass123</span>
          </p>

          {/* Submit */}
          <button
            type="submit"
            data-ocid="login.submit_button"
            disabled={isLoading}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-bold transition-all",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Safe area padding for mobile */}
        <div className="pb-2 sm:pb-0" />
      </div>
    </div>
  );
}
