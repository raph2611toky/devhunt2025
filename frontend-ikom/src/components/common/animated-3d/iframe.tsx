'use client';

export default function Home() {
  const baseUrl = 'https://sign.mt/';
  const params = new URLSearchParams({
    embed: '',
    spl: 'fr',
    sil: 'ase',
    text: 'Bonjour toi',
  });
  return (
    <div className="w-full h-full">
      <iframe
        src={`${baseUrl}?${params.toString()}`}
        title="Sign Language Demo"
        // width="100%"
        // height="100%"
        className="h-72 w-72"
        allowFullScreen
        // sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  );
}
