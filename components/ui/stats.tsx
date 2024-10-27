import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: any;
  reputation: number;
}

interface StatsCardProps {
  value: number;
  imgUrl: string;
  title: string;
}

const StatsCard = ({ imgUrl, value, title }: StatsCardProps) => {
  return (
    <div className="border flex flex-wrap items-center justify-evenly gap-4 rounded-md p-6 shadow-sm dark:shadow-md">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className="font-semibold">{value}</p>
        <p>{title}</p>
      </div>
    </div>
  );
};

const Stats = ({ totalAnswers, totalQuestions, badges, reputation }: Props) => {
  return (
    <div className="mt-10">
      <h4 className="text-lg font-semibold">Stats - {reputation}</h4>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="border flex flex-wrap items-center justify-evenly gap-4 rounded-md p-6 shadow-sm dark:shadow-md">
          <div>
            <p className="font-semibold">{formatNumber(totalQuestions)}</p>
            <p>Questions</p>
          </div>

          <div>
            <p className="font-semibold">{formatNumber(totalAnswers)}</p>
            <p>Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl={"/assets/icons/gold-medal.svg"}
          value={badges.GOLD}
          title={"Gold Badges"}
        />

        <StatsCard
          imgUrl={"/assets/icons/silver-medal.svg"}
          value={badges.SILVER}
          title={"Silver Badges"}
        />

        <StatsCard
          imgUrl={"/assets/icons/bronze-medal.svg"}
          value={badges.BRONZE}
          title={"Bronze Badges"}
        />
      </div>
    </div>
  );
};

export default Stats;
