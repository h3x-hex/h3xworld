import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TipModalProps {
  children: React.ReactNode;
}

const predefinedAmounts = [5, 10, 25, 50, 100];

export function TipModal({ children }: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const isMobile = useIsMobile();

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  const TipContent = () => (
    <div className="space-y-6 p-4">
      {/* Predefined amounts */}
      <div className="space-y-3">
        <Label>Choose amount</Label>
        <div className="grid grid-cols-3 gap-2">
          {predefinedAmounts.map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              onClick={() => handleAmountSelect(amount)}
              className="h-12"
            >
              ${amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div className="space-y-2">
        <Label htmlFor="custom-amount">Custom amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="custom-amount"
            type="number"
            placeholder="Enter amount"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="pl-10"
            min="1"
            step="0.01"
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="tip-message">Message (optional)</Label>
        <Textarea
          id="tip-message"
          placeholder="Say something nice..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>

      {/* Send button */}
      <Button 
        className="w-full" 
        disabled={finalAmount <= 0}
        variant="tip"
      >
        Send ${finalAmount.toFixed(2)} Tip
      </Button>
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
            <DrawerTitle className="flex items-center gap-2 justify-center">
              <Heart className="w-5 h-5 text-creator-gold" />
              Send a Tip
            </DrawerTitle>
          </DrawerHeader>
          <TipContent />
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
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-creator-gold" />
            Send a Tip
          </DialogTitle>
        </DialogHeader>
        <TipContent />
      </DialogContent>
    </Dialog>
  );
}