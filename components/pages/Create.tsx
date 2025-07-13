import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ImageIcon, 
  VideoIcon, 
  FileTextIcon, 
  MusicIcon,
  PlusIcon,
  XIcon,
  GlobeIcon,
  UsersIcon,
  LockIcon,
  BookOpenIcon,
  FolderIcon,
  ShoppingCartIcon,
  TagIcon,
  PackageIcon,
  BriefcaseIcon,
  StarIcon,
  CalendarIcon,
  LinkIcon,
  Search,
  MessageCircle,
  Home,
  Globe,
  Bell,
  User,
  Plus
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const contentCategories = [
  { 
    id: "content", 
    label: "Content", 
    description: "Posts and blogs",
    types: [
      { id: "post", label: "Post", icon: FileTextIcon, description: "Text or media post" },
      { id: "blog", label: "Blog", icon: BookOpenIcon, description: "Long-form article", needsThumbnail: true },
    ]
  },
  { 
    id: "links", 
    label: "Links", 
    description: "Share external links",
    types: [
      { id: "link", label: "Link", icon: LinkIcon, description: "Share external links" },
    ]
  },
  { 
    id: "portfolio", 
    label: "Portfolio", 
    description: "Showcase your work",
    types: [
      { id: "portfolio-item", label: "Portfolio Item", icon: FolderIcon, description: "Add to collection" },
      { id: "portfolio-collection", label: "Portfolio Collection", icon: PackageIcon, description: "Create new collection" },
    ]
  },
  { 
    id: "exclusive", 
    label: "H3Xclusive", 
    description: "Premium content tiers",
    types: [
      { id: "exclusive-content", label: "Exclusive Content", icon: StarIcon, description: "Add to tier" },
      { id: "exclusive-tier", label: "Exclusive Tier", icon: LockIcon, description: "Create new tier" },
    ]
  },
  { 
    id: "commerce", 
    label: "Commerce", 
    description: "Shop and marketplace",
    types: [
      { id: "product", label: "Product", icon: ShoppingCartIcon, description: "Physical or digital item" },
      { id: "shop-collection", label: "Shop Collection", icon: PackageIcon, description: "Group products" },
      { id: "shop-category", label: "Shop Category", icon: TagIcon, description: "Product category" },
    ]
  },
  { 
    id: "gigs", 
    label: "Gigs", 
    description: "Services and freelance",
    types: [
      { id: "gig", label: "Gig", icon: BriefcaseIcon, description: "Service offering" },
      { id: "meeting", label: "Meeting/Booking", icon: BookOpenIcon, description: "Schedule meetings or appointments" },
    ]
  }
];


const visibilityOptions = [
  { id: "public", label: "Public", icon: GlobeIcon, description: "Anyone can see" },
  { id: "followers", label: "Followers", icon: UsersIcon, description: "Only followers" },
  { id: "private", label: "Private", icon: LockIcon, description: "Only you" },
];

const mockPortfolioCollections = ["Web Design", "Photography", "Digital Art", "UI/UX"];
const mockExclusiveTiers = ["Basic Tier", "Premium Tier", "VIP Tier"];
const mockShopCollections = ["Digital Assets", "Physical Goods", "Limited Edition"];
const mockShopCategories = ["Design", "Photography", "Art", "Tools"];

const Create = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("content");
  const [selectedType, setSelectedType] = useState("post");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [portfolioCollection, setPortfolioCollection] = useState("");
  const [exclusiveTier, setExclusiveTier] = useState("");
  const [shopCollection, setShopCollection] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [price, setPrice] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date>();
  const [meetingTime, setMeetingTime] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    console.log({ 
      selectedCategory, 
      selectedType, 
      title, 
      content, 
      tags, 
      visibility, 
      portfolioCollection,
      exclusiveTier,
      shopCollection,
      shopCategory,
      price,
      uploadedFiles
    });
    navigate("/");
  };

  const currentCategory = contentCategories.find(cat => cat.id === selectedCategory);
  const currentTypeObj = currentCategory?.types.find(type => type.id === selectedType);

  return ( // Force recompilation
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
        <Sidebar onNavigate={(id) => id === "home" && navigate("/")} />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex md:ml-20 lg:ml-72 pt-16 md:pt-0 pb-20 md:pb-4">
        {/* Main Content */}
        <div className="flex-1 max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 pt-2 sm:pt-4 pb-4">
          
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create New Content</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Choose what you want to create and share with the world</p>
          </div>

          {/* Category Selection */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 sm:mb-6 bg-gradient-to-r from-muted/50 to-muted/30 p-1 rounded-xl border border-border/50">
              {contentCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="flex flex-col gap-0.5 h-14 mx-1 px-1 sm:px-2 py-1 rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden group
                    data-[state=active]:bg-gradient-to-br data-[state=active]:from-creator-gold/20 data-[state=active]:to-creator-gold/10 
                    data-[state=active]:border-creator-gold/50 data-[state=active]:border data-[state=active]:text-creator-gold 
                    data-[state=active]:shadow-lg data-[state=active]:shadow-creator-gold/20
                    hover:bg-gradient-to-br hover:from-creator-gold/10 hover:to-creator-gold/5 
                    hover:border-creator-gold/30 hover:border hover:text-creator-gold/80 hover:scale-105
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-creator-gold/5 before:to-transparent 
                    before:translate-x-[-100%] before:transition-transform before:duration-700 
                    hover:before:translate-x-[100%]"
                >
                  <span className="font-medium transition-all duration-300 group-hover:font-semibold text-xs sm:text-sm">{category.label}</span>
                  <span className="text-xs text-muted-foreground hidden md:block transition-all duration-300 group-hover:text-creator-gold/60">
                    {category.description}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {contentCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                {/* Content Type Selection */}
                <Card className="bg-gradient-card border-border mb-4 sm:mb-6">
                  <CardHeader>
                    <CardTitle>{category.label} Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.types.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              selectedType === type.id
                                ? "border-creator-gold bg-creator-gold/10 text-creator-gold"
                                : "border-border hover:border-creator-gold/50"
                            }`}
                          >
                            <Icon className="w-8 h-8 mb-2" />
                            <p className="font-medium">{type.label}</p>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Dynamic Form Based on Selection */}
                <Card className="bg-gradient-card border-border mb-4 sm:mb-6">
                  <CardHeader>
                    <CardTitle>
                      {currentTypeObj?.label} Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {/* Title */}
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder={`Give your ${currentTypeObj?.label.toLowerCase()} a catchy title...`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <Label htmlFor="content">
                        {selectedType === "blog" ? "Blog Content" : "Description"}
                      </Label>
                      <Textarea
                        id="content"
                        placeholder={
                          selectedType === "blog" 
                            ? "Write your blog article here..." 
                            : "Describe your content..."
                        }
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`mt-2 ${selectedType === "blog" ? "min-h-[200px]" : "min-h-[120px]"}`}
                      />
                    </div>

                    {/* Media Upload (for posts and other types that need media) */}
                    {(selectedType === "post" || selectedType === "portfolio-item" || selectedType === "product") && (
                      <div>
                        <Label>Upload Media (Optional)</Label>
                        <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-creator-gold/50 transition-colors cursor-pointer">
                          <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <PlusIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop your media files
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supports images, videos, and audio files
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Blog Thumbnail Upload */}
                    {selectedType === "blog" && (
                      <div>
                        <Label>Blog Thumbnail</Label>
                        <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-creator-gold/50 transition-colors cursor-pointer">
                          <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click to upload a thumbnail image for your blog
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended size: 1200x630px for optimal display
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Portfolio Collection Selection */}
                    {selectedType === "portfolio-item" && (
                      <div>
                        <Label>Portfolio Collection</Label>
                        <Select value={portfolioCollection} onValueChange={setPortfolioCollection}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select or create collection" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockPortfolioCollections.map((collection) => (
                              <SelectItem key={collection} value={collection}>
                                {collection}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">+ Create New Collection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* H3Xclusive Tier Selection */}
                    {selectedType === "exclusive-content" && (
                      <div>
                        <Label>H3Xclusive Tier</Label>
                        <Select value={exclusiveTier} onValueChange={setExclusiveTier}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select or create tier" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockExclusiveTiers.map((tier) => (
                              <SelectItem key={tier} value={tier}>
                                {tier}
                              </SelectItem>
                            ))}
                            <SelectItem value="new">+ Create New Tier</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Shop Collection Selection */}
                    {selectedType === "product" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Shop Collection</Label>
                          <Select value={shopCollection} onValueChange={setShopCollection}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockShopCollections.map((collection) => (
                                <SelectItem key={collection} value={collection}>
                                  {collection}
                                </SelectItem>
                              ))}
                              <SelectItem value="new">+ Create New Collection</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select value={shopCategory} onValueChange={setShopCategory}>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockShopCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                              <SelectItem value="new">+ Create New Category</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Price (for commerce items and gigs) */}
                    {(selectedType === "product" || selectedType === "gig" || selectedType === "meeting") && (
                      <div>
                        <Label htmlFor="price">
                          {selectedType === "meeting" ? "Rate per hour" : "Price"}
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder={selectedType === "meeting" ? "Hourly rate" : "0.00"}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}

                    {/* Booking Options (for gigs and meetings) */}
                    {(selectedType === "gig" || selectedType === "meeting") && (
                      <div className="space-y-4">
                        <div>
                          <Label>Booking Type</Label>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="p-4 rounded-lg border-2 border-creator-gold bg-creator-gold/10 text-creator-gold transition-all text-left">
                              <div className="font-medium">Instant Booking</div>
                              <div className="text-sm text-muted-foreground">Clients can book immediately</div>
                            </button>
                            <button className="p-4 rounded-lg border-2 border-border hover:border-creator-gold/50 transition-all text-left">
                              <div className="font-medium">Request to Book</div>
                              <div className="text-sm text-muted-foreground">Review before confirming</div>
                            </button>
                          </div>
                        </div>
                        
                        {selectedType === "gig" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="delivery-time">Delivery Time</Label>
                              <Select>
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Select delivery time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-day">1 Day</SelectItem>
                                  <SelectItem value="2-days">2 Days</SelectItem>
                                  <SelectItem value="3-days">3 Days</SelectItem>
                                  <SelectItem value="1-week">1 Week</SelectItem>
                                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                                  <SelectItem value="1-month">1 Month</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="revisions">Revisions Included</Label>
                              <Select>
                                <SelectTrigger className="mt-2">
                                  <SelectValue placeholder="Number of revisions" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 Revision</SelectItem>
                                  <SelectItem value="2">2 Revisions</SelectItem>
                                  <SelectItem value="3">3 Revisions</SelectItem>
                                  <SelectItem value="unlimited">Unlimited</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        
                        {selectedType === "meeting" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Meeting Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "mt-2 w-full justify-start text-left font-normal",
                                        !meetingDate && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {meetingDate ? format(meetingDate, "PPP") : <span>Select date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={meetingDate}
                                      onSelect={setMeetingDate}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                      className={cn("p-3 pointer-events-auto")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              
                              <div>
                                <Label htmlFor="meeting-time">Meeting Time</Label>
                                <Input
                                  id="meeting-time"
                                  type="time"
                                  value={meetingTime}
                                  onChange={(e) => setMeetingTime(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="duration">Meeting Duration</Label>
                                <Select>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="15-min">15 minutes</SelectItem>
                                    <SelectItem value="30-min">30 minutes</SelectItem>
                                    <SelectItem value="45-min">45 minutes</SelectItem>
                                    <SelectItem value="1-hour">1 hour</SelectItem>
                                    <SelectItem value="1.5-hours">1.5 hours</SelectItem>
                                    <SelectItem value="2-hours">2 hours</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select>
                                  <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Select timezone" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                                    <SelectItem value="pst">PST (UTC-8)</SelectItem>
                                    <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                                    <SelectItem value="cet">CET (UTC+1)</SelectItem>
                                    <SelectItem value="auto">Auto-detect</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Link URL (for link type) */}
                    {selectedType === "link" && (
                      <div>
                        <Label htmlFor="link-url">Link URL</Label>
                        <Input
                          id="link-url"
                          type="url"
                          placeholder="https://example.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                          className="mt-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter the full URL you want to share
                        </p>
                      </div>
                    )}

                    {/* Tags - Not for links */}
                    {selectedType !== "link" && (
                      <div>
                        <Label>Tags</Label>
                        <div className="mt-2 space-y-3">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addTag()}
                              className="flex-1"
                            />
                            <Button onClick={addTag} variant="outline">
                              Add
                            </Button>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                  #{tag}
                                  <button
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <XIcon className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Link Style (for link type) */}
                    {selectedType === "link" && (
                      <div>
                        <Label>Link Style</Label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button className="p-4 rounded-lg border-2 border-creator-gold bg-creator-gold/10 text-creator-gold transition-all text-left">
                            <div className="font-medium">Bar Style</div>
                            <div className="text-sm text-muted-foreground">Compact horizontal link</div>
                          </button>
                          <button className="p-4 rounded-lg border-2 border-border hover:border-creator-gold/50 transition-all text-left">
                            <div className="font-medium">Card Style</div>
                            <div className="text-sm text-muted-foreground">Full preview card</div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Visibility - Only for content category */}
                    {selectedCategory === "content" && (
                      <div>
                        <Label>Visibility</Label>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          {visibilityOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.id}
                                onClick={() => setVisibility(option.id)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                  visibility === option.id
                                    ? "border-creator-gold bg-creator-gold/10 text-creator-gold"
                                    : "border-border hover:border-creator-gold/50"
                                }`}
                              >
                                <Icon className="w-5 h-5 mb-2" />
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="px-8"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-8 bg-creator-gold hover:bg-creator-gold/90 text-background"
              disabled={!title.trim() || !content.trim()}
            >
              {selectedType === "blog" ? "Publish Blog" : 
               selectedType.includes("collection") || selectedType.includes("tier") || selectedType.includes("category") ? "Create" : 
               "Publish"}
            </Button>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on large screens */}
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

export default Create;