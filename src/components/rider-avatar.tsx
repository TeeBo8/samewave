import Image from "next/image"

type Props = {
  image?: string | null
  name: string
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: { className: "w-8 h-8 text-xs", px: 32 },
  md: { className: "w-10 h-10 text-sm", px: 40 },
  lg: { className: "w-16 h-16 text-xl", px: 64 },
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function RiderAvatar({ image, name, size = "sm" }: Props) {
  const { className, px } = SIZES[size]

  return (
    <div
      className={`${className} rounded-full overflow-hidden bg-muted flex items-center justify-center font-semibold text-muted-foreground shrink-0`}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={px}
          height={px}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
