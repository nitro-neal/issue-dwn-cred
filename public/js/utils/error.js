import { sendLogServerSide } from "./logger.js";

window.onerror = async function (message, source, lineno, colno, error) {
  // Format the error information
  const errorData = {
    message,
    source,
    line: lineno,
    column: colno,
    stack: error ? error.stack : null,
  };

  // Call your log function
  await sendLogServerSide(errorData);

  // Prevent the default browser error handler
  return true;
};
