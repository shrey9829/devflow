import Link from "next/link";
import React from "react";
import RenderTag from "../ui/RenderTag";
import Metric from "../ui/metric";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../ui/edit-delete-action";

interface Props {
  _id: number;
  title: string;
  tags: {
    _id: number;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
    clerkId: string;
  }[];
  upvotes: number;
  answers: Array<object>;
  createdAt: Date;
  views: number;
  clerkId?: string | null;
}

const QuestionsCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  answers,
  views,
  createdAt,
  clerkId,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author[0].clerkId;
  return (
    <div className="rounded-[10px] p-9 sm:px-11 bg-accent shadow-sm">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <p className="sm:text-lg sm:font-semibold flex-1 line-clamp-1 text-xl font-bold">
              {title}
            </p>
          </Link>
        </div>
        {/* If signed in add edit delete actions */}

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <RenderTag
            key={index}
            _id={tag._id}
            name={tag.name}
            totalQuestions={0}
            showCount={false}
          />
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-between flex-wrap gap-3">
        <Metric
          image={author[0].picture}
          alt="user"
          value={author[0].name}
          title={` - asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author[0]._id}`}
          isAuthor
          textStyles="invert-0`"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            image={"/assets/icons/like.svg"}
            alt="author"
            //@ts-ignore
            value={formatNumber(upvotes.length)}
            title="Votes"
            textStyles=""
          />
          <Metric
            image={"/assets/icons/message.svg"}
            alt="message"
            value={formatNumber(answers.length)}
            title="Answers"
            textStyles="sdf"
          />
          <Metric
            image={"/assets/icons/eye.svg"}
            alt="eye"
            value={formatNumber(views)}
            title="Views"
            textStyles="sdf"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionsCard;
