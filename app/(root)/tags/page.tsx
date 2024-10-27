import React from "react";

import { getAllTags } from "@/actions/tags.action";
import UserCard from "@/components/cards/user-card";
import LocalSearchBar from "@/components/search/local-search";
import Filter from "@/components/ui/Filter";
import NoResult from "@/components/ui/no-result";
import { TagFilters } from "@/constants/filters";
import Link from "next/link";
import Pagination from "@/components/ui/pagination";

const Page = async ({ searchParams }: any) => {
  const results = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="font-bold text-3xl">All Users</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {/* @ts-ignore */}
        {results.tags.length > 0 ? (
          /* @ts-ignore */
          results.tags.map((tag, index) => (
            <Link href={`/tags/${tag._id}`} key={index}>
              <article className="flex w-full flex-col shadow-sm rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="w-fit rounded-sm px-5 py-1.5 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-400 bg-slate-200 hover:bg-slate-100">
                  <p className="font-semibold">{tag.name}</p>
                </div>

                <p className="mt-3.5">
                  <span className="font-semibold mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="No Tags Found"
            description="It looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>

      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={results?.isNext || false}
      />
    </>
  );
};

export default Page;
