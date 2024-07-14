import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { User2 } from "lucide-react";

export function UserAvatar({ data }: { data: User }) {
  return (
    <Avatar className="w-24 h-24 border-2 border-black shadow-sm">
      {data?.image ? (
        <>
          <AvatarImage
            src={data?.image || ""}
            alt={data.name || "profile pic"}
          />
          <AvatarFallback>{data.name?.charAt(0) || "T"}</AvatarFallback>
        </>
      ) : (
        <div className="w-full h-full rounded-full relative flex justify-center items-center bg-neutral-100 p-4">
          <User2 className="w-full h-full" />
        </div>
      )}
    </Avatar>
  );
}
