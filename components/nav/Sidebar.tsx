import { motion } from "framer-motion";
import { 
  Home, 
  Globe, 
  Bell, 
  MessageCircle, 
  User, 
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useNavigation from "@/hooks/useNavigation";
import { useRouter } from "next/navigation";

const navigation = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "explore", label: "Explore", icon: Globe, path: "/explore" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/notifications" },
  { id: "chats", label: "Chats", icon: MessageCircle, path: "/chats" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

interface SidebarProps {
  onNavigate?: (id: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const router = useRouter();
  const {
      isHomeActive,
      isExploreActive,
      isNotificationsActive,
      isProfileActive,
      isCreateActive,
  } = useNavigation();

  const handleNavClick = (item: typeof navigation[0]) => {
    router.push(item.path);
    onNavigate?.(item.id);
  };

  return (
    <motion.div 
      className="w-16 md:w-72 h-screen bg-card border border-border flex-col p-2 md:p-6 rounded-lg m-4 hidden sm:flex"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-12">
        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="H3X World Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="hidden md:block text-xl font-bold text-gray-300">
          h<span className="text-creator-gold">3</span>x.world
        </h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                "w-full flex items-center justify-center md:justify-start gap-4 px-2 md:px-4 py-3 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-creator-gold/10 text-creator-gold border border-creator-gold/20" 
                  : "text-muted-foreground hover:text-creator-gold hover:bg-creator-gold/10"
              )}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden md:inline font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Create Button */}
      <motion.div
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          variant={isCreateActive ? "default" : "outline"}
          className={cn(
            "w-full font-semibold px-2 md:px-4 rounded-full transition-all duration-300",
            isCreateActive
              ? "bg-creator-gold text-background hover:bg-creator-gold/90 hover:shadow-glow border-creator-gold" 
              : "border-creator-gold text-creator-gold hover:bg-creator-gold hover:text-background hover:shadow-glow"
          )}
          size="lg"
          onClick={() => router.push("/create")}
        >
          <Plus className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Create</span>
        </Button>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Profile Section */}
      <motion.div
        className="mt-auto pt-4 border-t border-border"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button 
          onClick={() => router.push("/profile")}
          className="w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-creator-gold/10 hover:text-creator-gold transition-colors"
        >
          <img
            src='/logo.png'
            alt="Profile"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
          />
          <div className="hidden md:block md:flex-1 text-left">
            <p className="font-medium text-foreground text-sm">Ronald Prithiv</p>
            <p className="text-xs text-muted-foreground">@ron12369</p>
          </div>
        </button>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="grid grid-cols-5 gap-1 p-2 items-center">
          {/* Home */}
          <button
            onClick={() => router.push("/home")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isHomeActive
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Home className="w-5 h-5" />
          </button>
          
          {/* Explore */}
          <button
            onClick={() => router.push("/explore")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isExploreActive
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          {/* Create - Center button with special styling */}
          <button
            onClick={() => router.push("/create")}
            className="flex items-center justify-center w-20 h-12 bg-creator-gold text-black rounded-full hover:bg-creator-gold/90 transition-colors shadow-lg"
          >
            <Plus className="w-6 h-6" />
          </button>
          
          {/* Notifications */}
          <button
            onClick={() => router.push("/notifications")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isNotificationsActive
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <Bell className="w-5 h-5" />
          </button>
          
          {/* Profile */}
          <button
            onClick={() => router.push("/profile")}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isProfileActive
                ? "text-creator-gold bg-creator-gold/10"
                : "text-muted-foreground hover:text-creator-gold"
            )}
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>


    </motion.div>
  );
}