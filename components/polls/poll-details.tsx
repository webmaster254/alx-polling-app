"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Users, User } from "lucide-react";

interface PollDetailsProps {
  pollId: string;
}

// Mock data - replace with actual data fetching
const mockPoll = {
  id: "1",
  title: "Favorite Programming Language",
  description: "Which programming language do you prefer for web development? This poll will help us understand the community preferences.",
  options: [
    { id: "1", text: "JavaScript", votes: 125, percentage: 51 },
    { id: "2", text: "TypeScript", votes: 78, percentage: 32 },
    { id: "3", text: "Python", votes: 32, percentage: 13 },
    { id: "4", text: "Go", votes: 10, percentage: 4 },
  ],
  totalVotes: 245,
  createdAt: new Date("2024-01-15"),
  createdBy: "john_dev",
  isActive: true,
  allowMultipleVotes: false,
  expiresAt: new Date("2024-02-15"),
};

export function PollDetails({ pollId }: PollDetailsProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleOptionChange = (optionId: string) => {
    if (mockPoll.allowMultipleVotes) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleVote = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsVoting(true);
    // TODO: Implement voting logic
    console.log("Voting for options:", selectedOptions);
    
    setTimeout(() => {
      setHasVoted(true);
      setIsVoting(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={mockPoll.isActive ? "default" : "secondary"}>
              {mockPoll.isActive ? "Active" : "Closed"}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {mockPoll.createdBy}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {mockPoll.createdAt.toLocaleDateString()}
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl">{mockPoll.title}</CardTitle>
          <CardDescription className="text-base">
            {mockPoll.description}
          </CardDescription>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {mockPoll.totalVotes} total votes
            </div>
            {mockPoll.expiresAt && (
              <div>
                Expires: {mockPoll.expiresAt.toLocaleDateString()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {mockPoll.options.map((option) => (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {!hasVoted && mockPoll.isActive && (
                      <Checkbox
                        id={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleOptionChange(option.id)}
                      />
                    )}
                    <label 
                      htmlFor={option.id} 
                      className={`font-medium ${!hasVoted && mockPoll.isActive ? 'cursor-pointer' : ''}`}
                    >
                      {option.text}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{option.percentage}%</span>
                    <span className="text-sm text-muted-foreground">({option.votes})</span>
                  </div>
                </div>
                <Progress value={option.percentage} className="h-2" />
              </div>
            ))}
          </div>

          {!hasVoted && mockPoll.isActive && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {mockPoll.allowMultipleVotes 
                  ? "You can select multiple options" 
                  : "Select one option to vote"
                }
              </p>
              <Button 
                onClick={handleVote} 
                disabled={selectedOptions.length === 0 || isVoting}
              >
                {isVoting ? "Voting..." : "Cast Vote"}
              </Button>
            </div>
          )}

          {hasVoted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Thank you for voting! Your vote has been recorded.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}