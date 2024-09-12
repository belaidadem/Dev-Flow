/* eslint-disable no-unused-vars */
'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import Tag from '@/database/tags.model';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { FilterQuery } from 'mongoose';

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();

    const { page = 1, pageSize = 20, searchQuery, filter } = params;

    // calculate skip amount
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          title: {
            $regex: new RegExp(searchQuery, 'i')
          }
        },
        {
          content: {
            $regex: new RegExp(searchQuery, 'i')
          }
        }
      ];
    }

    let sortCriteria: Record<string, 1 | -1> = {};

    switch (filter) {
      case 'newest':
        sortCriteria = { createdAt: -1 };
        break;
      case 'frequent':
        sortCriteria = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortCriteria);

    const totalQuetions = await Question.countDocuments(query);

    const isNext = totalQuetions > skipAmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  // eslint-disable-next-line no-empty
  try {
    await connectToDatabase();

    const { title, content, tags, author, path } = params;

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

    await Interaction.create({
      user: author,
      action: 'ask_question',
      question: question._id,
      tags: tagDocuments
    });

    // Increment author's reputation
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 }
    });
    revalidatePath(path);

    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
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

    return { question };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface Props {
  type: string;
  itemid: string;
  userid: string | undefined;
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

    const item = await (type === 'question' ? Question : Answer)
      .findById(itemid)
      .populate('author');
    const { author } = item;

    if (action === 'upvote') {
      if (hasupVoted) {
        update = { $pull: { upvotes: userid } };
      } else {
        update = {
          $push: { upvotes: userid },
          $pull: { downvotes: userid }
        };
      }
    } else if (action === 'downvote') {
      if (hasdownVoted) {
        update = { $pull: { downvotes: userid } };
      } else {
        update = {
          $push: { downvotes: userid },
          $pull: { upvotes: userid }
        };
      }
    }

    const result = await (
      type === 'question' ? Question : Answer
    ).findByIdAndUpdate({ _id: itemid }, update, {
      new: true
    });

    // ! Adding the reputation

    await User.findByIdAndUpdate(userid, {
      $inc: {
        reputation:
          result.upvotes.includes(author._id) ||
          result.downvotes.includes(author._id)
            ? 1
            : -1
      }
    });

    await User.findByIdAndUpdate(item.author, {
      $inc: {
        reputation:
          action === 'upvote' && !item.upvotes.includes(author._id) ? 10 : -10
      }
    });

    if (!result) {
      console.error('Question not found');
      throw new Error('Question not found');
    }

    revalidatePath(path);

    return JSON.stringify(result);
  } catch (error) {
    console.error('Error updating vote:', error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, path } = params;

    const { deletedCount } = await Question.deleteOne({
      _id: questionId
    });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({
      question: questionId
    });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    await Tag.deleteMany({ questions: { $size: 0 } });

    revalidatePath(path);

    let response;

    if (deletedCount === 1) response = true;
    else response = false;

    return { response };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate('tags');

    if (!question) {
      throw new Error('Question not found');
    }

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestion() {
  try {
    await connectToDatabase();

    const hotQuestions = await Question.find({})
      .sort({
        views: -1
      })
      .limit(5);

    return { hotQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
