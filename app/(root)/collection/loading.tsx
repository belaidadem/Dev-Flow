import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>
          Saved Questions
        </h1>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <Skeleton className='h-14 w-full rounded-lg' />

        <Skeleton className='h-14 w-[200px] rounded-lg max-sm:w-full' />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
      </div>
    </>
  );
};

export default Loading;
