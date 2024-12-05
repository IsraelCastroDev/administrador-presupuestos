interface LogoProps {
  variant: "slate" | "white";
}

export default function Logo({ variant }: LogoProps) {
  return (
    <p
      className={`text-4xl ${
        variant === "slate" ? "text-slate-700" : "text-white"
      } font-black`}
    >
      PlanificaYa!
    </p>
  );
}
