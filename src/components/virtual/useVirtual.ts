import { useState } from "react";
import { VirtualStateNavigation } from "src/components/virtual/virtual-dto";

export function useVirtual() {
  const [state, setState] = useState<VirtualStateNavigation | undefined>();
  return { state, setState };
}
