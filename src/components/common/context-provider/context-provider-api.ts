import { fetchJSON } from "src/helpers/fetch-json";
import { BonusConfigType } from "src/types/bonusConfig.type";
import { ImpostazioniScommessaType } from "src/types/carrello.types";
import { ConfigResponse } from "src/types/config.types";

export async function getBalance(): Promise<{ amount: number }> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/account/balance`);
}

export async function getBonusSportConfiguration(): Promise<BonusConfigType> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/bonus/configuration?concession=SPORT`);
}
export async function getBonusVirtualConfiguration(): Promise<BonusConfigType> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/bonus/configuration?concession=VIRTUAL`);
}

export async function getUserPreferences(): Promise<ImpostazioniScommessaType> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/user/preferences`);
}

export async function getTerminalSportConfiguration(): Promise<ConfigResponse> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/config?concession=SPORT`);
}

export async function getTerminalVirtualConfiguration(): Promise<ConfigResponse> {
  return fetchJSON(`${process.env.REACT_APP_ENDPOINT}/config?concession=VIRTUAL`);
}
