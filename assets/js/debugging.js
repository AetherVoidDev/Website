(function() {
  const isDevToolsOpen = () => {
    const devTools = /./;
    devTools.toString = function() {
      return 'devtools';
    };

    const checkDevTools = window.open('', '', 'width=1,height=1');
    checkDevTools.console.log('%c', devTools);

    const isOpen = checkDevTools.console.toString() === 'devtools';
    checkDevTools.close();
    return isOpen;
  };

  const logError = (message, code, type = 'Error') => {
    const colorMap = {
      Error: 'color: #FF6347; font-weight: bold;',
      Warning: 'color: #FFA500; font-weight: bold;',
      Info: 'color: #1E90FF; font-weight: bold;',
      Success: 'color: #32CD32; font-weight: bold;',
    };

    console.log(`%c[${type}] Error Code: ${code} - ${message}`, colorMap[type] || 'color: #000000;');
  };

  const handleError = (error) => {
    const errorCode = error.code || 'UNKNOWN_ERROR';
    const errorMessage = error.message || 'An unexpected error occurred';
    
    logError(errorMessage, errorCode, 'Error');
  };

  const handleWarning = (message, code) => {
    logError(message, code, 'Warning');
  };

  const handleInfo = (message) => {
    logError(message, 'INFO', 'Info');
  };

  const handleSuccess = (message) => {
    logError(message, 'SUCCESS', 'Success');
  };

  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  console.error = function(...args) {
    handleError({ code: 'CONSOLE_ERROR', message: args.join(' ') });
    originalConsoleError.apply(console, args);
  };

  console.warn = function(...args) {
    handleWarning(args.join(' '), 'CONSOLE_WARNING');
    originalConsoleWarn.apply(console, args);
  };

  console.log = function(...args) {
    handleInfo(args.join(' '));
    originalConsoleLog.apply(console, args);
  };

  const checkDevToolsOpen = setInterval(() => {
    if (isDevToolsOpen()) {
      handleSuccess('Developer Tools detected. Debugging session activated.');
      clearInterval(checkDevToolsOpen);

      document.body.style.backgroundColor = '#1E1E1E';

      window.addEventListener('error', (event) => {
        handleError({
          message: event.message,
          code: 'JS_RUNTIME_ERROR',
        });
      });
    }
  }, 1000);

})();