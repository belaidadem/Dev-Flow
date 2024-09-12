import { getTopInteractiveTags } from '@/lib/actions/tag.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Badge } from '../ui/badge';

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ user }: Props) => {
  const interactedTags = await getTopInteractiveTags({
    userId: user._id
  });

  return (
    <>
      <Link
        href={`/profile/${user.clerkId}`}
        className='background-light900_dark200 light-border flex flex-col items-center justify-center rounded-2xl border p-8 shadow'
      >
        <div className='flex w-full flex-col items-center justify-center'>
          <Image
            src={user.picture}
            alt='user profile picture'
            width={100}
            height={100}
            className='rounded-full object-contain'
          />
          <div className='mt-4 text-center'>
            <h3 className='h3-bold text-dark200_light900 line-clamp-1'>
              {user.name}
            </h3>
            <p className='body-regular text-dark500_light500 mt-2'>
              @{user.username}
            </p>
          </div>
        </div>

        <div className='mt-5'>
          {interactedTags.length > 0 ? (
            <div className='flex items-center gap-2'>
              {interactedTags.map((tag) => (
                <Badge
                  key={tag._id}
                  className='subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge>No tags yet</Badge>
          )}
        </div>
      </Link>
    </>
  );
};

export default UserCard;
