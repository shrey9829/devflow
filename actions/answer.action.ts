"use server";

import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { connectToDatabase } from "@/database/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: any) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({ content, author, question });
    console.log({ newAnswer });
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

    revalidatePath(path);
  } catch (error) {
    console.log("CREATE_ANSWER_ERROR", error);
    throw error;
  }
}

export async function getAllAnswers(params: any) {
  try {
    connectToDatabase();

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;

      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;

      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const answersCount = await Answer.countDocuments({ question: questionId });

    const isNext = answersCount > skipAmount + answers.length;
    return { answers, isNext };
  } catch (error) {
    console.log("CREATE_ANSWER_ERROR", error);
    throw error;
  }
}

export async function upvoteAnswer(params: any) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;
    let updateQuery = {};

    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("UPVOTE_ANSWER_ERROR", error);
    throw error;
  }
}

export async function downvoteAnswer(params: any) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpVoted, hasDownVoted, path } = params;
    let updateQuery = {};

    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log("DOWNVOTE_ANSWER_ERROR", error);
    throw error;
  }
}

export async function deleteAnswer(params: any) {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    await answer.deleteOne({ _id: answerId });
    await Interaction.deleteMany({ answer: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log("DELETE_QUESTION_ERROR", error);
    throw error;
  }
}
