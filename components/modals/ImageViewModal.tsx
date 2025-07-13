import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerClose } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

const ImageContent = ({ imageSrc, imageAlt, onClose }: { imageSrc: string; imageAlt: string; onClose: () => void }) => (
  <div className="relative">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
    >
      <X className="h-4 w-4" />
    </button>
    <img
      src={imageSrc}
      alt={imageAlt}
      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
    />
  </div>
);

export function ImageViewModal({ isOpen, onClose, imageSrc, imageAlt }: ImageViewModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-transparent border-none">
          <ImageContent imageSrc={imageSrc} imageAlt={imageAlt} onClose={onClose} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-transparent border-none p-0 shadow-none [&>button]:hidden">
        <ImageContent imageSrc={imageSrc} imageAlt={imageAlt} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}