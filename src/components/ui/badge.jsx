import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";


const badgeVariants = cva(
    "flex items-center justify-center rounded-full border  font-medium",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground",
                secondary: "bg-secondary text-secondary-foreground",
                destructive: "bg-destructive text-destructive-foreground",
                outline: "border-border",
            },
            size: {
                sm: "h-4 w-4 text-[10px]",
                md: "h-5 w-5 text-xs",
                lg: "h-6 w-6 text-sm",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);


function Badge({ className, variant = "default", size = "md", ...props }) {
    return (
        <div
            data-slot="badge"
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { Badge };
