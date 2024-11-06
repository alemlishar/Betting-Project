import React from "react";
import { FormattedMessage } from "react-intl";
import { EsitoProps } from "src/components/esito/Esito";
import { HotbetsDateTimeProps } from "src/components/hotbets/Hotbets";
import {
  Avvenimento,
  Disciplina,
  InfoAggiuntiva,
  Manifestazione,
  Scommessa,
} from "src/components/prematch/prematch-api";
import { NPlusProps } from "src/components/prematch/templates/NPlus";
import { SezioneAttiva } from "src/components/root-container/useNavigazione";
import {
  CodiceAvvenimento,
  CodiceDisciplina,
  CodiceManifestazione,
  CodicePalinsesto,
  makeChiaveAvvenimento,
  makeChiaveEsito,
} from "src/types/chiavi";
import { css } from "styled-components/macro";

type LancioMatchTemplateProps = {
  index: number;
  headerColor: string;
  avvenimento: Avvenimento;
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  infoAggiuntiva: InfoAggiuntiva;
  scommessa: Scommessa;
  Esito: React.ComponentType<EsitoProps>;
  HotbetsHeaderInfo: React.ComponentType<HotbetsDateTimeProps>;
  Badge?: React.ComponentType<{}>;

  openSchedaAvvenimento({
    disciplina,
    manifestazione,
    avvenimento,
    previousSezione,
    codiceDisciplina,
    codiceManifestazione,
    codiceAvvenimento,
    codicePalinsesto,
  }: {
    disciplina: Disciplina;
    manifestazione: Manifestazione;
    avvenimento: Avvenimento;
    previousSezione: SezioneAttiva;
    codiceDisciplina: CodiceDisciplina;
    codiceManifestazione: CodiceManifestazione;
    codiceAvvenimento: CodiceAvvenimento;
    codicePalinsesto: CodicePalinsesto;
  }): void;
  NPlus: React.ComponentType<NPlusProps>;
};

export function LancioMatchTemplate({
  headerColor,
  avvenimento,
  disciplina,
  manifestazione,
  infoAggiuntiva,
  scommessa,
  Esito,
  openSchedaAvvenimento,
  NPlus,
  HotbetsHeaderInfo,
  Badge,
  index,
}: LancioMatchTemplateProps) {
  const esitiNumber = infoAggiuntiva.esitoList.length;
  return (
    <div
      key={`${makeChiaveAvvenimento({ ...avvenimento })}-${index}`}
      css={css`
        flex-shrink: 0;
        margin-right: 10px;
        height: 178px;
        width: 470px;
        border-radius: 4px;
        background-color: #ffffff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
        display: grid;
        grid-template-rows: [head] 54px [disciplina] 18px [cde] 16px [esito] 50px;
        grid-row-gap: 10px;
        grid-column-gap: 10px;
        border-radius: 4px;
      `}
    >
      <div
        css={css`
          display: grid;
          grid-template-columns: [avvenimento] auto [data] min-content;
          grid-row: head;
          font-family: Roboto;
          font-size: 16px;
          font-weight: bold;
          letter-spacing: 0;
          line-height: 21px;
          align-items: center;
        `}
      >
        <div
          css={css`
            box-sizing: border-box;
            grid-column: avvenimento;
            padding: 6px 10px;
            color: #ffffff;
            background-color: ${headerColor};
            border-top-left-radius: 4px;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
          onClick={() => {
            openSchedaAvvenimento({
              disciplina,
              manifestazione,
              avvenimento,
              previousSezione: "sport",
              codiceAvvenimento: avvenimento.codiceAvvenimento,
              codiceDisciplina: avvenimento.codiceDisciplina,
              codiceManifestazione: avvenimento.codiceManifestazione,
              codicePalinsesto: avvenimento.codicePalinsesto,
            });
          }}
        >
          {avvenimento.descrizione.split(" - ").map((part, i) => {
            return <div key={i}>{part}</div>;
          })}
        </div>
        <HotbetsHeaderInfo datetime={avvenimento.data} />
      </div>

      <div
        css={css`
          grid-row: disciplina;
          display: flex;
          align-items: center;
          padding: 0 10px;
        `}
      >
        <img
          css={css`
            filter: opacity(40%);
          `}
          src={disciplina.urlIcona}
          alt={disciplina.descrizione}
        />
        <span
          css={css`
            color: #999999;
            font-family: Roboto;
            font-size: 14px;
          `}
        >
          {manifestazione.descrizione}
        </span>
        {Badge && (
          <div
            css={css`
              align-items: end;
              display: flex;
              margin-left: auto;
              height: 100%;
            `}
          >
            <Badge />
          </div>
        )}
      </div>
      <div
        css={css`
          grid-row: cde;
          color: #333333;
          font-family: Roboto;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 19px;
          padding: 0 10px;
        `}
      >
        {infoAggiuntiva.idInfoAggiuntiva !== 0 ? (
          <div>{infoAggiuntiva.descrizione}</div>
        ) : (
          <div>{scommessa.descrizione}</div>
        )}
      </div>
      <div
        css={css`
          grid-row: esito;
          display: grid;
          height: 50px;
          grid-template-columns: repeat(${esitiNumber > 3 ? 1 : esitiNumber}, [esito] minmax(116px, 1fr)) [more] 70px;
          column-gap: 10px;
          padding: 0 10px;
          align-items: center;
        `}
      >
        {esitiNumber > 3 ? (
          <button
            css={css`
              border: none;
              grid-column: esito;
              font-size: 1rem;
              height: 50px;
              color: #333333;
              font-weight: bold;
              line-height: 21px;
              background-color: #ededed;
              border-radius: 8px;
              text-align: center;
              cursor: pointer;
              &:hover {
                background-color: #aac21f;
                color: #ffffff;
              }
            `}
            onClick={() => {
              openSchedaAvvenimento({
                disciplina,
                manifestazione,
                avvenimento,
                previousSezione: "sport",
                codiceAvvenimento: avvenimento.codiceAvvenimento,
                codiceDisciplina: avvenimento.codiceDisciplina,
                codiceManifestazione: avvenimento.codiceManifestazione,
                codicePalinsesto: avvenimento.codicePalinsesto,
              });
            }}
          >
            <FormattedMessage
              defaultMessage="Scopri tutte le quote"
              description="hotbet messagge: Scopri tutte le quote"
            />
          </button>
        ) : (
          infoAggiuntiva.esitoList.map((esito, index) => {
            return (
              <div
                key={makeChiaveEsito({ ...infoAggiuntiva, ...esito })}
                css={css`
                  grid-column: esito ${index + 1};
                `}
              >
                <Esito
                  disciplina={disciplina}
                  manifestazione={manifestazione}
                  avvenimento={avvenimento}
                  scommessa={scommessa}
                  infoAggiuntiva={infoAggiuntiva}
                  esito={esito}
                />
              </div>
            );
          })
        )}
        {(avvenimento.numeroScommesse > 1 || esitiNumber > 3) && (
          <div
            css={css`
              grid-column: more;
              justify-self: center;
            `}
          >
            <NPlus
              numeroScommesse={esitiNumber > 3 ? avvenimento.numeroScommesse : avvenimento.numeroScommesse - 1}
              onClick={() => {
                openSchedaAvvenimento({
                  disciplina,
                  manifestazione,
                  avvenimento,
                  previousSezione: "sport",
                  codiceAvvenimento: avvenimento.codiceAvvenimento,
                  codiceDisciplina: avvenimento.codiceDisciplina,
                  codiceManifestazione: avvenimento.codiceManifestazione,
                  codicePalinsesto: avvenimento.codicePalinsesto,
                });
              }}
              codiceAvvenimento={avvenimento.codiceAvvenimento}
              codicePalinsesto={avvenimento.codicePalinsesto}
            />
          </div>
        )}
      </div>
    </div>
  );
}
