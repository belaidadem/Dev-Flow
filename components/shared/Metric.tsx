import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  isAuthor?: boolean;
  textStyles?: string;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  isAuthor,
  textStyles
}: Props) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={16}
        height={16}
        className={`object-contain ${href ? 'rounded-full' : ''}`}
      />
      <p
        className={`${textStyles} flex items-center gap-1`}
      >
        {value}

        <span
          className={`small-regular line-clamp-1 ${isAuthor ? 'max-sm:hidden' : ''}`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className='flex-center gap-1'
      >
        {metricContent}
      </Link>
    );
  }

  return (
    <div className='flex-center gap-1'>
      {metricContent}
    </div>
  );
};

export default Metric;
