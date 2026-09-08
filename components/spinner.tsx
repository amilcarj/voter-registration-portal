import { Loader2 } from "lucide-react";

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      {label && <p className="text-sm text-brand-secondary">{label}</p>}
    </div>
  );
}
