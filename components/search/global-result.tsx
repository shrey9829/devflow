"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import error from "next/error";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import GlobalFilters from "./global-filter";
import { globalSearch } from "@/actions/genera.action";
import { type } from "os";

const GlobalResult = () => {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setIsLoading(true);
      setResult([]);

      try {
        const res = await globalSearch({ query: global, type });
        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (global) fetchResult();
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;

      case "answer":
        return `/question/${id}`;

      case "user":
        return `/profile/${id}`;

      case "tag":
        return `/tags/${id}`;

      default:
        break;
    }
  };
  return (
    <div className="absolute border-2 top-full z-10 mt-8 w-full rounded-lg bg-accent dark:bg-black py-5 shadow-sm">
      <p className="px-5 font-semibold">
        <GlobalFilters />
      </p>
      <div className="my-5 h-[1px] bg-white" />
      <div className="space-y-5">
        <p className="px-5 font-semibold">Top Match</p>

        {isLoading ? (
          <div className="flex items-center justify-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary" />
            <p>Browsing the entire database</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 ">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  //@ts-ignore
                  href={renderLink(item.type, item.id)}
                  key={index}
                  className="flex items-start gap-3 px-5 py-2.5 cursor-pointer "
                >
                  <Image
                    src={`/assets/icons/tag.svg`}
                    alt="tags"
                    width={20}
                    height={20}
                    className="invert dark:invert-0 mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1">{item.title}</p>
                    <p className="font-bold capitalize mt-1 text-sm text-muted-foreground">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col px-5">
                <p className="text-5xl">🫣</p>
                <p className="px-5 py-2.5">Oops , no results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
