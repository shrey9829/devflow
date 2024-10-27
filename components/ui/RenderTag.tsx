import Link from "next/link";
import React from "react";
import { Badge } from "./badge";

interface Props {
  _id: number;
  name: string;
  totalQuestions?: number;
  showCount?: boolean;
}

const RenderTag = ({ _id, name, totalQuestions, showCount }: Props) => {
  return (
    <Link href={`/tags/${_id}`} className="flex  justify-between gap-2">
      <Badge className="bg-slate-200 hover:bg-slate-100 dark:bg-slate-700 shadow-md font-bold tracking-wider text-slate-400 rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>

      {showCount && <p className="text-sm font-medium">{totalQuestions}</p>}
    </Link>
  );
};

export default RenderTag;
