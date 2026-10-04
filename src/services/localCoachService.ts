export interface LocalCoachRequest {
  question: string;
  passage?: string;
  options: string[];
  selectedAnswer?: string;
  correctAnswer: string;
  officialExplanation: string;
  topicName: string;
}

interface LocalCoachResponse {
  explanation?: string;
  error?: string;
}

/**
 * Requests a supplemental explanation from the local open-weight model.
 * The browser talks only to our same-origin adapter; Ollama stays on loopback.
 */
export async function explainWithLocalCoach(
  request: LocalCoachRequest,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch('/api/coach/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
    signal,
  });

  let payload: LocalCoachResponse = {};
  try {
    payload = (await response.json()) as LocalCoachResponse;
  } catch {
    // Preserve a useful error below when the adapter is unavailable.
  }

  if (!response.ok || !payload.explanation) {
    throw new Error(payload.error || 'The local coach is unavailable. Start Ollama and the local AI server.');
  }

  return payload.explanation;
}
