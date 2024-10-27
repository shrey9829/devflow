import LocalSearchBar from "@/components/search/local-search";
import Filter from "@/components/ui/Filter";
import { Button } from "@/components/ui/button";
import HomeFilters from "@/components/ui/home-filters";
import NoResult from "@/components/ui/no-result";
import QuestionsCard from "@/components/cards/questions-card";
import { HomePageFilters, QuestionFilters } from "@/constants/filters";
import Link from "next/link";
import { getQuestions } from "@/actions/question.actions";
import { getAllSavedQuestion } from "@/actions/user.action";
import { auth } from "@clerk/nextjs";
import Pagination from "@/components/ui/pagination";

export default async function Home({ searchParams }: any) {
  const { userId } = auth();
  const data = await getAllSavedQuestion({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  }); // Example object with 'questions' property

  return (
    <>
      <h1 className="font-bold text-3xl">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions..."
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
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
              title={"There's no saved question to show"}
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
}
