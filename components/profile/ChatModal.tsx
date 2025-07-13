import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MessageCircle, Handshake } from "lucide-react";
// Import the correct hook
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatModalProps {
  children: React.ReactNode;
}

export function ChatModal({ children }: ChatModalProps) {
  console.log('ChatModal loading, checking useIsMobile import');
  const isMobile = useIsMobile();
  console.log('isMobile value:', isMobile);

  const chatContent = (
    <div className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-lg font-semibold">Start a conversation</h3>
        <p className="text-muted-foreground text-sm">Choose how you'd like to connect</p>
      </div>
      
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12 text-left border-border hover:bg-muted"
        >
          <MessageCircle className="w-5 h-5 text-creator-blue" />
          <div>
            <div className="font-medium">Direct Message</div>
            <div className="text-sm text-muted-foreground">Send a private message</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 h-12 text-left border-border hover:bg-muted"
        >
          <Handshake className="w-5 h-5 text-creator-gold" />
          <div>
            <div className="font-medium">Collaboration Request</div>
            <div className="text-sm text-muted-foreground">Propose a collaboration</div>
          </div>
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-center">Chat Options</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6">
            {chatContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat Options</DialogTitle>
        </DialogHeader>
        {chatContent}
      </DialogContent>
    </Dialog>
  );
}