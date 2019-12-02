const ref = require("ref");
const ffi = require("ffi");
const struct = require("ref-struct");

//variables for getDisplays()
const SM_CMONITORS = 80;

//variables for SetSleepDisplay()
const HWND_BROADCAST = 0xffff;
const WM_SYSCOMMAND = 0x0112;
const SC_MONITORPOWER = 0xf170;
const SC_MONITORPOWER_ON = -1;
const SC_MONITORPOWER_OFF = 2;
const SC_MONITORPOWER_LOW = 1;

//variables for getLastInputTime()
var lastInputInfo = struct({
  lastInput_size: "uint32",
  lastInput_tick: "ulong"
});

var PlastInputInfo = ref.refType(lastInputInfo);

//variables for setWakeDisplay()
var inputStruct = struct({
  inputType: "ulong",
  mouseInput_dx: "long",
  mouseInput_dy: "long",
  mouseInput_data: "ulong",
  mouseInput_dwFlags: "ulong",
  mouseInput_time: "ulong",
  mouseInput_dwExtraInfo: "ulong"
});

var PinputStruct = ref.refType(inputStruct);

// Class winAPI future functions can be defined here.
class winAPI {
  constructor() {
    this.user32 = ffi.Library("user32.dll", {
      GetSystemMetrics: ["int", ["int"]],
      SendMessageA: ["int", ["int", "uint", "int", "int"]],
      GetLastInputInfo: ["bool", [PlastInputInfo]],
      SendInput: ["uint", ["uint", PinputStruct, "int"]]
    });

    this.sysInfo = ffi.Library("kernel32.dll", {
      GetTickCount64: ["ulong", []]
    });
  }

  getDisplays() {
    return this.user32.GetSystemMetrics(SM_CMONITORS);
  }

  setSleepDisplay() {
    return this.user32.SendMessageA(
      HWND_BROADCAST,
      WM_SYSCOMMAND,
      SC_MONITORPOWER,
      SC_MONITORPOWER_OFF
    );
  }

  setWakeDisplay() {
    var movMouse = new inputStruct();
    movMouse.inputType = 0;
    movMouse.mouseInput_time = 0;
    movMouse.mouseInput_data = 0;
    movMouse.mouseInput_dx = 10;
    movMouse.mouseInput_dy = 20;
    movMouse.mouseInput_dwFlags = 0x8000;

    return this.user32.SendInput(1, movMouse.ref(), 28);
  }

  getLastInputTime() {
    var currUser = new lastInputInfo();
    currUser.lastInput_tick = 0;
    currUser.lastInput_size = ref.sizeof.uint32 + ref.sizeof.ulong;

    if (this.user32.GetLastInputInfo(currUser.ref())) {
      var date = new Date();
      var elapsedTicks =
        this.sysInfo.GetTickCount64() - currUser.lastInput_tick;
      var inputTime = new Date(date.getTime() - elapsedTicks);
      return this.formatDate(inputTime);
    }

    // should never return zero in ideal cases, return zero when win API call fails.
    return 0;
  }

  formatDate(date) {
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var milli = date.getMilliseconds();

    var time = hour + ":" + min + ":" + sec + "." + milli;

    return time;
  }
}
module.exports = winAPI;
