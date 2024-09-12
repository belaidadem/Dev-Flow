import { IQuestion } from '@/database/question.model';
import React from 'react';
import Link from 'next/link';

interface Params {
  tag: {
    _id: string;
    name: string;
    description?: string; // Make description optional
    questions: Array<IQuestion>;
  };
}

const TagCard = ({ tag }: Params) => {
  // Set default value for description if it's not provided
  const { name, questions } = tag;

  return (
    <Link
      className='rounded-[10px] shadow-md'
      href={`/tags/${tag._id}`}
      key={tag._id}
    >
      <article className='background-light900_dark200 light-border flex w-full flex-col rounded-[10px] border px-8 py-10 sm:w-[260px]'>
        <div className='background-light800_dark400 w-fit rounded px-5 py-1.5'>
          <p className='paragraph-semibold text-dark300_light900'>
            {name}
          </p>
        </div>
        <p className='small-medium text-dark400_light500 mt-3.5'>
          <span className='body-semibold primary-text-gradient mr-2.5'>
            {questions.length}+
          </span>{' '}
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
