export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000,
  timeout = 30000
): Promise<T> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error(`Operation timed out after ${timeout}ms`)),
        timeout
      );
    });

    const result = await Promise.race([fn(), timeoutPromise]);

    return result;
  } catch (error: unknown) {
    if (retries <= 0) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, delay));

    return withRetry(fn, retries - 1, delay * 1.5, timeout);
  }
}
