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
        {frameId || youtubeId ? (
          <div className="w-full aspect-video rounded-xl overflow-hidden p-0 m-0 bg-transparent">
            <iframe
              className="w-full h-full border-0 block"
              src={
                frameId
                  ? `https://jci-me2.github.io/videoframes/?v=${encodeURIComponent(frameId)}`
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
