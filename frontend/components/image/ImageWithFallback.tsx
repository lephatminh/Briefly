import React, { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  imgSrc: string,
  alt: string,
  fallbackSrc: string,
  width: number,
  height: number,
  className: string,
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { fallbackSrc, imgSrc, alt, width, height, className } = props;
  const [error, setError] = useState(false);

  const isUrl = (url: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const testUrl = new URL(url);
    } catch {
      return false;
    }
    return true;
  };

  return (
    <Image
      width={width}
      height={height}
      src={(isUrl(imgSrc) || imgSrc.startsWith('/')) && !error ? imgSrc : fallbackSrc}
      alt={alt}
      onError={() => {
        setError(true);
      }}
      className={className}
    />
  );
};

export default ImageWithFallback