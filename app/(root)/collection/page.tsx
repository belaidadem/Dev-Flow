import Filters from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { QuestionFilters } from '@/constants/filters';
import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { getSavedQuestions } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import SavedQuestionCard from '@/components/cards/SavedQuestionCard';
import { SearchParamsProps } from '@/types';

const Home = async ({
  searchParams
}: SearchParamsProps) => {
  const { userId } = auth();

  if (!userId) redirect('/sign-in');

  const data = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q
  });

  const result = JSON.parse(JSON.stringify(data));

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>
          Saved Questions
        </h1>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar
          route='/collection'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions...'
          otherClasses='flex-1'
        />
        <Filters
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-width-[170px]'
          containerClasses='max-md:flex'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <SavedQuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              saved={true}
              author={question.author}
              answers={question.answers}
              upvotes={question.upvotes}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='There are no saved questions to show'
            description='Be the first to break the slience! 🚀 Save a Qeustion and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡.'
            link='/'
            linkTitle='Save a Question'
          />
        )}
      </div>
    </>
  );
};

export default Home;
