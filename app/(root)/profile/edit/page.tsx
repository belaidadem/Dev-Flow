import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile | Dev Overflow',
  description: 'Edit your profile on Dev Overflow.'
};

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  const mongoUserProps = JSON.parse(
    JSON.stringify(mongoUser)
  );

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        Edit Profile
      </h1>
      <div className='mt-9'>
        <Profile
          clerkId={userId}
          user={mongoUserProps}
        />
      </div>
    </>
  );
};

export default page;
