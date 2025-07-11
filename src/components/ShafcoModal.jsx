import { cn } from "@/lib/utils";
import companyLogo from "@/public/images/logo-lg.png";
import LazyImage from "./LazyImage";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

const ShafcoModal = ({ open, onOpenChange, children, logo = true, modalWidth = "!max-w-md" }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(modalWidth, "!rounded-none !p-0")}>
        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="hidden">Login / Sign Up</DialogTitle>
            <DialogDescription className="hidden">Authentication Dialog</DialogDescription>
            {logo && (
              <LazyImage src={companyLogo} alt="shafco" className="mx-auto h-20 w-auto mb-3" />
            )}
          </DialogHeader>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShafcoModal;
