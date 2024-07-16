import Filters from '@/components/shared/Filters';
import QuestionCard from '@/components/cards/QuestionCard';
import HomeFilters from '@/components/home/HomeFilters';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import Link from 'next/link';
import React from 'react';

const questions = [
  {
    _id: '1',
    title: 'Cascading Deletes in SQLAlechemy?',
    tags: [
      {
        _id: '1',
        name: 'database'
      },
      {
        _id: '2',
        name: 'python'
      }
    ],
    author: {
      _id: '1',
      name: 'John Doe',
      picture: 'url_to_picture'
    },
    upvotes: 1233254,
    views: 500590,
    answers: [
      {
        /* object representing an answer */
      }
    ],
    createdAt: new Date(
      '2024-05-01T12:34:56.000Z'
    ) // Use Date object
  },
  {
    _id: '2',
    title: 'Python Debugging Techniques?',
    tags: [
      {
        _id: '1',
        name: 'python'
      }
    ],
    author: {
      _id: '2',
      name: 'Jane Smith',
      picture: 'url_to_picture'
    },
    upvotes: 5,
    views: 50,
    answers: [],
    createdAt: new Date(
      '2021-08-31T14:45:30.000Z'
    ) // Use Date object
  }
];

const Home = () => {
  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>
          All Question
        </h1>

        {questions.length > 0 ? (
          <Link
            href={'/ask-question'}
            className='flex justify-end max-sm:w-full'
          >
            <Button className=' primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
              Ask a Question
            </Button>
          </Link>
        ) : (
          ''
        )}
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions...'
          otherClasses='flex-1'
        />
        <Filters
          filters={HomePageFilters}
          otherClasses='min-h-[56px] sm:min-width-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />
      <div className='mt-10 flex w-full flex-col gap-6'>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='There are no questions to show'
            description='Be the first to break the slience! 🚀 Ask a Qeustion and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡.'
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>
    </>
  );
};

export default Home;
