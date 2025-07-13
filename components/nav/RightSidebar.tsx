import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { TrendingUp, Hash, UserPlus, Search } from "lucide-react";

const trendingTopics = [
  { tag: "#DigitalArt", posts: "45.2K posts" },
  { tag: "#NFT", posts: "23.8K posts" },
  { tag: "#CreativeDesign", posts: "18.5K posts" },
  { tag: "#ArtCommunity", posts: "12.3K posts" },
  { tag: "#Photography", posts: "9.7K posts" }
];

const suggestedUsers = [
  {
    username: "artcreator_23",
    displayName: "Sarah Chen",
    avatar: "/placeholder.svg",
    isVerified: true,
    followers: "2.3K"
  },
  {
    username: "designpro",
    displayName: "Mike Johnson",
    avatar: "/placeholder.svg",
    isVerified: false,
    followers: "1.8K"
  },
  {
    username: "photoart_studio",
    displayName: "Luna Studios",
    avatar: "/placeholder.svg",
    isVerified: true,
    followers: "5.2K"
  }
];

export const RightSidebar = () => {
  return (
    <div className="w-80 space-y-4 p-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search posts, users, tags..." 
          className="pl-10 bg-muted/50 border-border focus:border-creator-gold"
        />
      </div>
      {/* Trending Topics */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending for you
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={topic.tag}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-foreground flex items-center gap-1">
                    <Hash className="w-4 h-4 text-muted-foreground" />
                    {topic.tag.slice(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">{topic.posts}</div>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary-glow">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Who to Follow */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Who to follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.username} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-foreground truncate">{user.displayName}</p>
                    {user.isVerified && (
                      <Badge variant="secondary" className="text-xs px-1">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.followers} followers</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                Follow
              </Button>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-primary hover:text-primary-glow">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* What's Happening */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            What's happening
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="text-sm text-muted-foreground">Trending in Art</div>
            <div className="font-medium text-foreground">Digital Art Revolution</div>
            <div className="text-sm text-muted-foreground">15.2K posts</div>
          </div>
          <div className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="text-sm text-muted-foreground">Creative Community</div>
            <div className="font-medium text-foreground">New Creator Fund Launch</div>
            <div className="text-sm text-muted-foreground">8.9K discussing</div>
          </div>
          <div className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="text-sm text-muted-foreground">Technology</div>
            <div className="font-medium text-foreground">AI Art Tools Update</div>
            <div className="text-sm text-muted-foreground">12.4K posts</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};