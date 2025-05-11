import { Ban } from "lucide-react"
import * as SimpleIcons from "@icons-pack/react-simple-icons";
import { Icon } from "@iconify/react";

export default function DynamicIcon({ iconName, size = 32, color, className = "" } : { iconName: string, size?: number, color?: string, className?: string }) {
  const IconComponent = SimpleIcons[iconName as keyof typeof SimpleIcons];

  if (!IconComponent) return <Ban size={size} color={color} className={className} />;

  return (
    <IconComponent size={size} color={color} className={className} title={iconName} />
  )
}