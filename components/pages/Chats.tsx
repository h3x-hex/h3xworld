import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Search, Send, MoreVertical, Phone, Video, PaperclipIcon, Home, Globe, Bell, User, Plus, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Chats = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [selectedChat, setSelectedChat] = useState<number | null>(isMobile ? null : 1);
  const [newMessage, setNewMessage] = useState("");

  const chatList = [
    {
      id: 1,
      name: "Sarah Chen",
      username: "@sarahdesigns",
      lastMessage: "Hey! I loved your latest design. Could we collaborate?",
      time: "2m ago",
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: "Alex Rivera",
      username: "@alexcodes",
      lastMessage: "Thanks for the feedback on the project!",
      time: "1h ago",
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: "Maya Thompson",
      username: "@mayacreates",
      lastMessage: "The portfolio looks amazing! 🎨",
      time: "3h ago",
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: "David Kim",
      username: "@davidcodes",
      lastMessage: "Can you send me the files?",
      time: "1d ago",
      unread: 0,
      online: false
    },
    {
      id: 5,
      name: "Luna Rodriguez",
      username: "@lunashots",
      lastMessage: "Meeting confirmed for tomorrow at 3 PM",
      time: "2d ago",
      unread: 0,
      online: true
    }
  ];

  const messages = selectedChat === 1 ? [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hey Ronald! I saw your latest UI design on your profile.",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      content: "Thanks Sarah! I'm glad you liked it. Took me a while to get the color scheme right.",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "The gradients are perfect! I'm working on a similar project. Would you be interested in collaborating?",
      time: "10:35 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "You",
      content: "Absolutely! I'd love to hear more about your project.",
      time: "10:37 AM",
      isMe: true
    },
    {
      id: 5,
      sender: "Sarah Chen",
      content: "Hey! I loved your latest design. Could we collaborate?",
      time: "Just now",
      isMe: false
    }
  ] : [];

  const selectedChatData = chatList.find(chat => chat.id === selectedChat);

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
          if (id === "explore") navigate("/explore");
          if (id === "notifications") navigate("/notifications");
          if (id === "dashboard") navigate("/dashboard");
        }} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4">
        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">
          
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <MessageCircle className="w-6 sm:w-8 h-6 sm:h-8 text-creator-gold" />
              Messages
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Connect with your creative community</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[calc(100vh-250px)]">
            {/* Chat List - Show on mobile when no chat selected, or always on desktop */}
            {(!isMobile || !selectedChat) && (
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Search messages..." 
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {chatList.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className={`w-full p-4 text-left hover:bg-muted/20 border-b border-border transition-colors ${
                          selectedChat === chat.id ? 'bg-creator-gold/10 border-r-2 border-r-creator-gold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-creator-gold/20 rounded-full flex items-center justify-center">
                              <span className="text-creator-gold font-semibold text-sm">
                                {chat.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            {chat.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground truncate">{chat.name}</p>
                              <span className="text-xs text-muted-foreground">{chat.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unread > 0 && (
                            <Badge variant="destructive" className="bg-red-500 text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Chat Window - Show on mobile when chat selected, or always on desktop */}
            {(!isMobile || selectedChat) && (
              <div className={isMobile ? "col-span-1" : "lg:col-span-2"}>
              {selectedChat ? (
                <Card className="bg-gradient-card border-border h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button for mobile */}
                        {isMobile && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedChat(null)}
                            className="p-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </Button>
                        )}
                        <div className="relative">
                          <div className="w-10 h-10 bg-creator-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-creator-gold font-semibold text-sm">
                              {selectedChatData?.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {selectedChatData?.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{selectedChatData?.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedChatData?.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isMe
                                ? 'bg-creator-gold text-background'
                                : 'bg-muted/20 text-foreground'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.isMe ? 'text-background/70' : 'text-muted-foreground'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <PaperclipIcon className="w-4 h-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            // Handle send message
                            setNewMessage("");
                          }
                        }}
                      />
                      <Button 
                        className="bg-creator-gold text-background hover:bg-creator-gold/90"
                        onClick={() => setNewMessage("")}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="bg-gradient-card border-border h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-creator-gold mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
                  </div>
                </Card>
              )}
              </div>
            )}
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

export default Chats;