/* eslint-disable no-unused-vars */
'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserById(params: any) {
  try {
    await connectToDatabase();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = User.create(params);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.updateOne({ clerkId }, updateData);

    revalidatePath(path);
  } catch (error) {}
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;

    const user = await User.findById({ clerkId });

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

    const users = await User.find({}).sort({
      createdAt: -1
    });

    return { users };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// export async function getAllUsers(
//   params: GetAllUsersParams
// ) {
//   try {
//     await connectToDatabase();
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }
