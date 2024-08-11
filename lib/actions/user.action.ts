/* eslint-disable no-unused-vars */
'use server';

import User from '@/database/user.model';
import { FilterQuery, model } from 'mongoose';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  UpdateUserParams
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

import Tag from '@/database/tags.model';
import { getQuestionById } from './question.action';
import Answer from '@/database/answer.model';
import { connect } from 'http2';

export async function getUserById(params: any) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(
  params: CreateUserParams
) {
  try {
    await connectToDatabase();

    const newUser = User.create(params);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(
  params: UpdateUserParams
) {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate(
      { clerkId },
      updateData,
      {
        new: true
      }
    );

    revalidatePath(path);
  } catch (error) {}
}

export async function deleteUser(
  params: DeleteUserParams
) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findById({ clerkId });

    console.log(user);

    // delete the questions
    // delete the answers ..commnets, etc.

    if (!user) {
      throw new Error('User not found');
    }

    // get user questions
    const userQuestionIds = await Question.find({
      author: user._id
    }).distinct('_id');

    // delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answer, comments, etc.

    const deletedUser = await User.findByIdAndDelete(
      user._id
    );

    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(
  params: GetAllUsersParams
) {
  try {
    await connectToDatabase();

    const {
      page = 1,
      pageSize = 20,
      filter,
      searchQuery
    } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: {
            $regex: new RegExp(searchQuery, 'i')
          }
        },
        {
          username: {
            $regex: new RegExp(searchQuery, 'i')
          }
        }
      ];
    }

    const users = await User.find(query).sort({
      createdAt: -1
    });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

interface SaveParams {
  itemid: string;
  userid: string;
  hasSaved: boolean;
  path: string;
}

export async function saveQuestion({
  itemid,
  userid,
  hasSaved,
  path
}: SaveParams) {
  try {
    await connectToDatabase();

    let update = {};

    if (hasSaved) {
      update = { $pull: { saved: itemid } };
    } else {
      update = { $push: { saved: itemid } };
    }

    await User.findByIdAndUpdate(userid, update);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(
  params: GetSavedQuestionsParams
) {
  try {
    await connectToDatabase();

    const {
      clerkId,
      page = 1,
      pageSize = 10,
      filter,
      searchQuery
    } = params;

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

    const user = await User.findOne({
      clerkId
    }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: { createdAt: -1 }
      },
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

    if (!user) {
      throw new Error('User not found');
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(
  params: GetUserByIdParams
) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({
      clerkId: userId
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalQuestions =
      await Question.countDocuments({
        author: user._id
      });

    const totalAnswers = await Answer.countDocuments({
      author: user._id
    });

    return {
      user,
      totalQuestions,
      totalAnswers
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(
  params: GetUserStatsParams
) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const totalQuestions =
      await Question.countDocuments({
        author: userId
      });

    const userQuestions = await Question.find({
      author: userId
    })

      .sort({ views: -1, upvotes: -1 })
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name'
      })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture'
      });

    return {
      totalQuestions,
      questions: userQuestions
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(
  params: GetUserStatsParams
) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    const answers = await Answer.find({
      author: userId
    })
      .populate({
        path: 'author',
        model: User
      })
      .populate({
        path: 'question',
        model: Question
      })
      .sort({ upvotes: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
