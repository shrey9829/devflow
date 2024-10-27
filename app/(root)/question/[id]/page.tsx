import { getQuestionById } from "@/actions/question.actions";
import { getUserById } from "@/actions/user.action";
import Answer from "@/components/forms/answer";
import question from "@/components/forms/question";
import RenderTag from "@/components/ui/RenderTag";
import { AllAnswers } from "@/components/ui/all-answers";
import Metric from "@/components/ui/metric";
import ParseHTML from "@/components/ui/parse-html";
import Votes from "@/components/ui/votes";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ searchParams, params }: any) => {
  const question = await getQuestionById({ questionId: params.id });
  const { userId: clerkId } = auth();

  let user;

  if (clerkId) {
    user = await getUserById({ userId: clerkId });
  }
  return (
    <>
      <div className="flex items-center justify-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className="flex items-center justify-start gap-2 "
            href={`/profile/${question.author[0].clerkId}`}
          >
            <Image
              src={question.author[0].picture}
              className="rounded-full"
              width={22}
              height={22}
              alt={"picture"}
            />
            <p className="font-semibold">{question.author[0].name}</p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="Question"
              upvotes={question.upvotes.length}
              downvotes={question.downvotes.length}
              itemId={JSON.stringify(question._id)}
              userId={JSON.stringify(user?._id)}
              hasUpVoted={question.upvotes.includes(user?._id)}
              hasDownVoted={question.downvotes.includes(user?._id)}
              hasSaved={user?.saved.includes(question._id)}
            />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          image={"/assets/icons/clock.svg"}
          alt="clock icon"
          value={` asked ${getTimeStamp(question.createdAt)}`}
          title="Asked"
          textStyles=""
        />
        <Metric
          image={"/assets/icons/message.svg"}
          alt="message"
          value={formatNumber(question.answers.length)}
          title="Answers"
          textStyles="sdf"
        />
        <Metric
          image={"/assets/icons/eye.svg"}
          alt="eye"
          value={formatNumber(question.views)}
          title="Views"
          textStyles="sdf"
        />
      </div>

      <ParseHTML data={question.content} />
      <div className={"mt-8 flex flex-wrap gap-2"}>
        {/* @ts-ignore */}
        {question.tags.map((tag, index) => (
          <RenderTag
            key={index}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={JSON.stringify(question._id)}
        userId={user?._id}
        totalAnswers={question.answers.length}
        page={searchParams.page}
        filter={searchParams.filter}
      />

      <Answer
        question={question.content}
        questionId={JSON.stringify(question._id)}
        authorId={JSON.stringify(user?._id)}
      />
    </>
  );
};

export default Page;
