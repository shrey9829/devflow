import { getUserQuestions } from "@/actions/user.action";
import React from "react";
import QuestionsCard from "../cards/questions-card";
import Pagination from "./pagination";
import result from "postcss/lib/result";

interface Props {
  searchParams: any;
  userId: string;
  clerkId: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {result.questions.map((question, index) => (
          <QuestionsCard
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            createdAt={question.createdAt}
            key={index}
            answers={question.answers}
            clerkId={clerkId}
          />
        ))}
      </div>

      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={result?.isNext}
      />
    </>
  );
};

export default QuestionTab;
