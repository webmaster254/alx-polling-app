import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Vote, Plus, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Vote className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Create & Participate in
          <span className="text-primary block">Community Polls</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Build engaging polls, gather opinions, and make data-driven decisions 
          with our intuitive polling platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/polls">
              <TrendingUp className="h-4 w-4 mr-2" />
              Browse Polls
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/create-poll">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <Vote className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Easy Poll Creation</CardTitle>
            <CardDescription>
              Create polls in minutes with our intuitive interface. Add multiple options, 
              set expiration dates, and customize voting rules.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Real-time Results</CardTitle>
            <CardDescription>
              Watch results update in real-time as votes come in. Get instant feedback 
              and insights from your community.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Community Driven</CardTitle>
            <CardDescription>
              Join a community of poll creators and voters. Participate in discussions 
              and help shape decisions together.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary/5">
        <CardContent className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of users who are already creating and participating in polls.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">
              Get Started Free
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
