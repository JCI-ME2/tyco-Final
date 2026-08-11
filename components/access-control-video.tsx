export function AccessControlVideo({ src }: { src: string }) {
  return (
    <section className="w-full bg-gradient-to-br from-hero-from via-hero-from to-hero-to px-6 flex justify-center">
      <div className="overflow-hidden rounded-sm shadow-sm" style={{ width: "52.5%" }}>
        <video
          width={1600}
          height={636}
          className="w-full h-auto object-contain"
          controls
          muted={false}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
