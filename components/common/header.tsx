"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Vote, User, LogIn, Plus, LogOut } from "lucide-react";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const isAuthenticated = !!user;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">PollApp</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/polls" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Polls
            </Link>
            {isAuthenticated && (
              <Link 
                href="/create-poll" 
                className="text-foreground hover:text-primary transition-colors"
              >
                Create Poll
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : isAuthenticated ? (
              <>
                <Button asChild className="hidden md:flex">
                  <Link href="/create-poll">
                    <Plus className="h-4 w-4 mr-2" />
                    New Poll
                  </Link>
                </Button>
                <span className="text-sm font-medium hidden md:block">
                  Welcome, {user.username}
                </span>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}