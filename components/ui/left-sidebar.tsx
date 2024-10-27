"use client";
import { sidebarLinks } from "@/constants/index";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "./button";

const LeftSideBar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-md dark:shadow-none max-sm:hidden lg:w-[266px] bg-accent scrollbar-hide">
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item, index) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route;

          if (item.route === "/profile") {
            if (userId) {
              item.route = `/profile/${userId}`;
            } else {
              return null;
            }
          }

          return (
            <Link
              key={index}
              className={`${
                isActive
                  ? "bg-primary rounded-lg text-primary-foreground font-semibold"
                  : ""
              } flex items-center justify-start p-4 gap-4`}
              href={item.route}
            >
              <Image
                src={item.imageURL}
                height={20}
                width={20}
                alt={item.label}
                className={`${isActive ? "" : "invert dark:invert-0"}`}
              />
              <p className={"max-lg:hidden"}>{item.label}</p>
            </Link>
          );
        })}
      </div>

      <SignedOut>
        <div className="flex flex-col gap-3">
          <Link href={"/sign-in"}>
            <Button className="min-h-[41px] w-full ">
              <Image
                src={"/assets/icons/account.svg"}
                alt="login"
                width={18}
                height={18}
                className="invert-0 lg:hidden"
              />
              <span className="max-lg:hidden">Log In</span>
            </Button>
          </Link>

          <Link href={"/sign-up"}>
            <Button className="min-h-[45px] w-full" variant={"outline"}>
              <Image
                src={"/assets/icons/sign-up.svg"}
                alt="sign up"
                width={18}
                height={18}
                className="invert dark:invert-0 lg:hidden"
              />
              <span className="max-lg:hidden">Sign Up</span>
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSideBar;
