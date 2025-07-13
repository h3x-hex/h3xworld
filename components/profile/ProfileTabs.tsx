import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  Briefcase, 
  Store, 
  Calendar, 
  Lock, 
  Link, 
  Info,
  Grid3X3,
  List,
  Tag,
  Package,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "posts", label: "Posts", icon: FileText },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "shop", label: "Shop", icon: Store },
  { id: "gigs", label: "Gigs", icon: Calendar },
  { id: "h3xclusive", label: "h3xclusive", icon: Lock },
  { id: "links", label: "Links", icon: Link },
  { id: "about", label: "About", icon: Info },
];

interface ProfileTabsProps {
  onTabChange?: (tabId: string) => void;
}

export function ProfileTabs({ onTabChange }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [postsViewMode, setPostsViewMode] = useState<"grid" | "list">("grid");
  const [shopCategory, setShopCategory] = useState("all");
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: React.RefObject<HTMLButtonElement> }>({});

  // Initialize refs for all tabs
  tabs.forEach(tab => {
    if (!tabRefs.current[tab.id]) {
      tabRefs.current[tab.id] = React.createRef<HTMLButtonElement>();
    }
  });

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  useEffect(() => {
    if (activeTab && tabRefs.current[activeTab]?.current) {
      tabRefs.current[activeTab]?.current?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border border-border rounded-lg">
        <motion.div 
          ref={tabContainerRef}
          className="flex overflow-x-auto scrollbar-none scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                ref={tabRefs.current[tab.id]}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "flex items-center h-12 gap-1 sm:gap-2 px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-lg font-medium whitespace-nowrap transition-all duration-300 min-w-fit relative",
                  isActive
                    ? "border-creator-gold text-creator-gold"
                    : "border-transparent text-muted-foreground hover:text-creator-gold"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: tabs.indexOf(tab) * 0.05 }}
              >
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span className="font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-creator-gold"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Tab Content */}
      <motion.div 
        className="p-4 sm:p-6"
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabContent 
          activeTab={activeTab} 
          postsViewMode={postsViewMode}
          setPostsViewMode={setPostsViewMode}
          shopCategory={shopCategory}
          setShopCategory={setShopCategory}
        />
      </motion.div>
    </div>
  );
}

function TabContent({ 
  activeTab, 
  postsViewMode, 
  setPostsViewMode, 
  shopCategory, 
  setShopCategory 
}: { 
  activeTab: string;
  postsViewMode: "grid" | "list";
  setPostsViewMode: (mode: "grid" | "list") => void;
  shopCategory: string;
  setShopCategory: (category: string) => void;
}) {
  const content = {
    home: (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold">Activity Feed</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gradient-card rounded-lg border border-border shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <div>
                  <p className="font-medium">Recent Activity {i}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <p className="text-muted-foreground">Latest updates from your favorite creator...</p>
            </div>
          ))}
        </div>
      </div>
    ),
    posts: (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Posts</h2>
          <div className="flex gap-2">
            <Button
              variant={postsViewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPostsViewMode("grid")}
              className="px-3 py-1"
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={postsViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setPostsViewMode("list")}
              className="px-3 py-1"
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
        </div>
        {postsViewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gradient-card rounded-lg border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-4 p-4 bg-gradient-card rounded-lg border border-border shadow-card hover:shadow-glow transition-all duration-300">
                <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Post Title {i}</h3>
                  <p className="text-muted-foreground text-sm mb-2">This is a preview of the post content that would appear in list view...</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>2 hours ago</span>
                    <span>•</span>
                    <span>24 likes</span>
                    <span>•</span>
                    <span>5 comments</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    portfolio: (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video bg-gradient-card rounded-lg border border-border shadow-card group-hover:shadow-glow transition-all duration-300 group-hover:scale-105" />
              <div className="mt-2 sm:mt-3">
                <h3 className="font-semibold text-sm sm:text-base">Project Title {i}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Creative work showcase</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    shop: (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Shop</h2>
        </div>
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {["all", "digital", "physical", "bundles", "limited"].map((category) => (
            <Button
              key={category}
              variant={shopCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setShopCategory(category)}
              className="whitespace-nowrap"
            >
              <Tag className="w-3 h-3 mr-1" />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Featured Collections</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["Digital Art Pack", "Exclusive Merch"].map((collection, i) => (
              <div key={collection} className="p-4 bg-gradient-card rounded-lg border border-border shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-5 h-5 text-creator-gold" />
                  <h4 className="font-semibold">{collection}</h4>
                </div>
                <p className="text-muted-foreground text-sm mb-3">Premium collection with exclusive content</p>
                <div className="flex justify-between items-center">
                  <span className="text-creator-gold font-semibold">From $49.99</span>
                  <span className="text-xs text-muted-foreground">{5 + i} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-gradient-card rounded-lg border border-border shadow-card group-hover:shadow-glow transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-creator-gold text-background text-xs px-2 py-1 rounded-full font-semibold">
                  Hot
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <h3 className="font-semibold text-sm sm:text-base">Product {i}</h3>
                <p className="text-creator-gold font-semibold text-sm sm:text-base">$99.00</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-creator-gold text-creator-gold" />
                  <span className="text-xs text-muted-foreground">4.8 (23)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    gigs: (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold">Gigs & Services</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-gradient-card rounded-lg border border-border shadow-card hover:shadow-glow transition-all duration-300">
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 bg-gradient-to-br from-creator-gold/20 to-creator-blue/20" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">Service Package {i}</h3>
                      <p className="text-muted-foreground text-sm">Professional creative service</p>
                    </div>
                    <span className="text-creator-gold font-semibold">Starting at $299</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-1 text-xs bg-creator-blue/20 text-creator-blue rounded">Available</span>
                <span className="px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded">2-3 days</span>
                <span className="px-2 py-1 text-xs bg-creator-gold/20 text-creator-gold rounded">Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-creator-gold text-creator-gold" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-xs text-muted-foreground">(127 reviews)</span>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    h3xclusive: (
      <div className="space-y-6 animate-fade-in">
        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { name: "Basic", price: "$4.99", features: ["Weekly posts", "Basic support", "Community access"] },
            { name: "Premium", price: "$9.99", features: ["Daily posts", "Priority support", "Exclusive content", "Behind the scenes"] },
            { name: "VIP", price: "$19.99", features: ["All content", "1-on-1 chat", "Custom requests", "Early access", "Video calls"] }
          ].map((tier, i) => (
            <div key={tier.name} className={cn(
              "p-6 bg-gradient-card rounded-lg border border-border shadow-card transition-all duration-300 hover:shadow-glow",
              i === 1 && "border-creator-gold scale-105"
            )}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="text-2xl font-bold text-creator-gold">{tier.price}</div>
                <div className="text-sm text-muted-foreground">per month</div>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Star className="w-3 h-3 fill-creator-gold text-creator-gold" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                variant={i === 1 ? "default" : "outline"} 
                className="w-full"
              >
                Subscribe
              </Button>
            </div>
          ))}
        </div>

        {/* Exclusive Posts Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Latest Exclusive Content</h3>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gradient-card rounded-lg border border-border shadow-card relative overflow-hidden">
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 mx-auto text-creator-pink mb-2" />
                    <p className="text-sm font-medium">Subscribe to unlock</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium">Exclusive Post {i}</h4>
                    <p className="text-sm text-muted-foreground">Behind the scenes content...</p>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago • Premium tier</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    links: (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold">Links</h2>
        <div className="space-y-3">
          {["Website", "Instagram", "Twitter", "YouTube", "Discord"].map((platform, i) => (
            <a
              key={platform}
              href="#"
              className="block p-4 bg-gradient-card rounded-full border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{platform}</span>
                <Link className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    ),
    about: (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-xl font-semibold">About</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">
            Welcome to my creative space! I'm a passionate digital artist and content creator 
            dedicated to bringing unique visions to life. With over 5 years of experience in 
            digital art, design, and content creation, I specialize in creating compelling 
            visual narratives that resonate with audiences.
          </p>
          <p className="text-foreground leading-relaxed mt-4">
            My work spans across various mediums including digital illustration, motion graphics, 
            and interactive design. I believe in the power of creativity to inspire and connect 
            people from all walks of life.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
          <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-lg border border-border">
            <div className="text-lg sm:text-2xl font-bold text-primary">500+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-lg border border-border">
            <div className="text-lg sm:text-2xl font-bold text-creator-blue">50K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-lg border border-border">
            <div className="text-lg sm:text-2xl font-bold text-creator-pink">1.2M+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Views</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-lg border border-border">
            <div className="text-lg sm:text-2xl font-bold text-creator-gold">98%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Satisfaction</div>
          </div>
        </div>
      </div>
    ),
  };

  return content[activeTab as keyof typeof content] || content.home;
}