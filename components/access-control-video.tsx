export function AccessControlVideo({
  src,
  youtubeId,
  frameTitle,
  frameId,
}: {
  src?: string;
  youtubeId?: string;
  frameTitle?: string;
  frameId?: string;
}) {
  return (
    <section className="flex w-full justify-center bg-background px-6">
      <div className="w-full overflow-hidden rounded-sm shadow-sm md:w-[60%]">
        {frameId || frameTitle || youtubeId ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src={
                frameId
                  ? `https://jci-me2.github.io/videoframes/#${frameId}`
                  : frameTitle
                    ? `https://jci-me2.github.io/videoframes/?title=${encodeURIComponent(frameTitle)}`
                    : `https://www.youtube-nocookie.com/embed/${youtubeId}`
              }
              title={frameTitle || "Video"}
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
