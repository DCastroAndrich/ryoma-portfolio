import { TechIcon } from "./TechIcon"

interface TechItem {
    name: string;
    icon: string;
}

export default function TechStack({ items }: { items: TechItem[] }) {
    return (
        <div className="flex items-center justify-center p-13 gap-8 w-fit h-fit">
            {items.map(({ name, icon }) => (
                <TechIcon key={name} name={name} icon={icon} />
            ))}

        </div>
    )
}