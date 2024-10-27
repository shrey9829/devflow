"use client";
import { downvoteAnswer, upvoteAnswer } from "@/actions/answer.action";
import { viewQuestion } from "@/actions/interaction.action";
import { downvoteQuestion, upvoteQuestion } from "@/actions/question.actions";
import { toggleSavedQuestion } from "@/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "./use-toast";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasUpVoted: boolean;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpVoted,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [userId, itemId, pathname, router]);
  const handleSave = async () => {
    await toggleSavedQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });

    return toast({
      title: `Question ${
        !hasSaved ? "Saved in" : "Removed from"
      } your collection`,
      variant: !hasSaved ? "default" : "destructive",
    });
  };
  const handleVote = async (action: string) => {
    if (!userId)
      return toast({
        title: "Please log in",
        description: "You must be logged in to perform this action",
      });

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }

      return toast({
        title: `Upvote ${!hasUpVoted ? "Successfully" : "Removed"}`,
        variant: !hasUpVoted ? "default" : "destructive",
      });
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted,
          hasDownVoted,
          path: pathname,
        });
      }

      return toast({
        title: `Downvote ${!hasUpVoted ? "Successfully" : "Removed"}`,
        variant: !hasDownVoted ? "default" : "destructive",
      });
    }
  };
  return (
    <div className="flex gap-5">
      <div className="flex items-center justify-center gap-2.5">
        <div className="flex items-center justify-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={20}
            height={20}
            alt="up vote"
            className="cursor-pointer"
            onClick={() => handleVote("upvote")}
          />
          <div className="flex items-center justify-center px-2 py-1 min-w-[18px] rounded-sm text-white bg-slate-400 dark:bg-slate-700">
            <p className="text-sm">{formatNumber(upvotes)}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={20}
            height={20}
            alt="downvote"
            className="cursor-pointer"
            onClick={() => handleVote("downvote")}
          />
          <div className="flex items-center justify-center px-2 py-1 min-w-[18px] rounded-sm text-white bg-slate-400 dark:bg-slate-700">
            <p className="text-sm">{formatNumber(downvotes)}</p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={20}
          height={20}
          alt="downvote"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
