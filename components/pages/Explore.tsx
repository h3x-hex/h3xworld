import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Hash, Globe, Star, Home, Bell, MessageCircle, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Explore = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const trendingTopics = [
    { tag: "DigitalArt", posts: 1240 },
    { tag: "WebDesign", posts: 890 },
    { tag: "Photography", posts: 2100 },
    { tag: "AI", posts: 567 },
    { tag: "Crypto", posts: 445 }
  ];

  const featuredCreators = [
    { name: "Emma Wilson", username: "@emmacreates", followers: "12.5K", category: "Digital Artist" },
    { name: "David Kim", username: "@davidcodes", followers: "8.9K", category: "Developer" },
    { name: "Luna Rodriguez", username: "@lunashots", followers: "15.2K", category: "Photographer" },
    { name: "Alex Chen", username: "@alexdesigns", followers: "6.7K", category: "UI/UX Designer" }
  ];

  const discoverPosts = [
    {
      id: 1,
      title: "10 AI Tools Every Designer Should Know",
      author: "Tech Insights",
      category: "Technology",
      views: "2.3K",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      title: "The Future of Web3 Creative Platforms",
      author: "Crypto Weekly",
      category: "Blockchain",
      views: "1.8K",
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      title: "Minimalist Design Trends 2024",
      author: "Design Hub",
      category: "Design",
      views: "4.1K",
      image: "/placeholder.svg?height=200&width=300"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Navigation - Only visible on mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img 
              src="/lovable-uploads/48586265-3684-407a-8713-158398a6bee7.png" 
              alt="H3X World Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 pl-9 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-creator-gold/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Chat Button */}
          <button 
            onClick={() => navigate("/chats")}
            className="p-2 hover:bg-creator-gold/10 rounded-lg transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-6 h-6 text-creator-gold" />
          </button>
        </div>
      </div>

      {/* Fixed Left Sidebar - Hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-0 z-30">
        <Sidebar onNavigate={(id) => {
          if (id === "home") navigate("/");
          if (id === "profile") navigate("/profile");
          if (id === "notifications") navigate("/notifications");
          if (id === "chats") navigate("/chats");
          if (id === "dashboard") navigate("/dashboard");
        }} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4">
        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">
          
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Explore</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Discover new creators, trending content, and inspiration</p>
          </div>

          {/* Search Bar - Hidden on mobile since it's in top nav */}
          <div className="hidden md:block">{" "}
            <Card className="bg-gradient-card border-border mb-6">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    placeholder="Search creators, content, or topics..." 
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content Column */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Trending Topics */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-creator-gold" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {trendingTopics.map((topic) => (
                      <Badge 
                        key={topic.tag}
                        variant="outline" 
                        className="px-4 py-2 text-sm border-creator-gold/30 hover:bg-creator-gold/10 cursor-pointer"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {topic.tag}
                        <span className="ml-2 text-muted-foreground">({topic.posts})</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Discover Content */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-creator-gold" />
                    Discover Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {discoverPosts.map((post) => (
                      <div key={post.id} className="group cursor-pointer">
                        <div className="bg-muted/20 rounded-lg overflow-hidden border border-border hover:border-creator-gold/50 transition-colors">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="p-4">
                            <h3 className="font-medium text-foreground mb-2 group-hover:text-creator-gold transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{post.author}</span>
                              <span>{post.views} views</span>
                            </div>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Featured Creators */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-creator-gold" />
                    Featured Creators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featuredCreators.map((creator) => (
                      <div key={creator.username} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-creator-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-creator-gold font-semibold text-sm">
                              {creator.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{creator.name}</p>
                            <p className="text-xs text-muted-foreground">{creator.username}</p>
                            <p className="text-xs text-creator-gold">{creator.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{creator.followers}</p>
                          <Button size="sm" variant="outline" className="text-xs mt-1">
                            Follow
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Art & Design", "Technology", "Photography", "Music", "Writing", "Gaming", "Business", "Education"].map((category) => (
                      <button 
                        key={category}
                        className="w-full text-left p-2 rounded-lg hover:bg-creator-gold/10 hover:text-creator-gold transition-colors text-sm"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile and tablet, visible on large screens */}
        <div className="hidden xl:block sticky top-4 h-screen overflow-y-auto">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="grid grid-cols-5 gap-1 p-2 items-center">
          {/* Home */}
          <button
            onClick={() => navigate("/home")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/home"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Home className="w-5 h-5" />
          </button>
          
          {/* Explore */}
          <button
            onClick={() => navigate("/explore")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/explore"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          {/* Create - Center button with special styling */}
          <button
            onClick={() => navigate("/create")}
            className="flex items-center justify-center w-20 h-12 bg-creator-gold text-black rounded-full hover:bg-creator-gold/90 transition-colors shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
          
          {/* Notifications */}
          <button
            onClick={() => navigate("/notifications")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/notifications"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              location.pathname === "/profile"
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;