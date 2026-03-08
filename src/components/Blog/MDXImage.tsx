import Image from 'next/image';

interface Prop {
  alt?: string;
  height?: number;
  src: string;
  width?: number;
}

export default function MDXImage({ src, alt = '', width, height }: Prop) {
  return (
    <span className="relative aspect-auto h-fit w-full overflow-hidden rounded-xl">
      <Image
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 800}
        sizes="(max-width: 768px) 100vw, 768px"
        className="outlined h-auto w-full object-cover"
      />
    </span>
  );
}
