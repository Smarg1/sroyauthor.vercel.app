import type { FC } from 'react';

interface Props {
  id: string;
  title?: string;
}

const YouTube: FC<Props> = ({ id, title = 'YouTube video player' }) => {
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&iv_load_policy=3&playsinline=1&controls=1&fs=1&disablekb=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        className="h-full w-full animate-in fade-in duration-500"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export default YouTube;
