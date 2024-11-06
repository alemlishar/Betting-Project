import { msToMinutes } from "src/components/common/livescore-box/LiveEventBox";

test("Live results: milliseconds values should be converted in the mm:ss format", () => {
  expect(msToMinutes(0)).toBe("00:00");
  expect(msToMinutes(60000)).toBe("01:00");
  expect(msToMinutes(61000)).toBe("01:01");
  expect(msToMinutes(70000)).toBe("01:10");
  expect(msToMinutes(2222222)).toBe("37:02");
  expect(msToMinutes(3333333)).toBe("55:33");
});

// @TODO: add test for msToTimer function
