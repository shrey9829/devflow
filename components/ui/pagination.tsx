"use client";
import React from "react";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="mt-10 flex w-full justify-center items-center gap-2">
      <Button
        className="flex min-h-[36px] items-center justify-center gap-2 border"
        variant={"secondary"}
        disabled={pageNumber === 1}
        onClick={() => handleNavigation("prev")}
      >
        <p>Prev</p>
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary px-3.5 py-[0.325rem]">
        <p className="text-white font-semibold">{pageNumber}</p>
      </div>
      <Button
        className="flex min-h-[36px] items-center justify-center gap-2 border"
        variant={"secondary"}
        disabled={!isNext}
        onClick={() => handleNavigation("next")}
      >
        <p>Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
