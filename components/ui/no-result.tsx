import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./button";

interface Props {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src={"/assets/images/light-illustration.png"}
        alt="Mo result illustration"
        width={270}
        height={270}
        className="block object-contain dark:hidden"
      />

      <Image
        src={"/assets/images/dark-illustration.png"}
        alt="Mo result illustration"
        width={270}
        height={270}
        className="hidden object-contain dark:flex"
      />

      <p className="text-2xl font-bold mt-8">{title}</p>
      <p className="my-3.5 text-center max-w-md">{description}</p>

      <Link href={link}>
        <Button className="mt-5 min-h-[46px] px-4 py-3">{linkTitle}</Button>
      </Link>
    </div>
  );
};

export default NoResult;
