'use client';

import { voteQuestion } from '@/lib/actions/question.action';
import { saveQuestion } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
  hasSaved
}: Props) => {
  const pathname = usePathname();
  const [isVoting, setIsVoting] = useState(false);
  const itemid = JSON.parse(itemId);
  const userid = JSON.parse(userId);

  const handleSave = async () => {
    await saveQuestion({
      itemid,
      userid,
      hasSaved,
      path: pathname
    });
  };

  const handleVote = async (action: string) => {
    if (!itemid || isVoting) return;
    setIsVoting(true);
    await voteQuestion({
      type,
      itemid,
      userid,
      action,
      hasupVoted,
      hasdownVoted,
      path: pathname
    });
    setIsVoting(false);
  };

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            alt='upvote'
            width={18}
            height={18}
            className={`cursor-pointer ${isVoting ? 'pointer-events-none' : ''}`}
            onClick={() => handleVote('upvote')}
          />

          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>

        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            alt='downvote'
            width={18}
            height={18}
            className={`cursor-pointer ${isVoting ? 'pointer-events-none' : ''}`}
            onClick={() => handleVote('downvote')}
          />

          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatNumber(downvotes || 0)}
            </p>
          </div>
        </div>
      </div>

      {type === 'question' && (
        <Image
          src={
            hasSaved
              ? '/assets/icons/star-filled.svg'
              : '/assets/icons/star-red.svg'
          }
          width={18}
          height={18}
          alt='star'
          className={`cursor-pointer`}
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
