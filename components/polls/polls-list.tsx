"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, Users, Vote } from "lucide-react";

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: "1",
    title: "Favorite Programming Language",
    description: "Which programming language do you prefer for web development?",
    totalVotes: 245,
    options: ["JavaScript", "TypeScript", "Python", "Go"],
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "2",
    title: "Best Time for Team Meetings",
    description: "When should we schedule our weekly team meetings?",
    totalVotes: 89,
    options: ["9 AM", "11 AM", "2 PM", "4 PM"],
    createdAt: new Date("2024-01-12"),
    isActive: true,
  },
];

export function PollsList() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockPolls.map((poll) => (
        <Card key={poll.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant={poll.isActive ? "default" : "secondary"}>
                {poll.isActive ? "Active" : "Closed"}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {poll.createdAt.toLocaleDateString()}
              </div>
            </div>
            <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {poll.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-1" />
                {poll.totalVotes} votes
              </div>
              <div className="text-sm text-muted-foreground">
                {poll.options.length} options
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href={`/polls/${poll.id}`}>
                <Vote className="h-4 w-4 mr-2" />
                View Poll
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}