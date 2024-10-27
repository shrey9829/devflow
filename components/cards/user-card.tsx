import { getTopInterfaceTags } from "@/actions/tags.action";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../ui/RenderTag";
import { Badge } from "../ui/badge";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    email: string;
    picture: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interfaceTags = await getTopInterfaceTags({ userId: user._id });
  return (
    <div className="w-full max-sm:min-w-full xs:w-[260px]">
      <Link href={`/profile/${user.clerkId}`}>
        <article className="shadow-sm flex flex-col w-full items-center justify-center rounded-2xl border p-8">
          <Image
            src={user.picture}
            alt="user profile picture"
            height={100}
            width={100}
            className="rounded-full"
          />
          <div className="mt-4 text-center">
            <h3 className="text-lg line-clamp-1 font-semibold">{user.name}</h3>
            <p className="mt-2">@{user.username}</p>
          </div>
          <div className="mt-5">
            {interfaceTags.length > 0 ? (
              <div className="flex items-center gap-2">
                {interfaceTags.map((tag: any, index: number) => (
                  <RenderTag key={index} _id={tag._id} name={tag.name} />
                ))}
              </div>
            ) : (
              <Badge>No tags yet</Badge>
            )}
          </div>
        </article>
      </Link>
    </div>
  );
};

export default UserCard;
