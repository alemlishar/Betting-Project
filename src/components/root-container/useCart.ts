import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { notifyBigliettoListeners, useEsitiInBiglietto } from "src/components/esito/useEsito";
import {
  ChiaveEsito,
  ChiaveEsitoBigliettoComponents,
  CodiceAvvenimento,
  CodiceEsito,
  CodicePalinsesto,
  CodiceScommessa,
  IdInfoAggiuntiva,
  makeChiaveEsito,
} from "src/types/chiavi";
import { PronosticiParamsType } from "src/types/pronosticiParams.types";

export function useCart(sezione: string) {
  const [pronosticiParams, setPronosticiParams] = useState<Array<PronosticiParamsType> | undefined>(undefined);
  const esitiInBiglietto = useEsitiInBiglietto();
  const pronosticiParamsRef = useRef<Array<PronosticiParamsType> | undefined>(pronosticiParams);

  const addEsitoToCart = useCallback(
    ({
      codicePalinsesto,
      codiceAvvenimento,
      codiceClasseEsito,
      codiceScommessa,
      idInfoAggiuntiva,
      codiceEsito,
      descrizioneAvvenimento,
      descrizioneScommessa,
      descrizioneEsito,
      codiceDisciplina,
      quota,
      legaturaAAMS,
      legaturaMin,
      legaturaMax,
      multipla,
      blackListMin,
      blackListMax,
      isLive,
      codiceManifestazione,
      formattedDataAvvenimento,
      dataAvvenimento,
      siglaDisciplina,
      siglaManifestazione,
      avvenimento,
      manifestazione,
      disciplina,
    }: ChiaveEsitoBigliettoComponents) => {
      // in case of undefined data: in smartsearch we have just the formattedDate
      if (sezione === "sport" || sezione === "live") {
        if (dataAvvenimento === undefined) {
          const date = formattedDataAvvenimento
            .replaceAll("/", "-")
            .substring(0, formattedDataAvvenimento.indexOf(" "));
          const hours = formattedDataAvvenimento
            .substring(formattedDataAvvenimento.lastIndexOf(" "))
            .replace(".", ":")
            .trim();
          const avvenimentoDate = date.concat("T").concat(hours).concat(":00.000Z");
          dataAvvenimento = avvenimentoDate;
        }

        setPronosticiParams([
          {
            codicePalinsesto: codicePalinsesto,
            codiceAvvenimento: codiceAvvenimento,
            codiceScommessa: codiceScommessa,
            codiceEsito: codiceEsito,
            codiceClasseEsito: codiceClasseEsito,
            descrizioneAvvenimento: descrizioneAvvenimento,
            descrizioneScommessa: descrizioneScommessa,
            codiceDisciplina: codiceDisciplina,
            descrizioneEsito: descrizioneEsito,
            quota: quota,
            idInfoAggiuntiva: idInfoAggiuntiva,
            legameMultipla: legaturaAAMS,
            legameMinimo: legaturaMin,
            legameMassimo: legaturaMax,
            multipla: multipla,
            blackListMin: blackListMin,
            blackListMax: blackListMax,
            live: isLive,
            codiceManifestazione: codiceManifestazione,
            formattedDataAvvenimento: formattedDataAvvenimento,
            dataAvvenimento: dataAvvenimento,
            siglaDisciplina: siglaDisciplina,
            siglaManifestazione: siglaManifestazione,
            avvenimento: avvenimento,
            manifestazione: manifestazione,
            disciplina: disciplina,
          },
        ]);
      }
    },
    [sezione],
  );

  const addMultyEsitoToCart = useCallback((pronostici: Array<PronosticiParamsType>) => {
    setPronosticiParams(pronostici);
  }, []);

  const updateRecord = useCallback(
    (
      events: Array<{
        codicePalinsesto: CodicePalinsesto;
        codiceAvvenimento: CodiceAvvenimento;
        codiceScommessa: CodiceScommessa;
        idInfoAggiuntiva: IdInfoAggiuntiva;
        codiceEsito: CodiceEsito;
      }>,
    ): void => {
      const chiaviEsitoSet = new Set(events.map((esito) => makeChiaveEsito(esito)));
      notifyBigliettoListeners(chiaviEsitoSet);
    },
    [],
  );

  const esitiInCarrello = useMemo(() => {
    if (!pronosticiParams) {
      return new Set<ChiaveEsito>();
    }
    if (pronosticiParamsRef.current === pronosticiParams) {
      return esitiInBiglietto;
    }
    pronosticiParamsRef.current = pronosticiParams;
    return pronosticiParams.reduce((chiaviEsitoAcc, pronostico) => {
      const { codicePalinsesto, codiceAvvenimento, codiceScommessa, idInfoAggiuntiva, codiceEsito } = pronostico;
      const chiaveEsito = makeChiaveEsito({
        codicePalinsesto,
        codiceAvvenimento,
        codiceScommessa,
        idInfoAggiuntiva,
        codiceEsito,
      });
      if (!esitiInBiglietto || esitiInBiglietto?.size === 0) {
        const newChiaviEsito = new Set(chiaviEsitoAcc);
        newChiaviEsito.add(chiaveEsito);
        chiaviEsitoAcc = newChiaviEsito;
      } else {
        const newChiaviEsito = new Set(esitiInBiglietto);
        if (chiaviEsitoAcc.has(chiaveEsito)) {
          newChiaviEsito.delete(chiaveEsito);
          chiaviEsitoAcc = newChiaviEsito;
        } else {
          newChiaviEsito.add(chiaveEsito);
          chiaviEsitoAcc = newChiaviEsito;
        }
      }
      return chiaviEsitoAcc;
    }, new Set<ChiaveEsito>());
  }, [esitiInBiglietto, pronosticiParams]);

  useEffect(() => {
    if (esitiInCarrello === esitiInBiglietto) {
      return;
    }
    notifyBigliettoListeners(esitiInCarrello);
  }, [esitiInCarrello, esitiInBiglietto]);

  useEffect(() => {
    if (sezione !== "sport" && sezione !== "live") {
      setPronosticiParams([]);
    }
  }, [sezione]);

  return {
    pronosticiParams,

    esitiInCarrello,
    addEsitoToCart,
    addMultyEsitoToCart,
    updateRecord,
  };
}
