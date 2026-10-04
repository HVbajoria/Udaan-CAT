import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.LOCAL_AI_PORT || 8787);
const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const ollamaModel = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

app.use(express.json({ limit: '32kb' }));

const textWithinLimit = (value, maxLength) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, model: ollamaModel, ollamaBaseUrl });
});

app.post('/api/coach/explain', async (request, response) => {
  const {
    question,
    passage,
    options,
    selectedAnswer,
    correctAnswer,
    officialExplanation,
    topicName,
  } = request.body || {};

  if (
    !textWithinLimit(question, 4000) ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 8 ||
    !options.every((option) => textWithinLimit(option, 500)) ||
    !textWithinLimit(correctAnswer, 500) ||
    !textWithinLimit(officialExplanation, 3000) ||
    !textWithinLimit(topicName, 200)
  ) {
    return response.status(400).json({ error: 'Invalid coaching request.' });
  }

  const prompt = [
    `Topic: ${topicName}`,
    passage && textWithinLimit(passage, 8000) ? `Passage:\n${passage}` : '',
    `Question:\n${question}`,
    `Options:\n${options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n')}`,
    `Student answer: ${textWithinLimit(selectedAnswer, 500) ? selectedAnswer : 'Not answered'}`,
    `Verified correct answer: ${correctAnswer}`,
    `Verified solution:\n${officialExplanation}`,
  ].filter(Boolean).join('\n\n');

  const system = [
    'You are a careful CAT exam coach running locally.',
    'Give a concise supplemental explanation in plain text using the verified solution as ground truth.',
    'Do not change the verified answer, score, or official explanation.',
    'Point out the key reasoning step and one practical mistake-avoidance tip.',
    'If the verified solution is insufficient, say so instead of inventing facts.',
    'Do not use markdown tables, tools, or external links.',
  ].join(' ');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: ollamaModel,
        stream: false,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        options: { temperature: 0.2 },
      }),
    });

    if (!ollamaResponse.ok) {
      return response.status(502).json({
        error: `Ollama returned ${ollamaResponse.status}. Check that model "${ollamaModel}" is installed.`,
      });
    }

    const result = await ollamaResponse.json();
    const explanation = result?.message?.content?.trim();
    if (!explanation || explanation.length > 6000) {
      return response.status(502).json({ error: 'The local model returned an invalid explanation.' });
    }

    return response.json({ explanation });
  } catch (error) {
    const message = error?.name === 'AbortError'
      ? 'The local model timed out. Try a smaller model or retry.'
      : 'Cannot reach Ollama. Start Ollama and verify the local AI server configuration.';
    return response.status(503).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Local AI adapter listening at http://127.0.0.1:${port}`);
  console.log(`Using Ollama model: ${ollamaModel}`);
});
