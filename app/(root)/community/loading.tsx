import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        All Users
      </h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <Skeleton className='h-14 w-full rounded-lg' />

        <Skeleton className='h-14 w-[200px] rounded-lg' />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        <Skeleton className='h-[284px] w-[188px] rounded-2xl' />
        <Skeleton className='h-[284px] w-[188px] rounded-2xl' />
        <Skeleton className='h-[284px] w-[188px] rounded-2xl' />
        <Skeleton className='h-[284px] w-[188px] rounded-2xl' />
      </section>
    </>
  );
};

export default Loading;
