"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import MobileNav from "./mobile-nav";
import GlobalSearch from "../search/global-search";

const Navbar = () => {
  return (
    <nav className="flex bg-accent items-center justify-between fixed z-50 w-full gap-5 p-6 shadow-sm dark:shadow-none sm:px-12">
      <Link href={"/"} className="flex items-center gap-2">
        <Image
          src={"/assets/images/site-logo.svg"}
          width={25}
          height={25}
          alt="DevFlow"
        />

        <p className="text-2xl font-bold font-spaceGrotesk text-secondary-foreground dark:text-primary-foreground max-sm:hidden">
          Dev <span className="text-primary">Overflow</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex justify-between items-center gap-5">
        <ModeToggle />
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#f97316",
              },
            }}
            afterSignOutUrl="/"
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
