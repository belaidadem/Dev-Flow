/* eslint-disable no-unused-vars */
'use server';

import User from '@/database/user.model';
import { connectToDatabase } from '../mongoose';
import {
  GetAllTagsParams,
  GetTopInteractedTagsParams
} from './shared.types';
import Tag from '@/database/tags.model';

export async function getTopInteractiveTags(
  params: GetTopInteractedTagsParams
) {
  try {
    await connectToDatabase();

    // const { userId } = params;

    // const user = await User.findById(userId);

    // if (!user) throw new Error('User not found');

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

// export interface GetAllTagsParams {
//   page?: number;
//   pageSize?: number;
//   filter?: string;
//   searchQuery?: string;
// }
export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();

    // const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const tags = await Tag.find({}).sort({ questions: 1 });

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
