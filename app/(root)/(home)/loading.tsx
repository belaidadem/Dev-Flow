import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>
          All Question
        </h1>

        {/* button */}
        <Skeleton className='h-14 w-44 rounded-lg' />
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        {/* local search bar */}
        <Skeleton className='h-14 w-full rounded-lg' />

        {/* filter */}
      </div>
      <div className='mt-8 flex justify-start gap-5'>
        <Skeleton className='h-14 w-[150px] rounded-lg' />
        <Skeleton className='h-14 w-[150px] rounded-lg' />
        <Skeleton className='h-14 w-[150px] rounded-lg' />
        <Skeleton className='h-14 w-[150px] rounded-lg' />
      </div>
      <div className='mt-10 flex w-full flex-col gap-6'>
        {/* cards */}
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
      </div>
    </>
  );
}
