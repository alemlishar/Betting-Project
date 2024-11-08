import React from "react";
import { rest } from "msw";
import { render, within } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { server } from "src/mock-server";
import App from "src/App";
import { Alberatura } from "src/components/prematch/prematch-api";

test("loads and displays discipline collapsed, open then close", async () => {
  // Arrange
  server.use(
    rest.get(
      `${process.env.REACT_APP_ENDPOINT}/proxy/api-betting/lettura-palinsesto-sport/palinsesto/prematch/alberaturaPrematch`,
      (req, res, ctx) => {
        return res(ctx.json(mockedAlberatura));
      },
    ),
  );

  const { findByTestId } = render(<App />);

  // Assert
  const { getByText } = within(await findByTestId("discipline"));

  const discipline = Object.values(mockedAlberatura.result.disciplinaMap);
  for (const disciplina of discipline) {
    expect(getByText(disciplina.descrizione.toLowerCase())).toBeInTheDocument();
  }

  const manifestazioniCalcio = mockedAlberatura.result.manifestazioneListByDisciplinaOggi["1"].map(
    (chiaveManifestazione) => mockedAlberatura.result.manifestazioneMap[chiaveManifestazione],
  );
  for (const manifestazione of manifestazioniCalcio) {
    expect(getByText(manifestazione.descrizione)).not.toBeVisible();
  }

  // Act
  userEvent.click(getByText("calcio"));

  // Assert
  for (const manifestazione of manifestazioniCalcio) {
    expect(getByText(manifestazione.descrizione)).toBeVisible();
  }

  // Act
  userEvent.click(getByText("calcio"));

  // Assert
  for (const manifestazione of manifestazioniCalcio) {
    expect(getByText(manifestazione.descrizione)).not.toBeVisible();
  }
});

const mockedAlberatura: { result: Alberatura } = {
  result: {
    disciplinaMap: {
      "17": {
        posizione: 444444444,
        descrizione: "PALLAMANO",
        key: "17",
        codiceDisciplina: 17,
        sigla: "PMANO",
        urlIcona: "/scommesse-portlet/images/ic_disciplina/Ic__0022_disciplina.png",
        palinsestoGiornaliero: false,
        showcase: 1,
      },
      "1": {
        posizione: 1,
        descrizione: "Calcio",
        key: "1",
        codiceDisciplina: 1,
        sigla: "CALCIO",
        urlIcona:
          "https://testfr-www.sisal.it/content/dam/new-dam/italy/prodotto/scommesse/sport/icone/discipline/Calcio.svg",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
      "2": {
        posizione: 2,
        descrizione: "Basket",
        key: "2",
        codiceDisciplina: 2,
        sigla: "BASKET",
        urlIcona:
          "https://testfr-www.sisal.it/content/dam/new-dam/italy/prodotto/scommesse/sport/icone/discipline/Basket.svg",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
      "3": {
        posizione: 3,
        descrizione: "Tennis",
        key: "3",
        codiceDisciplina: 3,
        sigla: "TENNIS",
        urlIcona:
          "https://testfr-www.sisal.it/content/dam/new-dam/italy/prodotto/scommesse/sport/icone/discipline/Tennis.svg",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
      "5": {
        posizione: 2,
        descrizione: "Volley",
        key: "5",
        codiceDisciplina: 5,
        sigla: "VOLLEY",
        urlIcona:
          "https://testfr-www.sisal.it/content/dam/new-dam/italy/prodotto/scommesse/sport/icone/discipline/Volley.svg",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
      "6": {
        posizione: 2,
        descrizione: "Hockey su ghiaccio",
        key: "6",
        codiceDisciplina: 6,
        sigla: "HOCKEY",
        urlIcona:
          "https://testfr-www.sisal.it/content/dam/new-dam/italy/prodotto/scommesse/sport/icone/discipline/Hokey.svg",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
      "11": {
        posizione: 77,
        descrizione: "Ciclismo",
        key: "11",
        codiceDisciplina: 11,
        sigla: "CICLO",
        urlIcona: "https://cdn-static.sisal.it/documents/10903/450920/Ic_cycling.png",
        palinsestoGiornaliero: true,
        showcase: 1,
      },
    },
    manifestazioneMap: {
      "17-89": {
        posizione: 1,
        descrizione: "INT Seha League",
        key: "17-89",
        codiceDisciplina: 17,
        codiceManifestazione: 89,
        topManifestazione: false,
        sigla: "EURSEH",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Europa.jpg",
        descrizioneAAMS: "EUROPA - SEHA LEAGUE",
        streamingImg: false,
      },
      "1-816": {
        posizione: 999,
        descrizione: "RWA I Divisione",
        key: "1-816",
        codiceDisciplina: 1,
        codiceManifestazione: 816,
        topManifestazione: false,
        sigla: "RUAIDI",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Rwanda.png",
        descrizioneAAMS: "RUANDA - I DIVISIONE",
        streamingImg: false,
      },
      "1-47": {
        posizione: 26,
        descrizione: "ITA Coppa Italia",
        key: "1-47",
        codiceDisciplina: 1,
        codiceManifestazione: 47,
        topManifestazione: false,
        sigla: "ITACO",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Italia.jpg",
        descrizioneAAMS: "COPPA ITALIA",
        streamingImg: false,
      },
      "1-22": {
        posizione: 24,
        descrizione: "ITA Serie B",
        key: "1-22",
        codiceDisciplina: 1,
        codiceManifestazione: 22,
        topManifestazione: false,
        sigla: "ITA2",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Italia.png",
        descrizioneAAMS: "CAMPIONATO ITALIANO SERIE B",
        streamingImg: true,
      },
      "2-12": {
        posizione: 6,
        descrizione: "USA NBA",
        key: "2-12",
        codiceDisciplina: 2,
        codiceManifestazione: 12,
        topManifestazione: false,
        sigla: "NBA",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/USA.jpg",
        descrizioneAAMS: "NBA",
        streamingImg: false,
      },
      "1-86": {
        posizione: 1,
        descrizione: "ENG Premier League",
        key: "1-86",
        codiceDisciplina: 1,
        codiceManifestazione: 86,
        topManifestazione: true,
        sigla: "ING1",
        urlIcona: "https://www.sisal.it/documents/10903/450918/England.png",
        descrizioneAAMS: "PREMIER LEAGUE",
        streamingImg: false,
      },
      "1-21": {
        posizione: 12,
        descrizione: "ITA Serie A",
        key: "1-21",
        codiceDisciplina: 1,
        codiceManifestazione: 21,
        topManifestazione: true,
        sigla: "ITA1",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Italia.png",
        descrizioneAAMS: "CAMPIONATO ITALIANO SERIE A",
        streamingImg: false,
      },
      "6-10": {
        posizione: 999,
        descrizione: "FIN SM Liiga",
        key: "6-10",
        codiceDisciplina: 6,
        codiceManifestazione: 10,
        topManifestazione: false,
        sigla: "HOFIN",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Finalandia.jpg",
        descrizioneAAMS: "CAMPIONATO FINLANDIA",
        streamingImg: false,
      },
      "1-121": {
        posizione: 999,
        descrizione: "TUR  Turkcell Superlig",
        key: "1-121",
        codiceDisciplina: 1,
        codiceManifestazione: 121,
        topManifestazione: false,
        sigla: "TUR1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Turkey.jpg",
        descrizioneAAMS: "CAMPIONATO TURCO SUPERLEAGUE",
        streamingImg: false,
      },
      "1-18": {
        posizione: 1,
        descrizione: "INT Champions League",
        key: "1-18",
        codiceDisciplina: 1,
        codiceManifestazione: 18,
        topManifestazione: true,
        sigla: "EUCHL",
        urlIcona: "https://www.sisal.it/documents/10903/450918/ic_champions.png",
        descrizioneAAMS: "CHAMPIONS LEAGUE",
        streamingImg: false,
      },
      "1-184": {
        posizione: 999,
        descrizione: "CRO 1. HNL",
        key: "1-184",
        codiceDisciplina: 1,
        codiceManifestazione: 184,
        topManifestazione: false,
        sigla: "CRO1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Croazia.jpg",
        descrizioneAAMS: "CAMPIONATO CROATO",
        streamingImg: false,
      },
      "3-131": {
        posizione: 2,
        descrizione: "Wimbledon",
        key: "3-131",
        codiceDisciplina: 3,
        codiceManifestazione: 131,
        topManifestazione: true,
        sigla: "WBLD",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Inghilterra.jpg",
        descrizioneAAMS: "TORNEO DI WIMBLEDON",
        streamingImg: false,
      },
      "3-130": {
        posizione: 1,
        descrizione: "US Open",
        key: "3-130",
        codiceDisciplina: 3,
        codiceManifestazione: 130,
        topManifestazione: false,
        sigla: "USOP",
        urlIcona: "https://www.sisal.it/documents/10903/450918/USA.jpg",
        descrizioneAAMS: "USA OPEN",
        streamingImg: false,
      },
      "1-3": {
        posizione: 999,
        descrizione: "GER II Bundesliga",
        key: "1-3",
        codiceDisciplina: 1,
        codiceManifestazione: 3,
        topManifestazione: false,
        sigla: "GER2",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Germania.jpg",
        descrizioneAAMS: "2^ DIVISIONE TEDESCA",
        streamingImg: false,
      },
      "3-2": {
        posizione: 1,
        descrizione: "Australian Open",
        key: "3-2",
        codiceDisciplina: 3,
        codiceManifestazione: 2,
        topManifestazione: true,
        sigla: "AUSO",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Australia.jpg",
        descrizioneAAMS: "AUSTRALIAN OPEN",
        streamingImg: false,
      },
      "1-4": {
        posizione: 2,
        descrizione: "GER Bundesliga",
        key: "1-4",
        codiceDisciplina: 1,
        codiceManifestazione: 4,
        topManifestazione: true,
        sigla: "GER1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Germania.jpg",
        descrizioneAAMS: "BUNDESLIGA",
        streamingImg: false,
      },
      "1-8": {
        posizione: 999,
        descrizione: "BRA Brasileirao",
        key: "1-8",
        codiceDisciplina: 1,
        codiceManifestazione: 8,
        topManifestazione: false,
        sigla: "BRA1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Brasile.jpg",
        descrizioneAAMS: "CAMPIONATO BRASILE",
        streamingImg: false,
      },
      "2-9": {
        posizione: 7,
        descrizione: "INT Eurolega",
        key: "2-9",
        codiceDisciplina: 2,
        codiceManifestazione: 9,
        topManifestazione: false,
        sigla: "EULG",
        urlIcona: "https://www.sisal.it/documents/10903/450918/ic_europa_league.png",
        descrizioneAAMS: "EUROLEGA",
        streamingImg: false,
      },
      "6-24": {
        posizione: 999,
        descrizione: "RUS Campionato MHL",
        key: "6-24",
        codiceDisciplina: 6,
        codiceManifestazione: 24,
        topManifestazione: false,
        sigla: "HRMHL",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Russia.jpg",
        descrizioneAAMS: "CAMPIONATO RUSSO MHL",
        streamingImg: false,
      },
      "5-59": {
        posizione: 999,
        descrizione: "ARG Serie A1",
        key: "5-59",
        codiceDisciplina: 5,
        codiceManifestazione: 59,
        topManifestazione: false,
        sigla: "ARGLA1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Agrentina.jpg",
        descrizioneAAMS: "LIGA ARGENTINA SERIE A1",
        streamingImg: false,
      },
      "1-79": {
        posizione: 2,
        descrizione: "ESP Liga",
        key: "1-79",
        codiceDisciplina: 1,
        codiceManifestazione: 79,
        topManifestazione: true,
        sigla: "SPA1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Spain.jpg",
        descrizioneAAMS: "LIGA",
        streamingImg: true,
      },
      "1-14": {
        posizione: 1,
        descrizione: "FRA Ligue 1",
        key: "1-14",
        codiceDisciplina: 1,
        codiceManifestazione: 14,
        topManifestazione: false,
        sigla: "FRA1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Francia.jpg",
        descrizioneAAMS: "CAMPIONATO FRANCESE",
        streamingImg: false,
      },
      "2-68": {
        posizione: 999,
        descrizione: "AUS Australian League",
        key: "2-68",
        codiceDisciplina: 2,
        codiceManifestazione: 68,
        topManifestazione: false,
        sigla: "CAAUB",
        urlIcona: "https://www.sisal.it/documents/10903/450918/Australia.jpg",
        descrizioneAAMS: "CAMPIONATO AUSTRALIA",
        streamingImg: false,
      },
      "2-67": {
        posizione: 999,
        descrizione: "KOR KBL",
        key: "2-67",
        codiceDisciplina: 2,
        codiceManifestazione: 67,
        topManifestazione: false,
        sigla: "CAKOB",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/South_Korea.jpg",
        descrizioneAAMS: "CAMPIONATO KOREA",
        streamingImg: false,
      },
      "6-20": {
        posizione: 999,
        descrizione: "SVK Extraliga",
        key: "6-20",
        codiceDisciplina: 6,
        codiceManifestazione: 20,
        topManifestazione: false,
        sigla: "HSLEX",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Slovenia.jpg",
        descrizioneAAMS: "CAMPIONATO SLOVACCO EXTRALIGA",
        streamingImg: false,
      },
      "6-128": {
        posizione: 999,
        descrizione: "RUS VHL",
        key: "6-128",
        codiceDisciplina: 6,
        codiceManifestazione: 128,
        topManifestazione: false,
        sigla: "RUVHL",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Russia.jpg",
        descrizioneAAMS: "RUSSIA - VHL",
        streamingImg: false,
      },
      "1-74": {
        posizione: 8,
        descrizione: "INT Amichevoli",
        key: "1-74",
        codiceDisciplina: 1,
        codiceManifestazione: 74,
        topManifestazione: false,
        sigla: "AMI",
        urlIcona: "https://www.sisal.it/documents/10903/450918/world.png",
        descrizioneAAMS: "GARA AMICHEVOLE",
        streamingImg: true,
      },
      "1-695": {
        posizione: 999,
        descrizione: "INT Amichevoli Club",
        key: "1-695",
        codiceDisciplina: 1,
        codiceManifestazione: 695,
        topManifestazione: false,
        sigla: "AMI12",
        urlIcona: "https://www.sisal.it/documents/10903/450918/world.png",
        descrizioneAAMS: "AMICH.ALMENO UN CLUB 1 O 2 DIV",
        streamingImg: false,
      },
      "1-153": {
        posizione: 1,
        descrizione: "INT Europa League",
        key: "1-153",
        codiceDisciplina: 1,
        codiceManifestazione: 153,
        topManifestazione: true,
        sigla: "EUEL",
        urlIcona: "https://www.sisal.it/documents/10903/450918/ic_europa_league.png",
        descrizioneAAMS: "EUROPA LEAGUE",
        streamingImg: false,
      },
      "1-339": {
        posizione: 999,
        descrizione: "TUR 1. Lig",
        key: "1-339",
        codiceDisciplina: 1,
        codiceManifestazione: 339,
        topManifestazione: false,
        sigla: "TUR2",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Turkey.jpg",
        descrizioneAAMS: "TURCHIA LEGA 1",
        streamingImg: false,
      },
      "3-145": {
        posizione: 2,
        descrizione: "Roland Garros",
        key: "3-145",
        codiceDisciplina: 3,
        codiceManifestazione: 145,
        topManifestazione: true,
        sigla: "RGAR",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Francia.jpg",
        descrizioneAAMS: "ROLAND GARROS",
        streamingImg: true,
      },
      "11-19": {
        posizione: 999,
        descrizione: "Giro di Italia",
        key: "11-19",
        codiceDisciplina: 11,
        codiceManifestazione: 19,
        topManifestazione: false,
        sigla: "GITA",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Italia.jpg",
        descrizioneAAMS: "GIRO D\u0027ITALIA",
        streamingImg: false,
      },
      "1-117": {
        posizione: 999,
        descrizione: "GRE Super League",
        key: "1-117",
        codiceDisciplina: 1,
        codiceManifestazione: 117,
        topManifestazione: false,
        sigla: "GRE1",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Grecia.jpg",
        descrizioneAAMS: "CAMPIONATO GRECO",
        streamingImg: false,
      },
      "1-235": {
        posizione: 2,
        descrizione: "ARG Copa argentina",
        key: "1-235",
        codiceDisciplina: 1,
        codiceManifestazione: 235,
        topManifestazione: true,
        sigla: "ARGCO",
        urlIcona: "https://cdn-static.sisal.it/scommesse-portlet/images/ic_manifestazione/Agrentina.jpg",
        descrizioneAAMS: "COPPA ARGENTINA",
        streamingImg: false,
      },
    },
    manifestazioneListByDisciplinaTutti: {
      "11": ["11-19"],
      "1": [
        "1-86",
        "1-18",
        "1-153",
        "1-235",
        "1-79",
        "1-4",
        "1-21",
        "1-14",
        "1-74",
        "1-22",
        "1-47",
        "1-8",
        "1-184",
        "1-3",
        "1-117",
        "1-695",
        "1-816",
        "1-121",
        "1-339",
      ],
      "2": ["2-12", "2-9", "2-68", "2-67"],
      "3": ["3-2", "3-145", "3-131", "3-130"],
      "5": ["5-59"],
      "17": ["17-89"],
      "6": ["6-10", "6-24", "6-128", "6-20"],
    },
    manifestazioneListByDisciplinaOggi: { "1": ["1-79", "1-21", "1-47", "1-117", "1-695"], "2": ["2-9"], "3": ["3-2"] },
    manifestazioneListByDisciplinaOggiEDomani: {
      "1": ["1-79", "1-21", "1-14", "1-47", "1-117", "1-695"],
      "2": ["2-9", "2-68", "2-67"],
      "3": ["3-2"],
      "5": ["5-59"],
    },
    manifestazioneListByDisciplinaDomani: { "1": ["1-14", "1-117"], "2": ["2-9", "2-68", "2-67"], "5": ["5-59"] },
    manifestazioneListByDisciplinaDopoDomani: {
      "11": ["11-19"],
      "1": ["1-86", "1-79", "1-4", "1-21", "1-14", "1-74", "1-22", "1-121", "1-339"],
      "2": ["2-9"],
      "3": ["3-2", "3-145"],
    },
    eventsNumberByManifestazioneTutti: {
      "17-89": 4,
      "1-816": 2,
      "1-47": 2,
      "1-22": 10,
      "2-12": 28,
      "1-86": 5,
      "1-21": 26,
      "6-10": 2,
      "1-121": 13,
      "1-18": 4,
      "1-184": 1,
      "3-131": 9,
      "1-3": 2,
      "3-130": 9,
      "1-4": 18,
      "3-2": 11,
      "1-8": 3,
      "2-9": 19,
      "6-24": 2,
      "5-59": 1,
      "1-79": 13,
      "1-14": 12,
      "2-68": 1,
      "2-67": 1,
      "6-20": 1,
      "6-128": 1,
      "1-74": 3,
      "1-695": 12,
      "1-153": 8,
      "1-339": 15,
      "3-145": 9,
      "11-19": 1,
      "1-117": 4,
      "1-235": 3,
    },
    eventsNumberByManifestazioneOggi: { "3-2": 1, "1-117": 3, "2-9": 2 },
    eventsNumberByManifestazioneOggiEDomani: {
      "1-695": 12,
      "5-59": 1,
      "1-79": 5,
      "3-2": 1,
      "1-47": 2,
      "2-67": 1,
      "1-117": 4,
      "1-21": 4,
      "2-9": 5,
    },
    eventsNumberByManifestazioneDomani: { "5-59": 1, "1-14": 3, "2-68": 1, "2-67": 1, "1-117": 1, "2-9": 5 },
    eventsNumberByManifestazioneDopoDomani: {
      "1-121": 2,
      "1-4": 1,
      "1-14": 1,
      "1-22": 1,
      "1-21": 1,
      "2-9": 4,
      "1-74": 1,
    },
    headerPalGiornalieriList: [
      { filter: 1, label: "2021-01-27", isoDate: "2021-01-27" },
      { filter: 4, label: "2021-01-28", isoDate: "2021-01-28" },
      { filter: 3, label: "2021-01-29", isoDate: "2021-01-29" },
    ],
  },
} as any;
