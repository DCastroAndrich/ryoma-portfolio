import { TechIcon } from "./TechIcon";

interface TechItem {
  name: string;
  icon: string;
}

interface TechStackProps {
  items: TechItem[];
  className?: string;
}

export default function TechStack({ items, className = "" }: TechStackProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 ${className}`}>
      {items.map(({ name, icon }) => (
        <TechIcon key={name} name={name} icon={icon} />
      ))}
    </div>
  );
}
