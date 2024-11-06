import React, { useState } from "react";
import { css } from "styled-components/macro";
import { VirtualTemplateCalcioSingolo } from "src/components/virtual/template/VirtualTemplateCalcioSingolo";
import { EventoVirtualeCalcioSingoloConCLuster } from "src/components/virtual/virtual-dto";

export function VirtualTemplateFootball({ event }: { event: EventoVirtualeCalcioSingoloConCLuster }) {
  const [selectedClusterIndex, setSelectedClusterIndex] = useState(NaN);
  const selectedCluster = event.vrolHighLightClusterList?.[selectedClusterIndex];
  return (
    <div>
      <div
        css={css`
          background-color: #ededed;
          padding: 5px;
          display: flex;
          margin-bottom: 10px;
        `}
      >
        <ClusterButton
          isSelected={isNaN(selectedClusterIndex)}
          onSelect={() => {
            setSelectedClusterIndex(NaN);
          }}
        >
          {clusterLabelMap["SCOMMESSE TUTTI"]}
        </ClusterButton>
        {event.vrolHighLightClusterList?.map((cluster, index) => {
          return (
            <ClusterButton
              key={index}
              isSelected={index === selectedClusterIndex}
              onSelect={() => setSelectedClusterIndex(index)}
            >
              {clusterLabelMap[cluster.descrizione as keyof typeof clusterLabelMap]}
            </ClusterButton>
          );
        })}
      </div>
      <VirtualTemplateCalcioSingolo
        event={event}
        filterScommesseBy={
          selectedCluster ? (scommessa) => selectedCluster.scommessaKeyList.includes(scommessa.id) : undefined
        }
      />
    </div>
  );
}

// DEBT to be translated
const clusterLabelMap = {
  "SCOMMESSE TUTTI": "Tutti",
  "SCOMMESSE PRINCIPALI": "Principali",
  "SCOMMESSE GOAL": "Goal",
  "SCOMMESSE COMBO": "Combo",
};

export function ClusterButton({
  isSelected,
  onSelect,
  children,
  isWidthFull,
}: {
  isSelected: boolean;
  onSelect(): void;
  children: React.ReactNode;
  isWidthFull?: boolean;
}) {
  return (
    <div
      onClick={onSelect}
      css={css`
        margin: ${isWidthFull ? "0px" : "5px"};
        width: ${isWidthFull ? "100%" : "250px"};
        height: 45px;
        font-family: Roboto;
        font-size: 16px;
        color: ${isSelected ? "#ffffff" : "#333333"};
        background-color: ${isSelected ? "#AAC21F" : "#ffffff"};
        font-weight: ${isSelected ? "bold" : "normal"};
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      {children}
    </div>
  );
}
