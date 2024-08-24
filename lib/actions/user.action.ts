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
import Question, {
  IQuestion
} from '@/database/question.model';

import Tag from '@/database/tags.model';
import { getQuestionById } from './question.action';
import Answer from '@/database/answer.model';
import { connect } from 'http2';
import console from 'console';
import { BadgeCriteriaType } from '@/types';
import { assignBadges } from '../utils';

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

    const user = await User.findOneAndUpdate(
      { clerkId },
      updateData,
      {
        new: true
      }
    );

    revalidatePath(path);

    return { user };
  } catch (error) {}
}

export async function deleteUser(
  params: DeleteUserParams
) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    // Use findOne to find the user by clerkId
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Get user questions
    const userQuestionIds = await Question.find({
      author: user._id
    }).distinct('_id');

    // Delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: Delete user answers, comments, etc.

    // Delete the user
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

    let filterOption = {};

    switch (filter) {
      case 'new_users':
        filterOption = { joineAt: -1 };
        break;
      case 'old_users':
        filterOption = { joineAt: 1 };
        break;
      case 'top_contributors':
        filterOption = { reputation: -1 };
        break;
      default:
        break;
    }
    const skipAmount = (page - 1) * pageSize;

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(filterOption);

    const totalUsers =
      await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + pageSize;

    return { users, isNext };
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
    connectToDatabase();

    const {
      clerkId,
      searchQuery,
      filter,
      page = 1,
      pageSize = 2
    } = params;

    const query: FilterQuery<typeof Question> =
      searchQuery
        ? {
            title: {
              $regex: new RegExp(searchQuery, 'i')
            }
          }
        : {};

    let sortOption = {};
    switch (filter) {
      case 'most_recent':
        sortOption = { createdAt: -1 };
        break;

      case 'oldest':
        sortOption = { createdAt: 1 };
        break;

      case 'most_voted':
        sortOption = { upvotes: -1 };
        break;
      case 'most_viewed':
        sortOption = { views: -1 };
        break;
      case 'most_answered':
        sortOption = { answers: -1 };
        break;

      default:
        break;
    }

    const skipAmount = (page - 1) * pageSize;
    const totalQuestions =
      await Question.countDocuments(query);

    const isNext =
      totalQuestions > skipAmount + pageSize;

    const user = await User.findOne({
      clerkId
    }).populate({
      path: 'saved',
      match: query,
      options: {
        sort: sortOption,
        limit: pageSize,
        skip: skipAmount
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

    const savedQuestions = user.saved;

    return { questions: savedQuestions, isNext };
  } catch (error) {
    console.error(error);
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

    const [questionUpvotes] = await Question.aggregate(
      [
        { $match: { author: user._id } },
        {
          $project: {
            _id: 0,
            upvotes: { $size: '$upvotes' }
          }
        },
        {
          $group: {
            _id: null,
            totalUpvotes: { $sum: '$upvotes' }
          }
        }
      ]
    );
    const [answerUpvotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: '$upvotes' }
        }
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: '$upvotes' }
        }
      }
    ]);

    const [questionViews] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const criteria = [
      {
        type: 'QUESTION_COUNT' as BadgeCriteriaType,
        count: totalQuestions
      },
      {
        type: 'ANSWER_COUNT' as BadgeCriteriaType,
        count: totalAnswers
      },
      {
        type: 'QUESTION_UPVOTES' as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0
      },
      {
        type: 'ANSWER_UPVOTES' as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0
      },
      {
        type: 'TOTAL_VIEWS' as BadgeCriteriaType,
        count: questionViews?.totalViews || 0
      }
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation
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

    const skipAmount = (page - 1) * pageSize;
    const totalQuestions =
      await Question.countDocuments({
        author: userId
      });
    const isNext =
      totalQuestions > skipAmount + pageSize;

    const userQuestions = await Question.find({
      author: userId
    })
      .skip(skipAmount)
      .limit(pageSize)
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
      questions: userQuestions,
      isNext
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

    const skipAmount = (page - 1) * pageSize;
    const totalAnswers: number =
      await Answer.countDocuments({
        author: userId
      });
    const isNext =
      totalAnswers > skipAmount + pageSize;

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
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: -1 });

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
