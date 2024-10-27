import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAllAnswers } from "@/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import ParseHTML from "./parse-html";
import Votes from "./votes";
import Pagination from "./pagination";
import page from "@/app/(root)/(home)/page";

interface Props {
  userId: string;
  questionId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

export const AllAnswers = async ({
  userId,
  questionId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const results = await getAllAnswers({
    questionId: JSON.parse(questionId),
    page: page ? +page : 1,
    sortBy: filter,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <p className="text-lg text-primary">{totalAnswers} Answers</p>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {results.answers.map((answer, index) => (
          <article key={index} className="border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-2 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  className="rounded-full object-cover max-sm:mt-0.5"
                  width={22}
                  height={22}
                  alt={"profile picture"}
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="font-semibold">{answer.author.name}</p>
                  <p className="text-sm text-muted-foreground ml-1 mt-0.5 line-clamp-1">
                    - answered {getTimeStamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  upvotes={answer.upvotes.length}
                  downvotes={answer.downvotes.length}
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userId)}
                  hasUpVoted={answer.upvotes.includes(userId)}
                  hasDownVoted={answer.downvotes.includes(userId)}
                />
              </div>
            </div>

            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>

      <Pagination pageNumber={page ? +page : 1} isNext={results?.isNext} />
    </div>
  );
};
