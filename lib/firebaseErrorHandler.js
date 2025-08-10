// Firebase error handling utilities
export function getFirebaseErrorMessage(error) {
  if (!error) return 'An unknown error occurred';
  
  // Firebase specific error codes
  const errorMap = {
    'permission-denied': 'You do not have permission to perform this action',
    'unavailable': 'Service is temporarily unavailable. Please try again later',
    'deadline-exceeded': 'Request timed out. Please check your internet connection',
    'resource-exhausted': 'Too many requests. Please wait a moment and try again',
    'unauthenticated': 'Authentication required to perform this action',
    'failed-precondition': 'Request cannot be completed in the current state',
    'aborted': 'Request was aborted. Please try again',
    'out-of-range': 'Request parameters are out of valid range',
    'unimplemented': 'This feature is not yet implemented',
    'internal': 'Internal server error. Please try again later',
    'data-loss': 'Data loss detected. Please refresh and try again',
    'network-request-failed': 'Network error. Please check your internet connection',
    'offline': 'You appear to be offline. Please check your internet connection'
  };

  // Check for Firebase error code
  if (error.code && errorMap[error.code]) {
    return errorMap[error.code];
  }

  // Check for common network errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your internet connection and try again';
    }
    
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again';
    }
    
    if (message.includes('permission')) {
      return 'Permission denied. Please check your access rights';
    }
  }

  // Fallback to generic message
  return 'Something went wrong. Please try again later';
}

export function isNetworkError(error) {
  if (!error) return false;
  
  const networkCodes = [
    'unavailable',
    'deadline-exceeded', 
    'network-request-failed',
    'offline'
  ];
  
  if (error.code && networkCodes.includes(error.code)) {
    return true;
  }
  
  if (error.message) {
    const message = error.message.toLowerCase();
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('connection') ||
           message.includes('offline');
  }
  
  return false;
}

export function shouldRetry(error, retryCount = 0, maxRetries = 3) {
  if (retryCount >= maxRetries) return false;
  
  // Retry on network errors
  if (isNetworkError(error)) return true;
  
  // Retry on specific Firebase errors
  const retryableCodes = [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'aborted',
    'internal'
  ];
  
  return error.code && retryableCodes.includes(error.code);
}

export async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if this error type shouldn't be retried
      if (!shouldRetry(error, attempt, maxRetries)) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
}