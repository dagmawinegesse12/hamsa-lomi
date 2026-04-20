import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-md border border-gray-200 bg-white p-5 shadow-sm", className)} {...props} />;
}
