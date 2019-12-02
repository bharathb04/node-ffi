const winAPI = require("./winAPI");

const api = new winAPI();

console.log("Number of Displays:", api.getDisplays());

console.log(
  "If the monitor is set to sleep, this value will be non Zero:",
  api.setSleepDisplay()
);

/*Please Note wake monitor is achieved by sending mouse movement input, the size has been passed as 28 bytes for 32-bit 
windows operating system.*/

setTimeout(() => {
  console.log(
    "If the monitor is set to wake, this value will be non Zero:",
    api.setWakeDisplay()
  );
}, 5000);

console.log("Last Input time in HH:MM:SS.ms format:", api.getLastInputTime());

/*Please Note processor consumes few milli seconds more to calculate current date, so few milli seconds might get added 
but the seconds will be the same whatever delay we input*/
setTimeout(() => {
  console.log(
    "Last Input time with 2s delay to function call:",
    api.getLastInputTime()
  );
}, 2000);
