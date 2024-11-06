import React, { useCallback } from "react";
import {
  Avvenimento,
  Disciplina,
  InfoAggiuntivaAggregatorGroup,
  Manifestazione,
} from "src/components/prematch/prematch-api";
import styled, { css } from "styled-components/macro";
import { setFallbackImageSrc } from "src/components/prematch/templates/utils";
import { orderBy } from "lodash";
import magliettaHome from "src/assets/images/maglietta-home.svg";
import magliettaAway from "src/assets/images/maglietta-away.svg";
import { dateFormatter, timeFormatter } from "src/helpers/format-date";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";

export type DescrizioneAvvenimentoProps = {
  avvenimento: Avvenimento;
  onOpen(avvenimento: Avvenimento): void;
};
function DescrizioneAvvenimento({ avvenimento, onOpen }: DescrizioneAvvenimentoProps) {
  return (
    <StyledContainer>
      <DescrizioneAvvenimentoDateTimeMemo datetime={avvenimento.data} />
      <StyledLabelAvvenimento onClick={() => onOpen(avvenimento)}>
        {avvenimento.descrizione.split(" - ").map((part, i) => {
          return <StyledLabelAvvenimentoPart key={i}>{part}</StyledLabelAvvenimentoPart>;
        })}
      </StyledLabelAvvenimento>
    </StyledContainer>
  );
}
export const DescrizioneAvvenimentoMemo = React.memo(DescrizioneAvvenimento);

type DescrizioneAvvenimentoInfoAggiuntivaAggregatorProps = {
  disciplina: Disciplina;
  manifestazione: Manifestazione;
  avvenimento: Avvenimento;
  infoAggiuntivaAggregatorGroupMap: Record<string, InfoAggiuntivaAggregatorGroup>;
};
function DescrizioneAvvenimentoInfoAggiuntivaAggregator({
  avvenimento,
  disciplina,
  manifestazione,
  infoAggiuntivaAggregatorGroupMap,
}: DescrizioneAvvenimentoInfoAggiuntivaAggregatorProps) {
  const infoAggiuntivaAggregatorGroups = orderBy(
    Object.values(infoAggiuntivaAggregatorGroupMap),
    (infoAggiuntivaAggregatorGroup) => !infoAggiuntivaAggregatorGroup.home,
  );
  const { openSchedaAvvenimentoPrematch } = useNavigazioneActions();
  const onOpenAvvenimento = useCallback(() => {
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
  }, [avvenimento, disciplina, manifestazione, openSchedaAvvenimentoPrematch]);
  return (
    <StyledContainer>
      <DescrizioneAvvenimentoDateTimeMemo datetime={avvenimento.data} />
      <StyledLabelAvvenimento onClick={onOpenAvvenimento}>
        {infoAggiuntivaAggregatorGroups.map((infoAggiuntivaAggregatorGroup) => {
          return (
            <StyledLabelAvvenimentoPart key={infoAggiuntivaAggregatorGroup.codiceInfoAggiuntivaAggregatorGroup}>
              <img
                css={css`
                  box-sizing: border-box;
                  height: 18px;
                  width: 18px;
                  border: 0.77px solid #cbcbcb;
                  border-radius: 50%;
                  margin-right: 8px;
                `}
                src={infoAggiuntivaAggregatorGroup.urlIcona}
                alt={""}
                onError={setFallbackImageSrc(infoAggiuntivaAggregatorGroup.home ? magliettaHome : magliettaAway)}
              />
              {infoAggiuntivaAggregatorGroup.descrizione}
            </StyledLabelAvvenimentoPart>
          );
        })}
      </StyledLabelAvvenimento>
    </StyledContainer>
  );
}
export const DescrizioneAvvenimentoInfoAggiuntivaAggregatorMemo = React.memo(
  DescrizioneAvvenimentoInfoAggiuntivaAggregator,
);

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: [data-ora] max-content [descrizione] 1fr;
  grid-gap: 10px;
`;

const StyledLabelAvvenimentoPart = styled.label`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-word;
  cursor: pointer;
`;

const StyledLabelAvvenimento = styled.div`
  grid-column: descrizione;
  color: #333333;
  width: fit-content;
  font-family: Roboto;
  font-size: 1rem;
  letter-spacing: 0;
  line-height: 23px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

type DescrizioneAvvenimentoDateTimeProps = { datetime: string };
function DescrizioneAvvenimentoDateTime({ datetime }: DescrizioneAvvenimentoDateTimeProps) {
  const date = new Date(datetime);
  return (
    <StyledDateTimeContainer>
      <StyledDateContainer>{dateFormatter.format(date)}</StyledDateContainer>
      <StyledTimeContainer>{timeFormatter.format(date)}</StyledTimeContainer>
    </StyledDateTimeContainer>
  );
}
export const DescrizioneAvvenimentoDateTimeMemo = React.memo(DescrizioneAvvenimentoDateTime);

const StyledDateContainer = styled.div`
  background-color: #979797;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-transform: capitalize;
`;
const StyledTimeContainer = styled.div`
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;
const StyledDateTimeContainer = styled.div`
  grid-column: data-ora;
  box-sizing: border-box;
  height: 45px;
  width: 100px;
  flex-basis: 100px;
  border: 1.26px solid #979797;
  border-radius: 3px;
  font-family: Roboto;
  font-size: 0.8125rem;
`;
