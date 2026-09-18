export function AccessControlVideo({ src, youtubeId }: { src?: string; youtubeId?: string }) {
  return (
    <section className="flex w-full justify-center bg-background px-6">
      <div className="w-full overflow-hidden rounded-sm shadow-sm md:w-[60%]">
        {youtubeId ? (
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title="Illustra Cameras video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video width={1600} height={636} className="h-auto w-full object-contain" controls muted={false}>
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
}
