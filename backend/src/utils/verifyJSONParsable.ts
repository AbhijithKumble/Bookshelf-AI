function safeParseJSON(input: string): { books: string[] } | null {
  try {
    const parsed = JSON.parse(input);

    // Check if structure matches { books: [array of strings] }
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.books) &&
      parsed.books.every((b: any) => typeof b === "string")
    ) {
      return parsed; // Valid JSON structure
    }

    return null; // Invalid structure
  } catch (error) {
    return null; // Not valid JSON
  }
}

export default safeParseJSON;
