import { orderMenuVirtual } from "src/components/virtual/helpers";
import { getAlberaturaVirtual1Mock } from "src/components/virtual/mock/getAlberaturaVirtual1Mock";

test("Order Menu Virtual: order item for startTime", () => {
  const date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(0);
  const alberaturaVirtualEventMock = getAlberaturaVirtual1Mock(date, new Date());

  expect(orderMenuVirtual(alberaturaVirtualEventMock)[0].eventId).toBe(3);
});
