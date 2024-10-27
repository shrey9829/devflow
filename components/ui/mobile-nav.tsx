"use client";
import React from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "./button";
import { sidebarLinks } from "@/constants/index";
import { usePathname } from "next/navigation";

const NavContent = () => {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="flex flex-col gap-6 h-full pt-16">
      {sidebarLinks.map((item, index) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "profile") {
          if (userId) {
            item.route = `/profile/${userId}`;
          } else {
            return null;
          }
        }
        return (
          <SheetClose asChild key={index}>
            <Link
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
                className={`${isActive ? "" : "invert-colors"}`}
              />
              <p>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src={"/assets/icons/hamburger.svg"}
          width={36}
          height={36}
          alt="menu"
          className="sm:hidden cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent side={"left"} className="border-none ">
        <Link href={"/"} className="flex items-center gap-2">
          <Image
            src={"/assets/images/site-logo.svg"}
            width={23}
            height={23}
            alt="DevFlow"
          />

          <p className="text-xl font-bold font-spaceGrotesk  ">
            Dev <span className="text-primary">Overflow</span>
          </p>
        </Link>
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link href={"/sign-in"}>
                  <Button className="min-h-[41px] w-full ">
                    <span>Log In</span>
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={"/sign-up"}>
                  <Button
                    className="min-h-[41px] w-full "
                    variant={"secondary"}
                  >
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SignedOut>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
