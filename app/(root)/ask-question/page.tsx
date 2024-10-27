import { getUserById } from "@/actions/user.action";
import Question from "@/components/forms/question";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  const user = await getUserById({ userId });
  return (
    <div>
      <h1 className="text-2xl font-bold">Ask a question</h1>
      <div className="mt-9">
        <Question userId={JSON.stringify(user?._id)} />
      </div>
    </div>
  );
};

export default Page;
