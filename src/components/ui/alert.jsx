import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-4 backdrop-blur-xl [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-[#a855f7]",
  {
    variants: {
      variant: {
        default:
          "bg-[#0b0720]/90 border-white/10 text-white [&>svg]:text-purple-400",
        destructive:
          "border-red-500/30 bg-red-950/40 text-red-200 dark:border-red-500/30 [&>svg]:text-red-400",
        success:
          "border-emerald-500/30 bg-emerald-950/40 text-emerald-200 [&>svg]:text-emerald-400",
        warning:
          "border-amber-500/30 bg-amber-950/40 text-amber-200 [&>svg]:text-amber-400",
        info:
          "border-blue-500/30 bg-blue-950/40 text-blue-200 [&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-white", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-gray-300 [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
