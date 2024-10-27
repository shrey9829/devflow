import { getQuestionsByTagId } from "@/actions/tags.action";
import QuestionsCard from "@/components/cards/questions-card";
import LocalSearchBar from "@/components/search/local-search";
import Filter from "@/components/ui/Filter";
import NoResult from "@/components/ui/no-result";
import Pagination from "@/components/ui/pagination";
import React from "react";

const Page = async ({ params, searchParams }: any) => {
  const data = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className="font-bold text-3xl">{data.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tag questions..."
          otherClasses="flex-1"
        />
      </div>

      <div className="mt-10 flex w-full flex-col gap-6">
        {
          //@ts-ignore
          data?.questions?.length > 0 ? (
            //@ts-ignore
            data?.questions?.map((question, index) => (
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
              />
            ))
          ) : (
            <NoResult
              title={"There's no tag question to show"}
              description={
                "Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved! 💡"
              }
              link={"/ask-question"}
              linkTitle={"Ask a Question"}
            />
          )
        }
      </div>

      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={data?.isNext || false}
      />
    </>
  );
};

export default Page;
