import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-sm",
        secondary:
          "border-white/10 bg-white/5 text-gray-200 hover:bg-white/10",
        destructive:
          "border-transparent bg-red-600/20 border-red-500/30 text-red-300",
        outline:
          "border-white/20 text-gray-300",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
