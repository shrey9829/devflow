import { getUserInfo } from "@/actions/user.action";
import AnswersTab from "@/components/ui/answer-tab";
import { Button } from "@/components/ui/button";
import ProfileLink from "@/components/ui/profile-link";
import QuestionTab from "@/components/ui/question-tab";
import Stats from "@/components/ui/stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getJoinedDate } from "@/lib/utils";
import { SignedIn, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = async ({ params, searchParams }: any) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo?.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />

          <div className="mt-3">
            <p className="text-xl font-semibold">{userInfo.user.name}</p>
            <p className="text-muted-foreground">{userInfo.user.username}</p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  href={userInfo.user.portfolioWebsite}
                  title={"Portfolio"}
                  imgUrl={"/assets/icons/link.svg"}
                />
              )}

              {userInfo.user.location && (
                <ProfileLink
                  href={userInfo.user.location}
                  title={"Location"}
                  imgUrl={"/assets/icons/location.svg"}
                />
              )}

              <ProfileLink
                title={`Joined ${getJoinedDate(userInfo.user.joinedAt)}`}
                imgUrl={"/assets/icons/calendar.svg"}
              />
            </div>

            {userInfo.user.bio && <p className="mt-8">{userInfo.user.bio}</p>}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href={`/profile/${params.id}/edit`}>
                <Button
                  variant={"secondary"}
                  className="min-h-[46px] min-w-[175px] px-4 py-3"
                >
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
        reputation={userInfo.reputation}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="min-h-[33px]">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="min-h-[35px]">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
          <TabsContent className="flex w-full flex-col gap-6" value="answers">
            <AnswersTab
              searchParams={searchParams}
              userId={userInfo.user._id}
              clerkId={clerkId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Page;
