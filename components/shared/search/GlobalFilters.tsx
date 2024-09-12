'use client';
import { Badge } from '@/components/ui/badge';
import { GlobalSearchFilters } from '@/constants/filters';
import { formUrlQuery } from '@/lib/utils';
import {
  useRouter,
  useSearchParams
} from 'next/navigation';
import React, { useState } from 'react';

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isActive, setIsActive] = useState('');

  const handleClick = (type: string) => {
    if (isActive === type) {
      setIsActive('');
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null
      });
      router.push(newUrl, { scroll: false });
    } else {
      setIsActive(type);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: type
      });
      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className='flex items-center gap-8 px-5'>
      <div>
        <p className='text-dark400_light700 body-regular'>
          Types:
        </p>
      </div>
      <div className='flex gap-6'>
        {GlobalSearchFilters.map((filter) => (
          <Badge
            key={filter.value}
            className={`subtle-medium background-light700_dark400 text-light400_light500 cursor-pointer rounded-3xl border-none px-4 py-2 uppercase
            ${isActive === filter.value ? 'bg-primary-500/50 text-white dark:bg-primary-500/50 dark:text-primary-100' : 'text-light-500'}  
            `}
            onClick={() => {
              setIsActive(filter.value);
              handleClick(filter.value);
            }}
          >
            {filter.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
