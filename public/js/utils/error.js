import { sendLogServerSide } from "./logger";

window.onerror = function (message, source, lineno, colno, error) {
  // Format the error information
  const errorData = {
    message,
    source,
    line: lineno,
    column: colno,
    stack: error ? error.stack : null,
  };

  // Call your log function
  sendLogServerSide(errorData);

  // Prevent the default browser error handler
  return true;
};
