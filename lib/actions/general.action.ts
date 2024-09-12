'use server';

import Question from '@/database/question.model';
import { connectToDatabase } from '../mongoose';
import { SearchParams } from './shared.types';
import User from '@/database/user.model';
import Answer from '@/database/answer.model';
import Tag from '@/database/tags.model';

const searchableTypes = [
  'question',
  'user',
  'answer',
  'tag'
];

const modelsAndtypes = [
  {
    model: Question,
    searchField: 'title',
    type: 'question'
  },
  {
    model: User,
    searchField: 'name',
    type: 'user'
  },
  {
    model: Answer,
    searchField: 'content',
    type: 'answer'
  },
  {
    model: Tag,
    searchField: 'name',
    type: 'tag'
  }
];

export async function globalSearch(
  params: SearchParams
) {
  try {
    await connectToDatabase();
    const { query, type } = params;
    const regexQuery = {
      $regex: query,
      $options: 'i'
    };

    let results: any = [];

    if (!type || !searchableTypes.includes(type)) {
      // search acrose every thing
      for (const {
        model,
        searchField,
        type
      } of modelsAndtypes) {
        const queryResult = await model
          .find({
            [searchField]: regexQuery
          })
          .limit(2);

        results.push(
          ...queryResult.map((item) => ({
            title:
              type === 'answer'
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === 'user'
                ? item.clerkId
                : type === 'answer'
                  ? item.question
                  : item._id
          }))
        );
      }
    } else {
      // search on specific type
      const modelInfo = modelsAndtypes.find(
        (item) => item.type === type
      );
      if (!modelInfo) {
        throw new Error('invalid search type');
      }

      const queryResult = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResult.map((item) => ({
        title:
          type === 'answer'
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id:
          type === 'user'
            ? item.clerkId
            : type === 'answer'
              ? item.question
              : item._id
      }));
    }

    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
