import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <>
      <div className='flex flex-col-reverse items-start justify-between sm:flex-row'>
        <div className='flex flex-col items-start gap-4 lg:flex-row'>
          {/* <Image
            src={userInfo?.user.picture}
            alt='Profile picture'
            width={140}
            height={140}
            className='rounded-full object-cover'
          /> */}
          <Skeleton className='size-[140px] rounded-full' />

          <div className='mt-3'>
            <h2 className='h2-bold text-dark100_light900'>
              {/* {userInfo.user.name} */}
              <Skeleton className='h-14 w-[200px] rounded-lg' />
            </h2>
            <p className='paragraph-regular text-dark200_light800'>
              {/* @{userInfo.user.username} */}
            </p>

            <div className='mt-5 flex flex-wrap items-center justify-start gap-5'>
              {/* profile links here */}
              {/* {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl='/assets/icons/link.svg'
                  title='Portfolio'
                  href={userInfo.user.portfolioWebsite}
                />
              )} */}

              {/* {userInfo.user.location && (
                <ProfileLink
                  imgUrl='/assets/icons/location.svg'
                  title={userInfo.user.location}
                />
              )} */}

              {/* {userInfo.user.joineAt && (
                <ProfileLink
                  imgUrl='/assets/icons/calendar.svg'
                  title={formatDate(
                    userInfo.user.joineAt
                  )}
                />
              )} */}

              <Skeleton className='h-14 w-32 rounded-lg' />
              <Skeleton className='h-14 w-32 rounded-lg' />
              <Skeleton className='h-14 w-32 rounded-lg' />
            </div>

            {/* {userInfo.user.bio && (
              <p className='paragraph-regular text-dark400_light800 mt-8'>
                {userInfo.user.bio}
              </p>
            )} */}
            <Skeleton className='mt-5 h-[100px] w-full rounded-lg' />
          </div>
        </div>
      </div>
      {/* <Stats
        reputation={userInfo.reputation}
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
        badges={userInfo.badgeCounts}
      /> */}
      <div className='mt-5 flex flex-wrap gap-5'>
        <Skeleton className='h-24 w-40 flex-1 rounded-lg' />
        <Skeleton className='h-24 w-40 flex-1 rounded-lg' />
        <Skeleton className='h-24 w-40 flex-1 rounded-lg' />
        <Skeleton className='h-24 w-40 flex-1 rounded-lg' />
      </div>
    </>
  );
};

export default Loading;
