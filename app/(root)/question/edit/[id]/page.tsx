import Question from '@/components/forms/Question';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Question | Dev Overflow',
  description: 'Edit your question on Dev Overflow.'
};

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({
    questionId: params.id
  });

  const resultProps = JSON.parse(
    JSON.stringify(result)
  );
  const mongoUserProps = JSON.parse(
    JSON.stringify(mongoUser)
  );

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        Edit Question
      </h1>
      <div className='mt-9'>
        <Question
          type='Edit'
          mongoUserId={mongoUserProps._id}
          questionDetail={resultProps}
        />
      </div>
    </>
  );
};

export default page;
