"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

type ProjectImageProps = Omit<ImageProps, 'onError' | 'src'> & {
  src: string | string[] | null | undefined;
  index?: number;
  className?: string;
};

// Bold text-based placeholder that displays the project name
const ImagePlaceholder = ({ className, alt, ...props }: { className?: string, alt?: string }) => {
  // Extract the project name from alt text or use a fallback
  const title = alt || 'Project';
  
  // Get initial letters for the background (up to 2 characters)
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
  
  return (
    <div 
      className={cn(
        "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Semi-transparent initials in background */}
      <div className="absolute opacity-10 text-white font-bold text-[200px]" aria-hidden="true">
        {initials}
      </div>
      
      <div className="z-10 p-4 md:p-8 text-center">
        <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2 max-w-[80%] mx-auto leading-tight">
          {title}
        </h3>
        <div className="h-1 w-16 bg-white/20 mx-auto mt-4 rounded-full"></div>
      </div>
    </div>
  );
};

export default function ProjectImage({
  src,
  alt,
  index = 0,
  className,
  ...props
}: ProjectImageProps) {
  // Get the actual image source from string or array
  const getImageSrc = () => {
    if (!src) return null;
    if (Array.isArray(src)) {
      return src.length > 0 ? src[index] : null;
    }
    return src;
  };

  const [imgSrc, setImgSrc] = useState<string | null>(getImageSrc());
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Update image source when src prop or index changes
    setImgSrc(getImageSrc());
    setHasError(false);
  }, [src, index]);

  const handleError = () => {
    setImgSrc(null);
    setHasError(true);
  };

  // If no image source or there was an error, render the placeholder
  if (!imgSrc || hasError) {
    return <ImagePlaceholder className={className} alt={alt} />;
  }

  // Otherwise render the actual image
  return (
    <Image
      {...props}
      className={className}
      src={imgSrc}
      alt={alt || "Project image"}
      onError={handleError}
    />
  );
} 