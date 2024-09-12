'use client';

import { viewQeustion } from '@/lib/actions/interaction.action';
import { voteQuestion } from '@/lib/actions/question.action';
import { saveQuestion } from '@/lib/actions/user.action';
import { formatNumber } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import React, { useEffect, useState, useRef } from 'react';
import { toast } from '../ui/use-toast';

interface Props {
  type: string;
  itemId: string;
  userId: string | undefined;
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
  const itemid = itemId;
  const userid = userId;
  const router = useRouter();
  const hasViewed = useRef(false); // Add a ref to track if the view has been recorded

  const handleSave = async () => {
    if (!userId)
      return toast({
        title: 'Please log in',
        description: 'To save questions or upvote/downvote, please log in.'
      });
    setIsVoting(true);
    await saveQuestion({
      itemid,
      userid,
      hasSaved,
      path: pathname
    });
  };

  const handleVote = async (action: string) => {
    if (!userId)
      return toast({
        title: 'Please log in',
        description: 'To save questions or upvote/downvote, please log in.'
      });
    setIsVoting(true);
    const result: any = JSON.parse(
      await voteQuestion({
        type,
        itemid,
        userid,
        action,
        hasupVoted,
        hasdownVoted,
        path: pathname
      })
    );

    if (result._id) {
      toast({
        title:
          action === 'upvote'
            ? hasupVoted
              ? 'Upvote Removed'
              : 'Upvoted!'
            : hasdownVoted
              ? 'Downvote removed'
              : 'Downvoted!',
        description:
          action === 'upvote'
            ? hasupVoted
              ? 'Upvote removed successfully'
              : 'You have successfully upvoted this ' + `${type}.`
            : hasdownVoted
              ? 'Downvote removed successfully'
              : 'You have successfully downvoted this ' + `${type}.`
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while trying to vote for this question.'
      });
    }
    setIsVoting(false);
  };

  useEffect(() => {
    if (!userId) return;
    if (!hasViewed.current) {
      const questionId = itemId; // Extract the questionId from the router query
      viewQeustion({
        questionId,
        userId: userId || undefined
      });
      hasViewed.current = true; // Set the ref to true after the view is recorded
    }
  }, [itemId, userId, pathname, router]);

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
