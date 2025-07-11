
import { cn } from "@/lib/utils";

function Separator({ className, ...props }) {
  return (
    <div
      className={cn("my-4 h-px w-full bg-border", className)}
      {...props}
    />
  );
}

export { Separator };
