"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [active, setActive] = useState("");

  const handleClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((filter, index) => (
        <Button
          className={`rounded-lg font-semibold px-6 py-3 capitalize shadow-none ${
            active === filter.value
              ? "bg-primary/20 text-primary hover:text-white"
              : "bg-slate-200  text-slate-400 hover:bg-slate-100 dark:bg-accent dark:hover:bg-accent/80"
          }`}
          key={index}
          onClickCapture={() => handleClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
