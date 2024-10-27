"use server";

import { connectToDatabase } from "@/database/mongoose";
import Question from "@/database/question.model";
import Tag, { ITag } from "@/database/tag.model";
import User from "@/database/user.model";
//@ts-ignore
import { FilterQuery } from "mongoose";

export async function getTopInterfaceTags(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const Tags = await Question.aggregate([
      {
        $match: {
          author: user._id, // Match questions posted by the user
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tagsInfo",
        },
      },
      {
        $unwind: "$tagsInfo", // Unwind the array of tags
      },
      {
        $replaceRoot: { newRoot: "$tagsInfo" }, // Replace the root with tagsInfo
      },
    ]).limit(3);

    return Tags;
  } catch (error) {
    console.log("GET_TOP_INTERFACE_TAGS", error);
    throw error;
  }
}

export async function getAllTags(params: any) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 8 } = params;

    const skip = (page - 1) * pageSize;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;

      case "recent":
        sortOptions = { createdAt: -1 };
        break;

      case "name":
        sortOptions = { name: 1 };
        break;

      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const tagsCount = await Tag.countDocuments(query);
    const isNext = tagsCount > skip + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: any) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skip = (page - 1) * pageSize;
    const query: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(query).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skip,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id picture clerkId name" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = tag.questions.length > pageSize;
    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log("GET_QUESTIONS_BY_TAG_ID", error);
    throw error;
  }
}

export async function getHotTags() {
  try {
    connectToDatabase();

    const hotTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return hotTags;
  } catch (error) {
    console.log("GET_HOT_TAGS_ERROR", error);
    throw error;
  }
}
