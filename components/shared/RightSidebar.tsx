import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import RenderTag from './RenderTag';
import { getHotQuestion } from '@/lib/actions/question.action';
import { getHotTags } from '@/lib/actions/tag.actions';

const RightSidebar = async () => {
  const resultPopularQuestions =
    await getHotQuestion();
  const resultPopularTags = await getHotTags();
  return (
    <div className='background-light900_dark200 light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden'>
      <div>
        <h3 className='h3-bold text-dark200_light900'>
          Top Questions
        </h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {resultPopularQuestions.hotQuestions.map(
            (question) => (
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
            )
          )}
        </div>
      </div>
      <div className='mt-16 flex flex-col gap-4'>
        <h3 className='h3-bold text-dark200_light900 mb-7'>
          Popular Tags
        </h3>
        {resultPopularTags.hotTags.map((tag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            totalQuestions={tag.questionsCount}
            showCount
          ></RenderTag>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
