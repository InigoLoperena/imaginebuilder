import { useLogoUrl } from "./api";

export function ProjectLogo({ path, name, size = 48 }: { path: string | null; name: string; size?: number }) {
  const { data: url } = useLogoUrl(path);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="rounded-md object-cover bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-md bg-primary/20 text-primary font-semibold flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
}
