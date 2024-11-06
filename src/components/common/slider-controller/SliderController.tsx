import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { css } from "styled-components/macro";

type SliderControllerButtonProps = {
  icon: React.ReactNode;
  isEnabled: boolean;
  onClick(): void;
};
export function SliderControllerButton({ icon, isEnabled, onClick }: SliderControllerButtonProps) {
  return (
    <div
      style={{ opacity: isEnabled ? 1 : 0.5 }}
      css={css`
        flex-grow: 1;
        width: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          ${isEnabled ? "cursor: pointer;" : ""}
        }
      `}
      onClick={onClick}
    >
      {icon}
    </div>
  );
}
/*
sinistra: abilitato se scrollLeft > 0, disabilitato altrimenti, controllare subito e dopo ogni click
destra: abilitato se larghezza contenuto > larghezza contenitore && non stiamo alla fine, controllare subito e dopo ogni click
*/

export function useScrollingSliderControls(containerRef: React.MutableRefObject<HTMLDivElement | null>) {
  const [{ left, right }, setEnabled] = useState({ left: false, right: false });
  const check = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const contentWidth = containerRef.current.scrollWidth;
    const scrollLeft = containerRef.current.scrollLeft;
    const atEnd = contentWidth - scrollLeft !== containerWidth;
    const left = scrollLeft > 0;
    const right = atEnd;
    setEnabled({ left, right });
  }, [containerRef]);

  const scrollBy = useCallback(
    (scrollMultiplier: number, multiplyByContainerWidth: boolean = true) => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: multiplyByContainerWidth ? scrollMultiplier * containerRef.current.clientWidth : scrollMultiplier,
          behavior: "smooth",
        });
      }
    },
    [containerRef],
  );
  // Setup isScrolling variable
  let isScrolling: NodeJS.Timeout;

  // Listen for scroll events
  containerRef.current?.addEventListener(
    "scroll",
    function (event) {
      // Clear our timeout throughout the scroll
      clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(function () {
        // Run the callback
        check();
      }, 66);
    },
    false,
  );

  useEffect(() => {
    check();
  }, [check, containerRef]);

  return { left, right, scrollBy };
}
