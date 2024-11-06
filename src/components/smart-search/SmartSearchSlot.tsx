import React from "react";
import styled from "styled-components/macro";
import { SmartSearchState } from "src/components/smart-search/useSmartSearch";
import { StyledAvvenimentoLiveBadge } from "src/components/smart-search/StyledAvvenimentoLiveBadge";
import { formatIdInfoAggiuntiva } from "src/components/smart-search/formatting";
import { AvvenimentoSmart, ClasseEsitoSmart, InfoAggiuntivaSmart } from "src/components/smart-search/smart-api";

// DEBT styled (deduplicate)

type SmartSearchSlotsProps = {
  type: SmartSearchState["type"];
  avvenimento?: AvvenimentoSmart;
  classeEsito?: ClasseEsitoSmart;
  infoAggiuntiva?: InfoAggiuntivaSmart;
  onStateChange(state: SmartSearchState): void;
};
function SmartSearchSlots({ type, avvenimento, classeEsito, infoAggiuntiva, onStateChange }: SmartSearchSlotsProps) {
  return (
    <StyledSmartSearchSlotContainer>
      <StyledSmartSearchSlot>
        {avvenimento &&
          (() => {
            return (
              <StyledFixedEntityContainer>
                <StyledFixedEntityWrapper>
                  <div>
                    <StyledFixedAvvenimentoCode isAvvenimentoLive={avvenimento.categoria !== 0}>
                      {avvenimento.codiceAvvenimento}
                    </StyledFixedAvvenimentoCode>
                    {avvenimento.categoria !== 0 && <StyledAvvenimentoLiveBadge>live</StyledAvvenimentoLiveBadge>}
                  </div>
                  <StyledFixedEntityDescriptionContainer>
                    <StyledFixedEntityTopDescription>
                      {avvenimento.descrizioneDisciplina}&nbsp;|&nbsp;
                      {avvenimento.descrizioneManifestazione}
                    </StyledFixedEntityTopDescription>
                    <StyledFixedEntityMainDescription>{avvenimento.descrizione}</StyledFixedEntityMainDescription>
                    <StyledFixedEntityBottomDescription>
                      {avvenimento.formattedDataAvvenimento}
                    </StyledFixedEntityBottomDescription>
                  </StyledFixedEntityDescriptionContainer>
                </StyledFixedEntityWrapper>
                {type === "2" && (
                  <StyledRemoveButton
                    onClick={() =>
                      onStateChange({
                        type: "1",
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                        text: "",
                      })
                    }
                    data-qa={`smart_search_rimuovi_avvenimento_${avvenimento.codicePalinsesto}_${avvenimento.codiceAvvenimento}`}
                  >
                    &times;
                  </StyledRemoveButton>
                )}
              </StyledFixedEntityContainer>
            );
          })()}
      </StyledSmartSearchSlot>
      <StyledSmartSearchSlot>
        {avvenimento &&
          classeEsito &&
          (() => {
            return (
              <StyledFixedEntityContainer>
                <StyledFixedEntityWrapper>
                  <StyledFixedEntityCode>{classeEsito.codiceClasseEsito}</StyledFixedEntityCode>
                  <StyledFixedEntityDescriptionContainer>
                    <StyledFixedEntityMainDescription>{classeEsito.descrizione}</StyledFixedEntityMainDescription>
                    <StyledFixedEntityBottomDescription>
                      Min - max: {classeEsito.legaturaMin}
                      &nbsp;-&nbsp;{classeEsito.legaturaMax}
                    </StyledFixedEntityBottomDescription>
                  </StyledFixedEntityDescriptionContainer>
                </StyledFixedEntityWrapper>
                {type === "3" && (
                  <StyledRemoveButton
                    onClick={() =>
                      onStateChange({
                        type: "2",
                        subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                        avvenimento: avvenimento,
                        text: "",
                        infoAggiuntivaAccordionToggle: {},
                      })
                    }
                    data-qa={`smart_search_rimuovi_classeEsito_${classeEsito.codicePalinsesto}_${classeEsito.codiceAvvenimento}_${classeEsito.codiceClasseEsito}`}
                  >
                    &times;
                  </StyledRemoveButton>
                )}
              </StyledFixedEntityContainer>
            );
          })()}
      </StyledSmartSearchSlot>
      <StyledSmartSearchSlot>
        {avvenimento &&
          classeEsito &&
          infoAggiuntiva &&
          (() => {
            return (
              <StyledFixedEntityContainer>
                <StyledFixedEntityWrapper>
                  <StyledFixedEntityCode>
                    {formatIdInfoAggiuntiva(infoAggiuntiva.codedIdInfoAggiuntiva)}
                  </StyledFixedEntityCode>
                  <StyledFixedEntityDescriptionContainer>
                    <StyledFixedEntityMainDescription>{infoAggiuntiva.descrizione}</StyledFixedEntityMainDescription>
                    <StyledFixedEntityBottomDescription>
                      Min - max: {classeEsito.legaturaMin}
                      &nbsp;-&nbsp;{classeEsito.legaturaMax}
                    </StyledFixedEntityBottomDescription>
                  </StyledFixedEntityDescriptionContainer>
                </StyledFixedEntityWrapper>
                <StyledRemoveButton
                  onClick={() =>
                    onStateChange({
                      type: "3",
                      subtype: { type: "risultati", nessunaCorrispondenza: false, visualizzaTutti: false },
                      avvenimento: avvenimento,
                      classeEsito: classeEsito,
                      text: "",
                      infoAggiuntivaAccordionToggle: {},
                    })
                  }
                  data-qa={`smart_search_rimuovi_infoAggiuntiva_${infoAggiuntiva.codicePalinsesto}_${infoAggiuntiva.codiceAvvenimento}_${infoAggiuntiva.codiceClasseEsito}_${infoAggiuntiva.idInfoAggiuntiva}`}
                >
                  &times;
                </StyledRemoveButton>
              </StyledFixedEntityContainer>
            );
          })()}
      </StyledSmartSearchSlot>
    </StyledSmartSearchSlotContainer>
  );
}
export const SmartSearchSlotsMemo = React.memo(SmartSearchSlots);

const StyledSmartSearchSlotContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
`;

export const smartSearchSlotSpacing = "12px";

const StyledSmartSearchSlot = styled.div`
  border-radius: 4px;
  background-color: #444444;
  height: 88px;
  padding: 13px 8px 13px 11px;
  width: calc(33.33% - ${smartSearchSlotSpacing} / 2);
  flex-shrink: 0;
  box-sizing: border-box;
`;

const StyledRemoveButton = styled.span`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 22px;
  color: #444444;
  position: absolute;
  top: -13px;
  right: -7px;
  border: 5px solid #444444;
  cursor: pointer;
`;

const StyledFixedEntityContainer = styled.div`
  display: flex;
  position: relative;
`;

const StyledFixedEntityWrapper = styled.div`
  display: flex;
  color: white;
  font-style: normal;
`;

const StyledFixedEntityCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid white;
  width: 76px;
  height: 57px;
  font-family: Roboto;
  font-weight: 700;
  font-size: 1.125rem;
  margin-right: 10px;
  background-color: #333333;
`;

const StyledFixedAvvenimentoCode = styled.div<{
  isAvvenimentoLive: boolean;
}>`
  font-family: Roboto;
  border: 2px solid white;
  border-bottom: ${(props) => (props.isAvvenimentoLive ? "none" : "2px solid #ffffff")};
  border-radius: ${(props) => (props.isAvvenimentoLive ? "4px 4px 0 0" : "4px")};
  width: 76px;
  height: ${(props) => (props.isAvvenimentoLive ? "42px" : "57px")};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  background-color: #333333;
`;

const StyledFixedEntityDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  max-width: 216px;
`;

const StyledFixedEntityTopDescription = styled.div`
  font-weight: 400;
  font-size: 0.844rem;
  font-family: Roboto;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledFixedEntityMainDescription = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledFixedEntityBottomDescription = styled.div`
  font-family: Roboto;
  font-weight: 400;
  font-size: 0.75rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
