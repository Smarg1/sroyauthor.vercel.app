const jsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sangita Roy',
  url: 'https://sroyauthor.vercel.app',
  image: 'https://sroyauthor.vercel.app/sp.png',
  jobTitle: 'Author',
  worksFor: {
    '@type': 'Person',
    name: 'S.Roy Author',
  },
  description: 'Nature-fiction author blending nature and imagination through fiction.',
  sameAs: [
    'https://github.com/smarg1',
    'https://www.linkedin.com/in/sangita-roy',
    'https://x.com/sangitaroy',
  ],
  publisher: {
    '@type': 'Person',
    name: 'S.Roy Author',
    logo: {
      '@type': 'ImageObject',
      url: 'https://sroyauthor.vercel.app/sp.png',
    },
  },
};

export default function JsonLD() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
