import * as SimpleIcons from "@icons-pack/react-simple-icons";
import { Icon } from "@iconify/react";

export default function DynamicIcon({ iconName, size = 32, color, className = "" } : { iconName: string, size?: number, color?: string, className?: string }) {
  const IconComponent = SimpleIcons[iconName as keyof typeof SimpleIcons];

  if (!IconComponent) return <span>?</span>;

  return (
    <IconComponent size={size} color={color} className={className} title={iconName} />
  )
}