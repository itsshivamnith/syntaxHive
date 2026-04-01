import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../ui/loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserResponse {
  user: User;
}

interface NavbarProps {
  data: UserResponse | undefined;
  signOutMutation: UseMutationResult<any, Error, void, unknown>;
  isLoading: boolean;
}

const SyntaxHiveLogo = () => (
  <svg viewBox="0 0 48 48" width="32" height="32" xmlns="http://www.w3.org/2000/svg" className="mr-3">
    <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="#7B2FBE" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="24" y="30" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="16" fontWeight="700" fill="#FFFFFF">SH</text>
  </svg>
);

const Navbar = ({ data, signOutMutation, isLoading }: NavbarProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 glass-nav rounded-2xl max-w-6xl mx-auto shadow-2xl transition-all duration-300">
        <Link to={"/"} className="flex justify-center items-center group">
          <SyntaxHiveLogo />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] group-hover:text-primary transition-colors">
            SyntaxHive
          </h1>
        </Link>

        {isLoading ? (
          <div className="text-[var(--text-secondary)]">
            <Loader className="fill-primary" />
          </div>
        ) : data?.user ? (
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative flex items-center justify-center w-12 h-7 rounded-full border border-[var(--hive-purple)] bg-transparent hover-scale transition-all"
                aria-label="Toggle Theme"
              >
                <Sun className={`absolute h-4 w-4 text-[var(--hive-yellow)] transition-all duration-300 ${theme === 'dark' ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`} />
                <Moon className={`absolute h-4 w-4 text-[var(--text-primary)] transition-all duration-300 ${theme === 'dark' ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`} />
              </button>
            )}
            <Button
              className="bg-transparent hover:bg-[var(--surface)] text-[var(--text-primary)] cursor-pointer border border-[var(--border)] rounded-lg px-6 transition-all"
              onClick={() => setOpen(true)}
              disabled={signOutMutation.isPending}
            >
              {signOutMutation.isPending ? "Disconnecting..." : "Disconnect"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative flex items-center justify-center w-12 h-7 rounded-full border border-[var(--hive-purple)] bg-transparent hover-scale transition-all"
                aria-label="Toggle Theme"
              >
                <Sun className={`absolute h-4 w-4 text-[var(--hive-yellow)] transition-all duration-300 ${theme === 'dark' ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'}`} />
                <Moon className={`absolute h-4 w-4 text-[var(--text-primary)] transition-all duration-300 ${theme === 'dark' ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'}`} />
              </button>
            )}
            <Link
              to={"signin"}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer font-medium transition-colors px-2"
            >
              Log in
            </Link>
            <Link
              to={"signup"}
              className="bg-primary hover:bg-[var(--accent-hover)] text-primary-foreground font-semibold cursor-pointer px-6 py-2 rounded-lg transition-all shadow-lg shadow-[var(--hive-purple)]/20 hover-scale"
            >
              Start Coding
            </Link>
          </div>
        )}
      </nav>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] glass-panel text-[var(--text-primary)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-primary font-mono text-xl">Terminate Session?</DialogTitle>
            <DialogDescription className="text-[var(--text-secondary)]">
              Are you sure you want to log out and disconnect from SyntaxHive?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              className="bg-[var(--surface)] hover:bg-[var(--border)] text-[var(--text-primary)] border-[var(--border)] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer shadow-lg shadow-destructive/20"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
