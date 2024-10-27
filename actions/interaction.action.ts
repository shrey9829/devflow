"use server";

import Interaction from "@/database/interaction.model";
import { connectToDatabase } from "@/database/mongoose";
import Question from "@/database/question.model";

export async function viewQuestion(params: any) {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction)
        return console.log("User has already viewed this question");

      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log("VIEW_QUESTION", error);
    throw error;
  }
}
