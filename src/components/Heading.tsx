import type React from 'react';

interface HeadingProps {
  text: string;
}

const Heading: React.FC<HeadingProps> = ({ text }) => {
  return (
    <h2 className="text-inverse-surface bg-inverse-on-surface outlined mx-auto mb-6 w-fit rounded-full px-5 py-2.5 text-center font-sans text-3xl font-bold text-balance sm:text-4xl md:text-5xl">
      {text}
    </h2>
  );
};

export default Heading;
