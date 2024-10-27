import React from "react";

import { getUserAnswers, getUserQuestions } from "@/actions/user.action";
import QuestionsCard from "../cards/questions-card";
import AnswersCard from "../cards/answers-card";
import { Item } from "@radix-ui/react-dropdown-menu";
import Pagination from "./pagination";

interface Props {
  searchParams: any;
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      {result.answers.map((answer: any, index: number) => (
        <AnswersCard
          key={index}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}

      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={result?.isNext}
      />
    </>
  );
};

export default AnswersTab;
