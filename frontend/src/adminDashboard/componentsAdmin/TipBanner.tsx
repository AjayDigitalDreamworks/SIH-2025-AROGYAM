import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

export function TipBanner({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="tip-banner mb-4">
      <Lightbulb className="w-4 h-4 text-arogyam-yellow flex-shrink-0" />
      <span className="flex-1">{message}</span>
      <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
