import TagCard from '@/components/cards/TagCard';
import Filter from '@/components/shared/Filters';
import NoResult from '@/components/shared/NoResult';
import LocalSearchBar from '@/components/shared/search/LocalSearchBar';
import { TagFilters } from '@/constants/filters';
import { getAllTags } from '@/lib/actions/tag.actions';
import React from 'react';

const Page = async () => {
  const result = await getAllTags({});
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        All Tags
      </h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchBar
          route='/community'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for tags...'
          otherClasses='flex-1'
        />

        <Filter
          filters={TagFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <section className='mt-12 flex flex-wrap gap-4'>
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <TagCard key={tag._id} tag={tag} />
          ))
        ) : (
          <NoResult
            title='No Tags Found'
            description='It looks like there are no tags found.'
            link='/ask-question'
            linkTitle='Ask a question'
          />
        )}
      </section>
    </>
  );
};

export default Page;
