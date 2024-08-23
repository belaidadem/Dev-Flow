import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          {/* <Link
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
          </Link> */}
          <div className='flex items-center justify-start gap-4'>
            <Skeleton className='size-14 rounded-full' />
            <Skeleton className='h-14 w-36 rounded-lg' />
          </div>
          <div className='flex justify-end'>
            {/* <Votes
              type='question'
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(
                mongoUser._id
              )}
              downvotes={result.downvotes?.length}
              hasdownVoted={result.downvotes?.includes(
                mongoUser._id
              )}
              hasSaved={mongoUser?.saved.includes(
                result._id
              )}
            /> */}
            <Skeleton className='h-14 w-36 rounded-lg' />
          </div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {/* {result.title} */}
          <Skeleton className='h-14 w-full rounded-lg' />
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        {/* <Metric
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
        /> */}
        <Skeleton className='h-14 w-32 rounded-lg' />
        <Skeleton className='h-14 w-32 rounded-lg' />
        <Skeleton className='h-14 w-32 rounded-lg' />
      </div>
      {/* <ParseHTML data={result.content} /> */}
      <Skeleton className='h-96 w-full rounded-lg' />

      <div className='mt-8 flex flex-wrap gap-2'>
        {/* {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
          />
        ))} */}
        <Skeleton className='h-14 w-32 rounded-lg' />
        <Skeleton className='h-14 w-32 rounded-lg' />
      </div>

      {/* <AllAnswers
        questionId={result._id}
        userId={mongoUser._id}
        page={
          searchParams?.page ? +searchParams.page : 1
        }
        filter={searchParams?.filter}
        totalAnswers={result.answers.length}
      /> */}

      {/* <Answer
        question={result.content}
        questionId={JSON.stringify(questionId)}
        authorId={JSON.stringify(mongoUser._id)}
      /> */}
    </>
  );
};

export default Loading;
