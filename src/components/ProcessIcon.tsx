import { Compass, PenTool, Server, RefreshCw, type LucideProps } from "lucide-react";
import type React from "react";

const icons: Record<string, React.FC<LucideProps>> = {
  Compass,
  PenTool,
  Server,
  RefreshCw,
};

interface ProcessIconProps extends LucideProps {
  name: string;
}
export default function ProcessIcon({ name, ...props }: ProcessIconProps) {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon {...props} />;
}
