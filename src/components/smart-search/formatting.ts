import { IdInfoAggiuntiva } from "src/types/chiavi";

export function formatIdInfoAggiuntiva(
  idInfoAggiuntiva: IdInfoAggiuntiva | string
) {
  return String(idInfoAggiuntiva).replace("-", "0");
}
