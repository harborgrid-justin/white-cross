164,169 {
  /return {/,/};/ {
    s/  return {/  return {\n    handleError,\n    handleApiError: handleError, \/\/ Alias for backward compatibility/
    /handleError,$/d
    /transformError,$/d
    /getDisplayMessage,$/d
    /shouldRetry,$/d
  }
}
