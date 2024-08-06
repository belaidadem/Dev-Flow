'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import {
  formatNumber,
  getTimestamp
} from '@/lib/utils';
import { saveQuestion } from '@/lib/actions/user.action';

interface QuestionProps {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  saved: boolean;
  upvotes: Array<string>;
  views: number;
  answers: Array<object>; // Added this to match QuestionCard
  createdAt: Date;
}

const SavedQuestionCard = ({
  _id,
  title,
  tags,
  author,
  saved,
  upvotes,
  views,
  answers = [], // Default value for answers
  createdAt
}: QuestionProps) => {
  const handleSave = async () => {
    await saveQuestion({
      itemid: _id,
      userid: author._id,
      hasSaved: saved,
      path: '/collection'
    });
  };

  console.log(
    _id,
    title,
    tags,
    author,
    saved,
    upvotes,
    views,
    createdAt
  );

  createdAt = new Date(createdAt);

  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
              {title}
            </h3>
          </Link>
        </div>
        <Image
          src={
            saved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt='star'
          className={`cursor-pointer`}
          onClick={handleSave}
        />
      </div>
      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric
          imgUrl={author.picture}
          alt='user'
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles='body-medium text-dark400_light700'
        />
        <Metric
          imgUrl='/assets/icons/like.svg'
          alt='upvotes'
          value={formatNumber(upvotes.length) || 0}
          title=' Votes'
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='answers'
          value={formatNumber(answers.length) || 0} // Added answers to match QuestionCard
          title=' Answers'
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='eye'
          value={formatNumber(views) || 0}
          title=' Views'
          textStyles='small-medium text-dark400_light800'
        />
      </div>
    </div>
  );
};

export default SavedQuestionCard;
