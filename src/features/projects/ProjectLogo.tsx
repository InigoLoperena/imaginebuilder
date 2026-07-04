import { useLogoUrl } from "./api";

export function ProjectLogo({
  path,
  name,
  size = 48,
  className = "",
}: {
  path: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const { data: url } = useLogoUrl(path);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (url) {
    return (
      <div
        className={`rounded-md bg-background/40 flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={url}
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }
  return (
    <div
      className={`rounded-md bg-primary/20 text-primary font-semibold flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
}
