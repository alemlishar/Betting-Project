import styled from "styled-components/macro";
import { FormattedMessage } from "react-intl";
import useSWR from "swr";
import { getAlberaturaVirtualMenu } from "src/components/virtual/virtual-api";
import { MenuVirtualDisciplina } from "src/components/virtual/MenuVirtualDisciplina";
import { VirtualStateNavigation } from "src/components/virtual/virtual-dto";
type MenuVirtualType = {
  virtualState: VirtualStateNavigation | undefined;
};
export function MenuVirtual({ virtualState }: MenuVirtualType) {
  const { data: alberaturaVirtual } = useSWR("alberatura_virtual", getAlberaturaVirtualMenu);

  return (
    <StyledMenuVirtual data-testid="menu-virtual">
      <StyledFilterContainer>
        <StyledFilterSelector isActive={true}>
          <FormattedMessage description="MenuVirtual: title filter disciplina" defaultMessage="Disciplina" />
          <div>
            <p className={"shortcut"}>
              <FormattedMessage
                description="MenuVirtual: Discipline header label shortcut in 'virtual'"
                defaultMessage="Ins"
              />
            </p>
          </div>
        </StyledFilterSelector>
      </StyledFilterContainer>
      <StyledDisciplinesContainer>
        <FormattedMessage description="MenuVirtual: filter all" defaultMessage="Tutte le discipline" />
      </StyledDisciplinesContainer>
      {alberaturaVirtual && alberaturaVirtual.length > 0 && (
        <MenuVirtualDisciplina alberaturaVirtual={alberaturaVirtual} virtualState={virtualState} />
      )}
    </StyledMenuVirtual>
  );
}
const StyledMenuVirtual = styled.div`
  border-top-right-radius: 4px;
  height: fit-content;
  width: 300px;
  height: calc(100vh - 160px);
`;
const StyledDisciplinesContainer = styled.div`
  background-color: #333333;
  color: white;
  font-size: 17px;
  display: flex;
  justify-content: left;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
`;
const StyledFilterContainer = styled.div`
  display: flex;
  justify-content: left;
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
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-family: Mulish;
  font-size: ${(props) => (props.isActive ? "18px" : "16px")};
  font-weight: 600;
  letter-spacing: 0;
  line-height: 18px;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  padding: 0px 10px;
  position: relative;
  margin: ${(props) => (props.isActive ? "-10px 0 10px" : "0")};
  border-radius: ${(props) => (props.isActive ? "4px 4px 0 0" : "0")};
  background-color: ${(props) => (props.isActive ? "#333333" : "transparent")};
  box-shadow: ${(props) => (props.isActive ? "0 2px 4px 0 rgba(0, 0, 0, 0.5)" : "none")};
  &::before {
    content: "";
    height: 6px;
    width: calc(100% - 20px);
    background-color: #aac21f;
    position: absolute;
    display: ${(props) => (props.isActive ? "block" : "none")};
    bottom: 0;
    left: 10px;
  }
  div {
    display: flex;
    align-items: center;
    .label {
      color: #ffffff;
      font-family: Roboto, sans-serif;
      font-size: 17px;
      font-weight: bold;
    }

    .shortcut {
      height: 22px;
      background-color: #ffffff;
      color: #000000;
      font-family: Roboto, sans-serif;
      font-size: 13px;
      font-weight: bold;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      padding: 0 8px;
    }
  }
`;
