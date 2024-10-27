"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  image: string;
  alt: string;
  value: string | number;
  title: string;
  textStyles: string;
  href?: string;
  isAuthor?: boolean;
}

const Metric = ({
  image,
  value,
  alt,
  title,
  textStyles,
  href,
  isAuthor,
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={image}
        alt={alt}
        width={18}
        height={18}
        className={`object-contain ${href ? "rounded-full" : ""}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}{" "}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        ></span>{" "}
        {title}
      </p>
    </>
  );

  if (href) {
    return (
      <Link className="flex justify-center items-center gap-2" href={href}>
        {metricContent}
      </Link>
    );
  }

  return (
    <div className="flex justify-center items-center flex-wrap gap-1">
      {metricContent}
    </div>
  );
};

export default Metric;
