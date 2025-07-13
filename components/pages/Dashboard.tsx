import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Heart, 
  MessageCircle,
  Download,
  Star,
  Calendar,
  BarChart3,
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalViews: 12540,
    totalFollowers: 888,
    totalEarnings: 2340,
    totalLikes: 4567,
    monthlyGrowth: 23.5,
    engagementRate: 4.8
  };

  const recentPosts = [
    {
      id: 1,
      title: "Modern UI Design Concept",
      type: "Post",
      views: 245,
      likes: 89,
      comments: 12,
      earnings: 45.50,
      date: "2 days ago"
    },
    {
      id: 2,
      title: "The Future of AI in Design",
      type: "Blog",
      views: 567,
      likes: 134,
      comments: 28,
      earnings: 89.25,
      date: "5 days ago"
    },
    {
      id: 3,
      title: "Digital Art Collection",
      type: "Portfolio",
      views: 189,
      likes: 67,
      comments: 8,
      earnings: 125.00,
      date: "1 week ago"
    }
  ];

  const topPerformingContent = [
    { title: "UI/UX Design Masterclass", views: 1240, type: "Video" },
    { title: "Color Theory Guide", views: 980, type: "Blog" },
    { title: "Modern Logo Pack", views: 756, type: "Product" },
    { title: "Design System Templates", views: 634, type: "Portfolio" }
  ];

  const upcomingMeetings = [
    { client: "Sarah Chen", type: "Design Consultation", date: "Today, 3:00 PM", rate: "$75/hr" },
    { client: "Alex Rivera", type: "Code Review", date: "Tomorrow, 10:00 AM", rate: "$100/hr" },
    { client: "Maya Thompson", type: "Portfolio Review", date: "Wed, 2:00 PM", rate: "$60/hr" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Left Sidebar */}
      <div className="fixed top-0 left-0 z-30">
        <Sidebar onNavigate={(id) => {
          if (id === "home") navigate("/");
          if (id === "profile") navigate("/profile");
          if (id === "explore") navigate("/explore");
          if (id === "notifications") navigate("/notifications");
          if (id === "chats") navigate("/chats");
        }} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex ml-20 md:ml-72 pt-0">
        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-creator-gold" />
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground">Track your performance and manage your creative business</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-creator-gold" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+{stats.monthlyGrowth}% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalFollowers}</p>
                  </div>
                  <Users className="w-8 h-8 text-creator-gold" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Engagement Rate: {stats.engagementRate}%</p>
                  <Progress value={stats.engagementRate * 20} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold text-foreground">${stats.totalEarnings}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-creator-gold" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-green-500">+$234 this week</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalLikes.toLocaleString()}</p>
                  </div>
                  <Heart className="w-8 h-8 text-creator-gold" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Avg. 89 likes per post</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Posts Performance */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-creator-gold" />
                  Recent Posts Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{post.title}</h4>
                        <Badge variant="outline">{post.type}</Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-medium text-foreground">{post.views}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Likes</p>
                          <p className="font-medium text-foreground">{post.likes}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Comments</p>
                          <p className="font-medium text-foreground">{post.comments}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Earnings</p>
                          <p className="font-medium text-creator-gold">${post.earnings}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{post.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-creator-gold" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingContent.map((content, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-creator-gold/20 rounded-full flex items-center justify-center">
                          <span className="text-creator-gold font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{content.title}</p>
                          <p className="text-sm text-muted-foreground">{content.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{content.views}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Meetings */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-creator-gold" />
                  Upcoming Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeetings.map((meeting, index) => (
                    <div key={index} className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{meeting.client}</p>
                        <Badge variant="outline" className="text-xs">{meeting.rate}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{meeting.type}</p>
                      <p className="text-sm text-creator-gold">{meeting.date}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Meetings
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-creator-gold text-background hover:bg-creator-gold/90"
                    onClick={() => navigate("/create")}
                  >
                    Create New Content
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Analytics Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    Manage H3Xclusive Tiers
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Targets */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-creator-gold" />
                  Goals & Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Monthly Followers</span>
                      <span className="text-sm text-muted-foreground">888/1000</span>
                    </div>
                    <Progress value={88.8} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Monthly Earnings</span>
                      <span className="text-sm text-muted-foreground">$2,340/$3,000</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-foreground">Content Posts</span>
                      <span className="text-sm text-muted-foreground">18/25</span>
                    </div>
                    <Progress value={72} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on large screens */}
        <div className="hidden xl:block sticky top-4 h-screen overflow-y-auto">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;