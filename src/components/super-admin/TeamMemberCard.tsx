import { ArrowRight, MoveRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TeamMemberCardProps {
  name: string;
  contactNo: string;
  email: string;
  designation: string;
}

export function TeamMemberCard({
  name,
  contactNo,
  email,
  designation,
}: TeamMemberCardProps) {
  return (
    <Card className="mb-4 border border-white shadow-none">
      <CardContent className="flex items-center justify-between p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-1">
          <div>
            <p className="text-[16px] text-muted-foreground mb-1">Name</p>
            <p className="font-medium text-[16px]">{name}</p>
          </div>
          <div>
            <p className="text-[12px] text-muted-foreground mb-1">
              Contact number
            </p>
            <p className="font-medium text-[16px]">{contactNo}</p>
          </div>
          <div>
            <p className="text-[12px] text-muted-foreground mb-1">Email</p>
            <p className="font-medium text-[16px] text-ellipsis overflow-hidden whitespace-nowrap sm:whitespace-normal">
              {email}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-muted-foreground mb-1">
              Designation
            </p>
            <p className="font-medium text-[16px]">{designation}</p>
          </div>
        </div>
        <MoveRight className="h-5 w-5 text-gray-400 mt-4 sm:mt-0 moveRight" />
        </CardContent>
    </Card>
  );
}
