const winAPI = require("./winAPI");

const testAPI = new winAPI();

test("Returns a numeric value of number of Monitors in Windows", () => {
  expect(typeof testAPI.getDisplays()).toBe("number");
});

test("There must be atleast one Montior in Windows", () => {
  expect(testAPI.getDisplays()).toBeGreaterThan(0);
});

test("Check that the monitor is set to sleep", () => {
  expect(testAPI.setSleepDisplay()).toBeTruthy();
});

test("Check that the monitor is set to wake", () => {
  expect(testAPI.setWakeDisplay()).toBeTruthy();
});

test("Check that the Last Input Time should not be zero", () => {
  expect(testAPI.getLastInputTime()).toBeTruthy();
});

test("Check that the Last Input Time is valid", () => {
  expect(
    parseInt(testAPI.getLastInputTime().substring(0, 2))
  ).toBeLessThanOrEqual(23);
  expect(
    parseInt(testAPI.getLastInputTime().substring(3, 5))
  ).toBeLessThanOrEqual(59);
  expect(
    parseInt(testAPI.getLastInputTime().substring(6, 8))
  ).toBeLessThanOrEqual(59);
});
