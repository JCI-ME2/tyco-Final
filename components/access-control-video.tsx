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
    <section className="flex w-full justify-center bg-background">
      <div className="w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden p-0 m-0 bg-transparent border-0 shadow-none">
        {frameId || frameTitle || youtubeId ? (
          <div className="relative w-full h-full overflow-hidden p-0 m-0">
            <iframe
              className="w-full h-full border-0 block p-0 m-0"
              src={
                frameId
                  ? `https://jci-me2.github.io/videoframes/#${frameId}`
                  : frameTitle
                    ? `https://jci-me2.github.io/videoframes/?title=${encodeURIComponent(frameTitle)}`
                    : `https://www.youtube-nocookie.com/embed/${youtubeId}`
              }
              title={frameTitle || "Video"}
              scrolling="no"
              loading="lazy"
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
