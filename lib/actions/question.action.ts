'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import Tag from '@/database/tags.model';
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';

export async function getQuestions(
  params: GetQuestionsParams
) {
  try {
    await connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(
  params: CreateQuestionParams
) {
  // eslint-disable-next-line no-empty
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } =
      params;

    // create question
    const question = await Question.create({
      title,
      content,
      author
    });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, 'i') }
        },
        {
          $setOnInsert: { name: tag },
          $addToSet: { questions: question._id }
        },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } }
    });

    // Create an interaction record for the user's ask_question action

    // Increment author's reputation
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(
  params: GetQuestionByIdParams
) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(
      questionId
    )
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      })
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name'
      });

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface Props {
  type: string;
  itemid: string;
  userid: string;
  action: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  path: string;
}

export async function voteQuestion({
  type,
  itemid,
  userid,
  action,
  hasupVoted,
  hasdownVoted,
  path
}: Props) {
  try {
    await connectToDatabase();

    let update;

    if (action === 'upvote') {
      if (hasupVoted) {
        update = { $pull: { upvotes: userid } };
      } else {
        update = {
          $push: { upvotes: userid },
          $pull: { downvotes: userid } // Remove the downvote if it exists
        };
      }
    } else if (action === 'downvote') {
      if (hasdownVoted) {
        update = { $pull: { downvotes: userid } };
      } else {
        update = {
          $push: { downvotes: userid },
          $pull: { upvotes: userid } // Remove the upvote if it exists
        };
      }
    }

    const result = await (
      type === 'question' ? Question : Answer
    ).findByIdAndUpdate({ _id: itemid }, update, {
      new: true
    });

    if (!result) {
      console.error('Question not found');
      throw new Error('Question not found');
    }

    // revalidatePath(path);
    revalidatePath(path);

    return JSON.stringify(result);
  } catch (error) {
    console.error('Error updating vote:', error);
    throw error;
  }
}
