import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface CustomCheckboxProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    icon?: string;
    onChange: (checked: boolean) => void;
}

export default function CustomCheckbox({
    id,
    label,
    description,
    icon,
    checked,
    onChange,
}: CustomCheckboxProps) {
    return (
        <div className="relative size-24 flex flex-col w-full items-center justify-center cursor-pointer  gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:shadow-lime-400 has-[[data-state=checked]]:border-[#3DA229]">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(checked) => onChange(checked as boolean)}
                className="order-1  after:absolute after:inset-0 opacity-0"
                aria-describedby={`${id}-description`}
            />
            <div className="flex flex-col absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2">
                <Image
                    src={icon ?? ""}
                    alt="icon"
                    width={20}
                    height={20}
                    className="object-contain "
                />
                 <Label htmlFor={id} className="w-full text-center">
                    {label}
                </Label>
            </div>
        </div>
    );
}


