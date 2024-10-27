"use server";

import Answer from "@/database/answer.model";
import { connectToDatabase } from "@/database/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { assignBadges } from "@/lib/utils";
//@ts-ignore
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log("GET_USER_BY_ID", error);
    return { error };
  }
}

export async function createUser(params: any) {
  try {
    connectToDatabase();

    const newUser = await User.create(params);
    return newUser;
  } catch (error) {
    console.log("CREATE_USER", error);
    return { error };
  }
}

export async function updateUser(params: any) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    console.log(updatedUser);
    revalidatePath(path);
    return updatedUser;
  } catch (error) {
    console.log("CREATE_USER", error);
    return { error };
  }
}

export async function deleteUser(params: any) {
  try {
    connectToDatabase();
    const { clerkId } = params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log("CREATE_USER", error);
    return { error };
  }
}

export async function getAllUsers(params: any) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 5 } = params;

    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;

      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;

      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.log("GET_ALL_USERS", error);
  }
}

export async function toggleSavedQuestion(params: any) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log("TOGGLE_SAVED_QUESTION", error);
    throw error;
  }
}

export async function getAllSavedQuestion(params: any) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};

    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;

      case "oldest":
        sortOptions = { createdAt: 1 };
        break;

      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;

      case "most_viewed":
        sortOptions = { views: -1 };
        break;

      case "most_answered":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id picture clerkId name" },
      ],
    });

    const isNext = user.saved.length > pageSize;

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.log("GET_ALL_SAVED_QUESTION", error);
    throw error;
  }
}

export async function getUserInfo(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;
    console.log(userId);

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("User not found");
    }

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    const [questionUpvotes] = await Question.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: "$upvotes" } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $project: { _id: 0, upvotes: "$upvotes" } },
      { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT", count: totalQuestions },
      { type: "ANSWER_COUNT", count: totalAnswers },
      { type: "QUESTION_UPVOTES", count: questionUpvotes?.totalUpvotes || 0 },
      { type: "ANSWER_UPVOTES", count: answerUpvotes?.totalUpvotes || 0 },
      { type: "TOTAL_VIEWS", count: questionViews?.totalUpvotes || 0 },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
    };
  } catch (error) {
    console.log("GET_USER_INFO", error);
    throw error;
  }
}

export async function getUserQuestions(params: any) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id name picture clerkId");

    const isNext = totalQuestions > userQuestions.length + skipAmount;
    return {
      questions: userQuestions,
      totalQuestions,
      isNext,
    };
  } catch (error) {
    console.log("GET_USER_INFO", error);
    throw error;
  }
}

export async function getUserAnswers(params: any) {
  try {
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const userAnswers = await Answer.find({ author: userId })
      .sort({ createdAt: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("question", "_id title")
      .populate("author", "_id name picture clerkId");

    const isNext = totalAnswers > userAnswers.length + skipAmount;
    return {
      answers: userAnswers,
      totalAnswers,
      isNext,
    };
  } catch (error) {
    console.log("GET_USER_INFO", error);
    throw error;
  }
}
