import { orderBy, partition } from "lodash";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ReactComponent as IcoDanger } from "src/assets/images/icon-danger.svg";
import { Disciplina, FiltroGiornaliero, Manifestazione } from "src/components/prematch/prematch-api";
import { PrematchState, useAlberaturaPrematch } from "src/components/prematch/usePrematch";
import { useNavigazioneActions } from "src/components/root-container/useNavigazione";
import { ChiaveManifestazione } from "src/types/chiavi";
import styled, { css } from "styled-components/macro";

// DEBT estrarre componente disciplina
// DEBT move to menu prematch directory
// DEBT togliere overflo-hidden dal menu (vedi manifestazione selezionata che scassa tutto)

type MenuPrematchProps = {
  prematchState: PrematchState;
};

const filtroManifestazioniByDate = {
  tutti: "manifestazioneListByDisciplinaTutti",
  oggi: "manifestazioneListByDisciplinaOggi",
  "2 giorni": "manifestazioneListByDisciplinaOggiEDomani",
} as const;

export type FiltroMenuPrematch = keyof typeof filtroManifestazioniByDate;

function MenuPrematch({ prematchState }: MenuPrematchProps) {
  const alberatura = useAlberaturaPrematch();
  const { setFiltroGiornalieroMenu, disciplinaPrematchToggle } = useNavigazioneActions();
  const manifestazioneListByDisciplina = alberatura && alberatura[filtroManifestazioniByDate[prematchState.filtro]];
  const disciplinaSortedList = useMemo(() => {
    if (!alberatura || !manifestazioneListByDisciplina) {
      return [];
    }
    const chiaviDisciplinaList = Object.keys(manifestazioneListByDisciplina);
    const disciplinaList = chiaviDisciplinaList
      .map((chiaveDisciplina) => alberatura.disciplinaMap[chiaveDisciplina])
      .filter(Boolean);
    return orderBy(disciplinaList, [(item) => (item.posizione === 0 ? 1 : 0), "posizione", "descrizione"]);
  }, [alberatura, manifestazioneListByDisciplina]);
  if (!alberatura) {
    return <StyledMenuPrematch />;
  }
  return (
    <>
      <StyledMenuPrematch>
        <StyledFilterContainer>
          <StyledFilterSelector
            isActive={prematchState.filtro === "tutti"}
            data-qa={"manifestazione_menu_TUTTI"}
            onClick={() => setFiltroGiornalieroMenu("tutti")}
          >
            <FormattedMessage defaultMessage="tutti" description="filtroGiornaliero label tutti" />
            {prematchState.filtro === "tutti" && <StyledFilterActive />}
          </StyledFilterSelector>
          <StyledFilterSelector
            isActive={prematchState.filtro === "oggi"}
            data-qa={"manifestazione_menu_OGGI"}
            onClick={() => setFiltroGiornalieroMenu("oggi")}
          >
            <FormattedMessage defaultMessage="oggi" description="filtroGiornaliero label oggi" />
            {prematchState.filtro === "oggi" && <StyledFilterActive />}
          </StyledFilterSelector>
          <StyledFilterSelector
            isActive={prematchState.filtro === "2 giorni"}
            data-qa={"manifestazione_menu_2_GIORNI"}
            onClick={() => setFiltroGiornalieroMenu("2 giorni")}
          >
            <FormattedMessage defaultMessage="2 giorni" description="filtroGiornaliero label tutti" />
            {prematchState.filtro === "2 giorni" && <StyledFilterActive />}
          </StyledFilterSelector>
        </StyledFilterContainer>
        <StyledMainAlberatura data-testid="discipline">
          {manifestazioneListByDisciplina &&
            disciplinaSortedList.map((disciplina) => {
              const chiaviManifestazioneList = manifestazioneListByDisciplina[disciplina.key];
              const isOpen = prematchState.isDisciplinaAccordionOpenByKey[disciplina.key];
              return (
                <div key={disciplina.key}>
                  <DisciplinaItemMemo disciplina={disciplina} isOpen={isOpen} onToggle={disciplinaPrematchToggle} />
                  <div hidden={!isOpen}>
                    <ManifestazioneListMemo
                      disciplina={disciplina}
                      chiaviManifestazioneList={chiaviManifestazioneList}
                      manifestazioneMap={alberatura.manifestazioneMap}
                      selectedManifestazioneKey={prematchState.schedaManifestazione?.manifestazione?.key}
                    />
                  </div>
                </div>
              );
            })}
        </StyledMainAlberatura>
      </StyledMenuPrematch>
    </>
  );
}
export const MenuPrematchMemo = React.memo(MenuPrematch);

export type FiltroGiuornalieroString = "tutti" | "oggi" | "2 giorni";
export const getFiltroGiornalieroFromString = (filtroGiornaliero: FiltroGiuornalieroString): FiltroGiornaliero => {
  switch (filtroGiornaliero) {
    case "tutti":
      return 0;
    case "oggi":
      return 1;
    case "2 giorni":
      return 2;
    default:
      return 0;
  }
};

const StyledMenuPrematch = styled.div`
  background-color: white;
  border-top-right-radius: 4px;
  height: fit-content;
  width: 300px;
  height: calc(100vh - 160px);
`;

const StyledFilterContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  border-radius: 0 4px 0 0;
  background-color: #444444;
  padding: 0 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;

const StyledFilterSelector = styled.span<{
  isActive: boolean;
}>`
  color: #ffffff;
  font-family: Mulish;
  font-size: ${(props) => (props.isActive ? "18px" : "16px")};
  font-weight: 800;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  padding: ${(props) => (props.isActive ? "16px 20px" : "20px 18px")};
  position: relative;
  margin: ${(props) => (props.isActive ? "-10px 0 10px" : "0")};
  border-radius: ${(props) => (props.isActive ? "4px 4px 0 0" : "0")};
  background-color: ${(props) => (props.isActive ? "#333333" : "transparent")};
  box-shadow: ${(props) => (props.isActive ? "0 2px 4px 0 rgba(0, 0, 0, 0.5)" : "none")};
`;

const StyledFilterActive = styled.div`
  height: 6px;
  width: calc(100% - 20px);
  background-color: #aac21f;
  position: absolute;
  bottom: 0;
  left: 10px;
`;

const StyledMainAlberatura = styled.div`
  height: calc(100vh - 210px);
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const StyledDisciplina = styled.div<{
  isOpen: boolean;
}>`
  background-color: #ffffff;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  border-bottom: 1px solid #dcdcdc;
  box-shadow: ${(props) => (props.isOpen ? "0 2px 4px 0 rgba(0, 0, 0, 0.23)" : "none")};
  &:hover {
    background-color: #f4f4f4;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDisciplinaIcon = styled.img`
  width: 35.7px;
  height: auto;
  margin: -6px;
`;

const StyledDisciplinaLabel = styled.span`
  color: #333333;
  font-family: Mulish;
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 18px;
  margin-left: 18px;
  text-transform: capitalize;
`;

const StyledManifestazioneHeader = styled.div`
  height: 30px;
  border-bottom: 1px solid #e0e0e0;
  font-family: Mulish;
  font-size: 14px;
  line-height: 18px;
  font-weight: 800;
  color: #979797;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding-left: 80px; */
  text-transform: uppercase;
`;

// DEBT move to own file
type DisciplinaItemProps = {
  disciplina: Disciplina;
  isOpen: boolean;
  onToggle(disciplina: Disciplina): void;
};
function DisciplinaItem({ disciplina, isOpen, onToggle }: DisciplinaItemProps) {
  return (
    <StyledDisciplina
      isOpen={isOpen}
      onClick={() => onToggle(disciplina)}
      data-qa={`Sport_${disciplina.codiceDisciplina}`}
    >
      {/* TODO setFallbackImageSrc */}
      {/* <div
        css={css`
          width: 25px;
          height: 25px;
          overflow: hidden;
        `}
      >
        <StyledDisciplinaIcon src={disciplina.urlIcona}/>
      </div> */}
      <div
        css={css`
          width: 25px;
          height: 25px;
          box-sizing: border-box;
          border-radius: 20px;
          border: 3px solid #005936;
        `}
      ></div>
      <StyledDisciplinaLabel> {disciplina.descrizione.toLowerCase()}</StyledDisciplinaLabel>
    </StyledDisciplina>
  );
}
const DisciplinaItemMemo = React.memo(DisciplinaItem);

type ManifestazioneListProps = {
  disciplina: Disciplina;
  chiaviManifestazioneList: Array<ChiaveManifestazione>;
  manifestazioneMap: Record<ChiaveManifestazione, Manifestazione>;
  selectedManifestazioneKey: ChiaveManifestazione | undefined;
};
function ManifestazioneList({
  disciplina,
  chiaviManifestazioneList,
  manifestazioneMap,
  selectedManifestazioneKey,
}: ManifestazioneListProps) {
  const { topManifestazioneSortedList, altreManifestazioneSortedList } = useMemo(() => {
    const manifestazioneList = chiaviManifestazioneList
      .map((chiaveManifestazione) => manifestazioneMap[chiaveManifestazione])
      .filter(Boolean);
    const [topManifestazioneList, altreManifestazioneList] = partition(manifestazioneList, "topManifestazione");
    const topManifestazioneSortedList = orderBy(topManifestazioneList, [
      (item) => (item.posizione === 0 ? Number.MAX_VALUE : item.posizione),
      "posizione",
      "descrizione",
    ]);
    const altreManifestazioneSortedList = orderBy(altreManifestazioneList, [
      (item) => (item.posizione === 0 ? Number.MAX_VALUE : item.posizione),
      "posizione",
      "descrizione",
    ]);
    return { topManifestazioneSortedList, altreManifestazioneSortedList };
  }, [chiaviManifestazioneList, manifestazioneMap]);
  const showLabels = topManifestazioneSortedList.length > 0 && altreManifestazioneSortedList.length > 0;
  return (
    <>
      {showLabels && (
        <StyledManifestazioneHeader key="top manifestazioni">
          <FormattedMessage
            defaultMessage="Top Manifestazioni"
            description="label Top Manifestazioni of MenuPrematch"
          />
        </StyledManifestazioneHeader>
      )}
      {topManifestazioneSortedList.map((manifestazione) => (
        <ManifestazioneItemMemo
          key={manifestazione.key}
          disciplina={disciplina}
          manifestazione={manifestazione}
          isSelected={selectedManifestazioneKey === manifestazione.key}
        />
      ))}
      {showLabels && (
        <StyledManifestazioneHeader key="altre manifestazioni">
          <FormattedMessage
            defaultMessage="Altre Manifestazioni"
            description="label Altre Manifestazioni of MenuPrematch"
          />
        </StyledManifestazioneHeader>
      )}
      {altreManifestazioneSortedList.map((manifestazione) => (
        <ManifestazioneItemMemo
          disciplina={disciplina}
          key={manifestazione.key}
          manifestazione={manifestazione}
          isSelected={selectedManifestazioneKey === manifestazione.key}
        />
      ))}
    </>
  );
}
const ManifestazioneListMemo = React.memo(ManifestazioneList);

type ManifestazioneItemProps = {
  manifestazione: Manifestazione;
  disciplina: Disciplina;
  isSelected: boolean;
};

function ManifestazioneItem({ disciplina, manifestazione, isSelected }: ManifestazioneItemProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { descrizione, urlIcona } = manifestazione;
  const { openSchedaManifestazionePrematch } = useNavigazioneActions();
  return (
    <StyledManifestazioneContainer isManifestazioneSelected={isSelected}>
      <StyledManifestazionePreferiti />
      <StyledManifestazioneItem
        onClick={() => openSchedaManifestazionePrematch(disciplina, manifestazione)}
        data-qa={`Manifestazione_${disciplina.codiceDisciplina}_${manifestazione.codiceManifestazione}`}
      >
        {/* TODO decommentare quando saranno disponibili le nuove icone */}
        {/* <StyledManifestazioneIcon src={urlIcona} /> */}
        <div
          css={css`
            width: 20px;
            height: 20px;
            margin: 0 10px;
            box-sizing: border-box;
            border-radius: 20px;
            border: 3px solid #aac21f;
          `}
        ></div>
        <StyledManifestazioneLabel>{descrizione}</StyledManifestazioneLabel>
      </StyledManifestazioneItem>
      {isSelected && <StyledManifestazioneSelected />}
    </StyledManifestazioneContainer>
  );
}
const ManifestazioneItemMemo = React.memo(ManifestazioneItem);

const StyledManifestazioneContainer = styled.div<{
  isManifestazioneSelected: boolean;
}>`
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  height: 45px;
  cursor: pointer;
  box-sizing: border-box;

  border: ${(props) =>
    props.isManifestazioneSelected ? "2px solid #aac21f !important" : "2px solid #f4f4f4 !important"};
  font-weight: ${(props) => (props.isManifestazioneSelected ? "800" : "300")};

  border-bottom: 1px solid #dcdcdc;

  &:last-of-type {
    border-bottom: none;
  }
`;

const StyledManifestazionePreferiti = styled.div`
  width: 20px;
  height: 20px;
  background: #e0e0e0;
  margin-left: 20px;
`;
const StyledManifestazioneItem = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
`;

const StyledManifestazioneLabel = styled.div`
  font-family: "Roboto";
  font-size: 16px;
  color: #000000;
  opacity: 0.72;
  line-height: 19px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledManifestazioneIcon = styled.img`
  width: 20px;
  height: 20px;
  margin: 0 10px;
  border-radius: 50%;
`;

// FIX: arrow non si vede per colpa del parent overflow:hidden

const StyledManifestazioneSelected = styled.div`
  width: 4px;
  height: 100%;
  background-color: #aac21f;
  display: flex;
  align-items: center;
  margin-right: -2px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #aac21f;
    transform: rotate(45deg);
    right: -4px;
    border-bottom-left-radius: 50%;
  }
`;
