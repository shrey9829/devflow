import { getQuestionById } from "@/actions/question.actions";
import { getUserById } from "@/actions/user.action";
import ProfileForm from "@/components/forms/profle-form";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ params }: any) => {
  const { userId } = auth();

  if (!userId) return null;

  const user = await getUserById({ userId });
  return (
    <>
      <h1 className="font-bold text-3xl">Edit Profile</h1>

      <div className="mt-9">
        <ProfileForm
          clerkId={userId}
          user={JSON.stringify(user)}
        />
      </div>
    </>
  );
};

export default Page;
