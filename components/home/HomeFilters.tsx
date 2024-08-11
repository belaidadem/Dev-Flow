'use client';

import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import {
  formUrlQuery,
  removeKeysFromQuery
} from '@/lib/utils';
import {
  useRouter,
  useSearchParams
} from 'next/navigation';
import router from 'next/router';
import React, { useState } from 'react';

const HomeFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState('');

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('');

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={`body-medium background-light800_darkgradient rounded-lg px-6 py-3 capitalize shadow-none ${active === item.value ? 'bg-primary-100 text-primary-500 dark:bg-primary-500 dark:text-primary-100' : 'text-light-500'}`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
