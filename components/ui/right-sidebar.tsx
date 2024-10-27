import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/actions/question.actions";
import { getHotTags } from "@/actions/tags.action";

const RightSideBar = async () => {
  const questions = await getHotQuestions();
  const popularTags = await getHotTags();

  return (
    <section className="sticky right-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-l p-6 pt-36 shadow-md dark:shadow-none max-xl:hidden lg:w-[350px] bg-accent scrollbar-hide">
      <div>
        <p className="text-xl font-bold">Top Questions</p>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {questions.map((question, index) => (
            <Link
              href={`/question/${question._id}`}
              key={index}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="font-medium">{question.title}</p>
              <Image
                src={"/assets/icons/chevron-right.svg"}
                alt="chevron right"
                width={20}
                height={20}
                className="invert-0"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <p className="text-xl font-bold">Popular Tags</p>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag, index) => (
            <RenderTag
              key={index}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.numberOfQuestions}
              showCount={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
