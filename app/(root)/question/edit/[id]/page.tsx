import { getQuestionById } from "@/actions/question.actions";
import { getUserById } from "@/actions/user.action";
import Question from "@/components/forms/question";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ params }: any) => {
  const { userId } = auth();

  if (!userId) return null;

  const user = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="font-bold text-3xl">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="edit"
          userId={JSON.stringify(user._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
