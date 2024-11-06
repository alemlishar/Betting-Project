import React from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IconMonoquotaOnDemand } from "src/assets/images/icon-monoquota-ondemand.svg";
import { HotbetsDateTime } from "src/components/hotbets/Hotbets";
import { Monoquota } from "src/components/hotbets/hotbets-api";
import { EsitoQuotaHotBetsMemo } from "src/components/prematch/templates/Esito";
import { useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { makeChiaveAvvenimento, makeChiaveManifestazione } from "src/types/chiavi";
import styled, { css } from "styled-components/macro";

type MonoQuotaProps = {
  monoQuotaContainer: Monoquota;
};

export function MonoQuota({ monoQuotaContainer }: MonoQuotaProps) {
  const alberaturaPrematch = useAlberaturaPrematch();
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();

  if (!monoQuotaContainer) {
    return null;
  }

  const { monoquotaList } = monoQuotaContainer;

  if (!monoquotaList) {
    return null;
  }

  return (
    <>
      {monoquotaList.map((monoquota, index) => {
        const { avvenimentoFe: avvenimento, infoAggiuntiva, scommessa, codiceEsito } = monoquota;

        if (!avvenimento) {
          return null;
        }

        const disciplina = alberaturaPrematch && alberaturaPrematch.disciplinaMap[avvenimento.codiceDisciplina];

        if (!disciplina || avvenimento.categoria === 1 || avvenimento.categoria === 2) {
          return null;
        }

        const manifestazione =
          alberaturaPrematch &&
          alberaturaPrematch.manifestazioneMap[
            makeChiaveManifestazione({
              codiceDisciplina: disciplina!.codiceDisciplina,
              codiceManifestazione: avvenimento.codiceManifestazione,
            })
          ];

        const esito = infoAggiuntiva && infoAggiuntiva.esitoList.find((esito) => esito.codiceEsito === codiceEsito);

        if (!infoAggiuntiva || !scommessa || !manifestazione || !esito) {
          return null;
        }

        const isOnDemand = monoquota.onDemand;
        const hasQuotaMaggiorata = !!monoquota.oldQuota;
        const hasTestataPersonalizzata = !!monoquota.testataPersonalizzata;
        const hasInfoAggiuntiva = !!monoquota.infoAggiuntiva && infoAggiuntiva.idInfoAggiuntiva !== 0;

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
                  background-color: ${isOnDemand ? "#0095D7" : "#005936"};
                  border-top-left-radius: 4px;
                  cursor: pointer;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                `}
                onClick={() => {
                  openSchedaAvvenimentoPrematch({
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
                {avvenimento.descrizione.split(" - ").map((part, index) => {
                  const isHomeTeam = index === 0; // TODO: trovare un modo migliore per capire se si tratta di hostTeam o guestTeam
                  const teamIcon = isHomeTeam ? monoquota.hostTeamIcon : monoquota.guestTeamIcon;
                  return (
                    <div
                      key={index}
                      css={css`
                        display: flex;
                        align-items: center;
                      `}
                    >
                      {monoquota.hostTeamIcon && monoquota.guestTeamIcon && (
                        <img
                          css={css`
                            padding: 2px;
                            box-sizing: border-box;
                            background-color: #ffffff;
                            height: 18px;
                            width: 18px;
                            border: 0.77px solid #cbcbcb;
                            border-radius: 50%;
                            margin-right: 5px;
                          `}
                          src={teamIcon}
                          alt={""}
                        />
                      )}
                      <span>{part}</span>
                    </div>
                  );
                })}
              </div>
              <HotbetsDateTime datetime={avvenimento.data} />
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
                {manifestazione?.descrizione}
              </span>
              {isOnDemand && (
                <>
                  <StyledOnDemandBadge>
                    <FormattedMessage defaultMessage="On Demand" description="Badge per card monoquota ondemand" />
                  </StyledOnDemandBadge>
                  <IconMonoquotaOnDemand
                    css={css`
                      margin-left: 5px;
                    `}
                  />
                </>
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
                text-transform: uppercase;
              `}
            >
              {hasQuotaMaggiorata ? (
                <FormattedMessage
                  defaultMessage="Quota Maggiorata"
                  description="descrizione che indica che la monoquota ha una quota maggiorata"
                />
              ) : hasTestataPersonalizzata ? (
                <>{monoquota.testataPersonalizzata}</>
              ) : (
                <>{scommessa.descrizione}</>
              )}
            </div>
            <div
              css={css`
                grid-row: esito;
                display: grid;
                grid-template-columns: [descrizione] minmax(248px, 345px) [quota] auto;
                height: 50px;
                column-gap: 10px;
                padding: 0 10px;
                align-items: center;
              `}
            >
              <div
                css={css`
                  grid-column: descrizione;
                  min-width: 248px;
                  color: #333333;
                  font-family: Roboto;
                  font-size: 1rem;
                  font-weight: bold;
                  letter-spacing: 0;
                  line-height: 21px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  word-break: break-word;
                  overflow: hidden;
                `}
              >
                {monoquota.descrizioneScommessaMonoquota ? (
                  <>{monoquota.descrizioneScommessaMonoquota}</>
                ) : hasInfoAggiuntiva ? (
                  <>{`${infoAggiuntiva.descrizione} : ${esito.descrizione}`}</>
                ) : (
                  <>{`${scommessa.descrizione} : ${esito.descrizione}`}</>
                )}
              </div>
              <div
                css={css`
                  grid-column: quota;
                  display: flex;
                `}
              >
                {hasQuotaMaggiorata && (
                  <StyledQuotaMaggiorataButton disabled>{monoquota.oldQuota}</StyledQuotaMaggiorataButton>
                )}
                <EsitoQuotaHotBetsMemo
                  avvenimento={avvenimento}
                  disciplina={disciplina}
                  esito={esito}
                  infoAggiuntiva={infoAggiuntiva}
                  manifestazione={manifestazione}
                  scommessa={scommessa}
                  hasQuotaMaggiorata={hasQuotaMaggiorata}
                />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

const StyledQuotaMaggiorataButton = styled.button`
  height: 50px;
  width: 96px;
  background-color: #f4f4f4;
  position: relative;
  border-radius: 4px 0 0 4px;
  border: none;
  color: #cbcbcb;
  font-family: Roboto;
  font-size: 18px;
  &:before {
    content: "";
    position: absolute;
    width: 64px;
    transform: rotate(162deg);
    border: 1px solid;
    top: 24px;
    left: 15px;
  }
  &:after {
    content: "";
    position: absolute;
    width: 0px;
    height: 0px;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #f4f4f4;
    right: -12px;
    top: 12px;
  }
`;

const StyledOnDemandBadge = styled.div`
  margin-left: auto;
  height: 15px;
  width: 67px;
  border-radius: 25px;
  background-color: #0095d7;
  text-transform: uppercase;
  color: #ffffff;
  font-family: Roboto;
  font-size: 0.625rem;
  font-style: italic;
  font-weight: 900;
  text-align: center;
`;
