import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  imgUrl: string;
  href?: string;
}

const ProfileLink = ({ title, imgUrl, href }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <Image src={imgUrl} width={20} height={20} alt="icon" />

      {href ? (
        <Link href={href} target="_blank" className="text-blue-500">
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  );
};

export default ProfileLink;
