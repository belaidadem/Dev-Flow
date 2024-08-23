import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900 uppercase'>
          {/* {result.tag.name} */}
          <Skeleton className='h-14 w-[200px] rounded-lg' />
        </h1>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        {/* <LocalSearchBar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions...'
          otherClasses='flex-1'
        />
        <Filter
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-width-[170px]'
        /> */}
        <Skeleton className='h-14 w-full rounded-lg' />

        <Skeleton className='h-14 w-[200px] rounded-lg' />
      </div>
      <div className='mt-10 flex w-full flex-col gap-6'>
        {/* {result.tag.questions.length > 0 ? (
          result.tag.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={new Date(question.createdAt)}
            />
          ))
        ) : (
          <NoResult
            title='There are no questions to show'
            description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Your query could be the next big thing others learn from. Get involved! 💡.'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )} */}
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
      </div>
    </>
  );
};

export default Loading;
