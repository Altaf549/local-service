const isDebug = true; 

const Console = {
  log: (...args: any[]) => {
    if (isDebug) {
      console.log(...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDebug) {
      console.warn(...args);
    }
  },

  error: (...args: any[]) => {
    if (isDebug) {
      console.error(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDebug) {
      console.info(...args);
    }
  },
};

export default Console;
