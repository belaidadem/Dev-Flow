import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Votes from './Votes';
import Image from 'next/image';
import Link from 'next/link';
import AnswerCard from '../cards/AnswerCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswersTab = async ({
  searchParams,
  userId,
  clerkId
}: Props) => {
  const result = await getUserAnswers({ userId });

  return (
    <>
      {result.answers.map((answer) => (
        // <Link
        //   key={answer._id}
        //   href={`/question/${answer.question._id}`}
        // >
        //   <article
        //     // key={answer._id}
        //     className='light-border card-wrapper mb-5 rounded-[10px] border-b p-9 sm:px-11'
        //   >
        //     <div className='flex items-center justify-between '>
        //       <div className='mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        //         <Link
        //           href={`/profile/${answer.author.clerkId}`}
        //           className='flex flex-1 items-start gap-1 sm:items-center'
        //         >
        //           <Image
        //             src={answer.author.picture}
        //             width={18}
        //             height={18}
        //             alt={`${answer.author.name} profile picture`}
        //             className='rounded-full object-cover max-sm:mt-0.5'
        //           />
        //           <div className='flex flex-col sm:flex-row sm:items-center'>
        //             <p className='body-semibold text-dark300_light700'>
        //               {answer.author.name}
        //             </p>

        //             <p className='small-regular text-light400_light500 ml-1 mt-0.5 line-clamp-1'>
        //               answered{' '}
        //               {getTimestamp(answer.createdAt)}
        //             </p>
        //           </div>
        //         </Link>
        //         <div
        //           className='flex justify-end
        //         '
        //         >
        //           <Votes
        //             type='answer'
        //             itemId={JSON.stringify(answer._id)}
        //             userId={JSON.stringify(userId)}
        //             upvotes={answer.upvotes.length}
        //             hasupVoted={answer.upvotes.includes(
        //               userId
        //             )}
        //             hasSaved={false}
        //             downvotes={answer.downvotes.length}
        //             hasdownVoted={answer.downvotes.includes(
        //               userId
        //             )}
        //           />
        //         </div>
        //       </div>
        //     </div>
        //     <ParseHTML data={answer.content} />
        //   </article>
        // </Link>

        // clerkId,
        // _id,
        // question,
        // author,
        // upvotes,
        // createdAt

        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
    </>
  );
};

export default AnswersTab;
