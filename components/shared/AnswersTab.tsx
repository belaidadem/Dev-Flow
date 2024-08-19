import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import Pagination from './Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import { SignedIn } from '@clerk/nextjs';
import EditDeleteAction from './EditDeleteAction';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({
  searchParams,
  userId,
  clerkId
}: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams?.page ? +searchParams.page : 1
  });

  const showActionButtons =
    clerkId &&
    clerkId === result.answers[0]?.author.clerkId;

  return (
    <>
      <div className='mt-10'>
        {result.answers.map((answer) => (
          <article
            key={answer._id}
            className='card-wrapper rounded-[10px] p-9 sm:px-11'
          >
            <div className='flex items-center justify-between'>
              {/* SPAN ID */}
              <div className='mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt={`${answer.author.name} profile picture`}
                    className='rounded-full object-cover max-sm:mt-0.5'
                  />
                  <div className='flex flex-col sm:flex-row sm:items-center'>
                    <p className='body-semibold text-dark300_light700'>
                      {answer.author.name}
                    </p>

                    <p className='small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1'>
                      answered{' '}
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div
                  className='flex justify-end
                '
                >
                  <SignedIn>
                    {showActionButtons && (
                      <EditDeleteAction
                        type='Answer'
                        itemId={JSON.stringify(
                          answer._id
                        )}
                      />
                    )}
                  </SignedIn>
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>

      {result.answers.length > 0 ? (
        <div className='mt-10'>
          <Pagination
            pageNumber={
              searchParams?.page
                ? +searchParams.page
                : 1
            }
            isNext={result.isNext}
            scroll={false}
          />
        </div>
      ) : (
        'No answers found for this user'
      )}
    </>
  );
};

export default AnswersTab;
