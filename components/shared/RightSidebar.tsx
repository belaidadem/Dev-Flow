import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag';

const hotQuestions = [
  {
    _id: '1',
    title:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis turpis vel arcu euismod lobort'
  },
  {
    _id: '2',
    title:
      'Maecenas ut nisi non nisi commodo congue '
  },
  {
    _id: '3',
    title:
      'Ut sed velit et justo scelerisque placerat. Nulla facilisi. Donec vel justo vel nunc pulvinar vulputate. '
  },
  {
    _id: '4',
    title:
      'Integer euismod purus sed nunc malesuada, vel semper velit semper. '
  },
  {
    _id: '5',
    title:
      'Nulla facilisi. Donec vel justo vel nunc pulvinar vulputate. '
  }
];

const popularTags = [
  {
    _id: '1',
    name: 'javascript',
    totalQuestions: 5
  },
  {
    _id: '2',
    name: 'react',
    totalQuestions: 3
  },
  {
    _id: '3',
    name: 'typescript',
    totalQuestions: 2
  },
  {
    _id: '4',
    name: 'css',
    totalQuestions: 1
  },
  {
    _id: '5',
    name: 'html',
    totalQuestions: 1
  }
];

const RightSidebar = () => {
  return (
    <div className='background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <div>
        <h3 className='h3-bold text-dark200_light900'>
          Top Questions
        </h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {hotQuestions.map((question) => (
            <Link
              href={`/question/${question._id}`}
              key={question._id}
              className='group flex cursor-pointer items-center justify-between gap-7'
            >
              <p className='body-medium text-dark500_light700 group-hover:text-gray-300 group-hover:underline'>
                {question.title}
              </p>

              <Image
                src='/assets/icons/chevron-right.svg'
                alt='chevron-right'
                width={20}
                height={20}
                className='invert-colors'
              />
            </Link>
          ))}
        </div>
      </div>
      <div className='mt-16 flex flex-col gap-4'>
        {popularTags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            totalQuestions={tag.totalQuestions}
            showCount
          ></RenderTag>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
