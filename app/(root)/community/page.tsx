import { getAllUsers } from "@/actions/user.action";
import UserCard from "@/components/cards/user-card";
import LocalSearchBar from "@/components/search/local-search";
import Filter from "@/components/ui/Filter";
import Pagination from "@/components/ui/pagination";
import { UserFilters } from "@/constants/filters";
import Link from "next/link";

import React from "react";
import Loading from "./loading";

const Page = async ({ searchParams }: any) => {
  const results = await getAllUsers({
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
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {/* @ts-ignore */}
        {results.users.length > 0 ? (
          /* @ts-ignore */
          results.users.map((user, index) => (
            <UserCard key={index} user={user} />
          ))
        ) : (
          <div className="paragraph-regular mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href={"/sign-up"} className="mt-2 font-bold text-sky-500">
              Join to be the first one!
            </Link>
          </div>
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
