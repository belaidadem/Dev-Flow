/* eslint-disable no-unused-vars */
'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams
} from './shared.types';
import Tag from '@/database/tags.model';
import Question from '@/database/question.model';

export async function getTopInteractiveTags(
  params: GetTopInteractedTagsParams
) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    // Find interactions for the user and group by tags...
    // Interaction

    return [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag1' }
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(
  params: GetAllTagsParams
) {
  try {
    await connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const tags = await Tag.find({}).sort({
      questions: 1
    });

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTag(
  params: GetQuestionsByTagIdParams
) {
  const { tagId } = params;

  try {
    await connectToDatabase();

    const tag = await Tag.findById({
      _id: tagId
    }).populate({
      path: 'questions',
      model: Question,
      populate: [
        {
          path: 'tags',
          model: Tag,
          select: '_id name'
        },
        {
          path: 'author',
          model: User,
          select: '_id clerkId name picture'
        }
      ]
    });

    if (tag) {
      const questions = tag.questions;
      return { tag };
    }

    return console.log('Tag Not Found');
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotTags() {
  try {
    await connectToDatabase();

    const hotTags = await Tag.aggregate([
      {
        $addFields: {
          questionsCount: { $size: '$questions' }
        }
      },
      {
        $sort: { questionsCount: -1 } // Sort by the number of questions in descending order
      },
      {
        $limit: 5
      }
    ]);

    return { hotTags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
