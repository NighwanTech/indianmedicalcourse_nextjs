import React from "react";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

interface DynamicIconProps extends Omit<LucideProps, "name"> {
  name?: string | null;
  fallback?: React.ComponentType<LucideProps>;
}

export function DynamicIcon({
  name,
  fallback: Fallback = LucideIcons.Folder,
  ...props
}: DynamicIconProps) {
  if (!name) {
    return <Fallback {...props} />;
  }

  // Find icon component in Lucide library
  const IconComponent = (LucideIcons as Record<string, any>)[name];

  if (!IconComponent) {
    return <Fallback {...props} />;
  }

  return <IconComponent {...props} />;
}
