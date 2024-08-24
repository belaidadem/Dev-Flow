import Answer from '@/components/forms/Answer';
import AllAnswers from '@/components/shared/AllAnswers';
import Metric from '@/components/shared/Metric';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Votes from '@/components/shared/Votes';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import {
  formatNumber,
  getTimestamp
} from '@/lib/utils';
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Metadata } from 'next';
import { SignedIn, SignIn } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Question | Dev Overflow',
  description:
    'View and answer questions, learn from others, and vote on the best answers.'
};

interface Params extends SearchParamsProps {
  params: {
    id: string;
  };
}

const Page = async ({
  params,
  searchParams
}: Params) => {
  const result = await getQuestionById({
    questionId: params.id
  });

  const questionId = params.id;
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${result.author.clerkId}`}
            className='flex items-center justify-start gap-1'
          >
            <Image
              src={result.author.picture}
              alt='profile picture'
              width={22}
              height={22}
              className='rounded-full'
            />
            <p className='paragraph-semibold text-dark300_light700'>
              {result.author.name}
            </p>
          </Link>
          <div className='flex justify-end'>
            <Votes
              type='question'
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser?._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(
                mongoUser?._id
              )}
              downvotes={result.downvotes?.length}
              hasdownVoted={result.downvotes?.includes(
                mongoUser?._id
              )}
              hasSaved={mongoUser?.saved.includes(
                result._id
              )}
            />
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {result.title}
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <Metric
          imgUrl='/assets/icons/clock.svg'
          alt='clock icon'
          value={` Asked ${getTimestamp(result.createdAt)}`}
          title=''
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='answers'
          value={
            formatNumber(result.answers.length) || 0
          }
          title=' Answers'
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='eye'
          value={formatNumber(result.views) || 0}
          title=' Views'
          textStyles='small-medium text-dark400_light800'
        />
      </div>
      <ParseHTML data={result.content} />

      <div className='mt-8 flex flex-wrap gap-2'>
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={mongoUser?._id}
        page={
          searchParams?.page ? +searchParams.page : 1
        }
        filter={searchParams?.filter}
        totalAnswers={result.answers.length}
      />

      <SignedIn>
        <Answer
          question={result.content}
          questionId={JSON.stringify(questionId)}
          authorId={JSON.stringify(mongoUser?._id)}
        />
      </SignedIn>
    </>
  );
};

export default Page;
