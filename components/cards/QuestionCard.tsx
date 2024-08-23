import Link from 'next/link';
import React from 'react';
import RenderTag from '../shared/RenderTag';
import Metric from '../shared/Metric';
import {
  formatNumber,
  getTimestamp
} from '@/lib/utils';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from '../shared/EditDeleteAction';

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
    clerkId?: string | null;
  };
  upvotes: Array<string>;
  views: number;
  answers: Array<object>;
  createdAt: Date;
  clerkId?: string | null;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  clerkId,
  author,
  upvotes,
  views,
  answers = [],
  createdAt
}: QuestionProps) => {
  const showActionButtons =
    clerkId && clerkId === author.clerkId;
  tags = JSON.parse(JSON.stringify(tags));
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
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction
              type='Question'
              itemId={JSON.stringify(_id)}
            />
          )}
        </SignedIn>
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
          href={`/profile/${author.clerkId}`}
          isAuthor
          textStyles='body-medium text-dark400_light700'
        />
        <div className='flex items-center gap-3 max-sm:flex-wrap'>
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
            value={formatNumber(answers.length) || 0}
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
    </div>
  );
};

export default QuestionCard;
