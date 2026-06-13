import logoAsset from "@/assets/logo.asset.json";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img src={logoAsset.url} alt="Techno Dental" className={className} />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo className="h-9 w-9" />
      <span className="font-display text-[19px] font-bold tracking-tight">
        <span className="text-brand-bright">Techno</span>{" "}
        <span className="text-brand">Dental</span>
      </span>
    </div>
  );
}