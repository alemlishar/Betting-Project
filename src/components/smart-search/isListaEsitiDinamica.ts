import { ClasseEsitoSmart } from "src/components/smart-search/smart-api";

export function getListaEsitiDinamica(classeEsito: ClasseEsitoSmart) {
  return classeEsito.listaEsitiDinamica;
}

export function getListaEsitiDinamicaColumnsNumber(classeEsito: ClasseEsitoSmart) {
  switch (getListaEsitiDinamica(classeEsito)) {
    case true:
      return 2;
    case false:
      return 4;
  }
}
