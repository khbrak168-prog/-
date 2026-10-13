import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'Theab Digital Server' });
  });

  // AI Wedding Assistant Endpoint using Gemini API
  app.post('/api/ai-wedding-assistant', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY environment variable is not configured.',
        });
      }

      const { prompt, type, language } = req.body;
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      let systemInstruction = `You are a professional Cambodian Royal Wedding Protocol Specialist & Writer for "Theab Digital" (ធៀប Digital).
You excel at creating elegant, high-respect formal invitation speeches in Khmer (ភាសាខ្មែរផ្លូវការ) and English.
You format responses cleanly with beautiful, polite language suitable for royal, high-ranking, and formal Cambodian wedding invitations.`;

      if (type === 'vow') {
        systemInstruction += ` Focus on romantic vows and blessings for groom and bride in Khmer or English as requested.`;
      } else if (type === 'guest_title') {
        systemInstruction += ` Focus on crafting respectful personalized guest invitation titles (e.g. សម្តេច, ឯកឧត្តម, លោកជំទាវ, ឧកញ៉ា, លោក/លោកស្រី, etc.).`;
      }

      const userPrompt = prompt || `សូមសរសេរពាក្យអញ្ជើញអាពាហ៍ពិពាហ៍ផ្លូវការខ្មែរយ៉ាងប្រណិតបំផុតសម្រាប់កូនប្រុស ម៉ុន គង់ប្រាក់ និង កូនស្រី អុី សៀវហ័ន`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nTask request:\n${userPrompt}\nLanguage: ${language || 'kh'}` }],
          },
        ],
      });

      const generatedText = response.text || 'សូមអភ័យទោស មិនអាចបង្កើតអត្ថបទបានទេនៅពេលនេះ។';
      res.json({ result: generatedText });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({ error: err?.message || 'Error executing AI request' });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Theab Digital Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
