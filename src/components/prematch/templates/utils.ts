import { useState, useRef, useLayoutEffect } from "react";
import { Avvenimento, InfoAggiuntiva, MetaScommessaTemplate, Scommessa } from "src/components/prematch/prematch-api";
import { makeChiaveScommessa } from "src/types/chiavi";

export function rightAlignedColumn(columns: number, length: number, index: number) {
  const cellColumnOnFullRow = index % columns;
  const cellRow = Math.floor(index / columns);
  const lastRow = Math.floor((length - 1) / columns);
  const lastRowCells = length % columns;
  const lastRowOffset = lastRowCells === 0 ? 0 : columns - lastRowCells;
  const cellColumn = cellRow !== lastRow ? cellColumnOnFullRow : lastRowOffset + cellColumnOnFullRow;
  return cellColumn + 1;
}

export const setFallbackImageSrc = (src: string) => (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  event.currentTarget.src = src;
};

export function useForeignClickOpen<T extends Element = HTMLDivElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<T | null>(null);
  useLayoutEffect(() => {
    if (isOpen) {
      const onClick = (event: MouseEvent) => {
        if (!selectRef.current?.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [isOpen]);
  return { isOpen, setIsOpen, selectRef };
}

export const getAvvenimentoListWithInfoAggiuntiva = (
  avvenimentoList: Avvenimento[],
  metaScommessaTemplate: MetaScommessaTemplate,
  scommessaMap: Record<string, Scommessa>,
  infoAggiuntivaMap: Record<string, InfoAggiuntiva>,
) => {
  return avvenimentoList.filter((avvenimento) => {
    /*     const scommessa = avvenimento.scommessaKeyDataList.find(
      (scommessaKeyDataList) => scommessaMap[scommessaKeyDataList.key],
    ); */

    const infoAggiuntive = metaScommessaTemplate.codiceScommessaList
      .map(
        (codiceScommessa) =>
          scommessaMap[
            makeChiaveScommessa({
              codicePalinsesto: avvenimento.codicePalinsesto,
              codiceAvvenimento: avvenimento.codiceAvvenimento,
              codiceScommessa,
            })
          ],
      )
      .filter(Boolean)
      .flatMap((scommessa) =>
        scommessa.infoAggiuntivaKeyDataList
          .map((infoAggiuntivaKeyData) => infoAggiuntivaMap[infoAggiuntivaKeyData.key])
          .filter(Boolean),
      );
    return infoAggiuntive.length > 0;
  });
};
