import Link from "next/link";
import React from "react";
import Metric from "../ui/metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../ui/edit-delete-action";

interface Props {
  _id: number;
  question: {
    _id: number;
    title: string;
  };
  author: {
    _id: number;
    name: string;
    picture: string;
    clerkId: string;
  };
  upvotes: number;
  createdAt: Date;
  clerkId: string | null;
}

const AnswersCard = ({
  _id,
  question,
  author,
  upvotes,
  createdAt,
  clerkId,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;
  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className="rounded-[10px] px-11 py-9 bg-accent shadow-sm"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${question._id}`}>
            <p className="sm:text-lg sm:font-semibold flex-1 line-clamp-1 text-xl font-bold">
              {question?.title}
            </p>
          </Link>
        </div>
        {/* If signed in add edit delete actions */}

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex items-center justify-between flex-wrap gap-3">
        <Metric
          image={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="invert-0`"
        />

        <Metric
          image={"/assets/icons/like.svg"}
          alt="Votes"
          value={formatNumber(upvotes)}
          title={`Votes`}
          textStyles="invert-0`"
        />
      </div>
    </Link>
  );
};

export default AnswersCard;
