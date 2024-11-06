import { EventoVirtualeRace, RacerVirtualeList } from "src/components/virtual/virtual-dto";
import { css } from "styled-components/macro";

export function VirtualRaceAccopiataTrioButton({
  evento,
  runner,
  descr,
  inCorso,
  isEnabled,
  onClick,
  isSelected,
}: {
  evento: EventoVirtualeRace;
  runner: RacerVirtualeList;
  descr: string;
  inCorso: boolean;
  isEnabled: boolean;
  onClick(): void;
  isSelected: boolean;
}) {
  return (
    <button
      css={css`
        width: 100%;
        height: 100%;
        background-color: ${isSelected ? "#aac21f" : "#ededed"};
        border: none;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: Roboto;
        font-size: 1rem;
        outline: none;
        pointer-events: ${inCorso || !isEnabled ? "none" : "auto"};
        cursor: ${inCorso ? "default" : "pointer"};
        :hover {
          background-color: ${inCorso ? "#ededed" : "#aac21f"};
        }
        opacity: ${inCorso ? 0.5 : !isEnabled ? 0.5 : 1};
      `}
      onClick={() => onClick()}
    >
      <div
        css={css`
          color: #005936;
          font-weight: bold;
        `}
      >
        {inCorso ? "-" : descr}
      </div>
    </button>
  );
}
