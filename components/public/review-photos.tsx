import Image from "next/image";

export function ReviewPhotos({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {urls.map((url) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
        >
          <Image
            src={url}
            alt="Review photo"
            fill
            sizes="120px"
            className="object-cover"
          />
        </a>
      ))}
    </div>
  );
}
