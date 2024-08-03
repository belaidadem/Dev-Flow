/* eslint-disable no-unused-vars */
'use server';

import Answer from '@/database/answer.model';
import { connectToDatabase } from '../mongoose';
import { revalidatePath } from 'next/cache';
import {
  CreateAnswerParams,
  GetAnswersParams
} from './shared.types';
import Question from '@/database/question.model';
import page from '@/app/(root)/(home)/page';

export async function createAnswer(
  params: CreateAnswerParams
) {
  try {
    await connectToDatabase();

    const { content, author, question, path } = params;

    const answer = await Answer.create({
      content,
      author,
      question
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id }
    });

    // TODO: Add interaction...

    revalidatePath(path);

    return { answer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllAnsewrs(
  params: GetAnswersParams
) {
  try {
    await connectToDatabase();
    const { questionId, sortBy, page, pageSize } =
      params;

    const answers = await Answer.find({
      question: questionId
    })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 });

    revalidatePath(`/question/${questionId}`);
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
