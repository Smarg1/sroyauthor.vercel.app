'use client';

import { YouTubeEmbed } from '@next/third-parties/google';
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface Props {
  id: string;
}

const YouTube: FC<Props> = ({ id }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-full w-full">
          <YouTubeEmbed
            videoid={id}
            params={[
              'rel=0',
              'iv_load_policy=3',
              'playsinline=1',
              'controls=1',
              'fs=1',
              'disablekb=1',
            ].join('&')}
          />
        </div>
      </div>
    </div>
  );
};

export default YouTube;
