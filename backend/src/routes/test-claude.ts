import express from 'express';

export const testClaudeRoutes = express.Router();

testClaudeRoutes.get('/test', async (req, res) => {
  try {
    // 动态导入避免启动时错误
    const Anthropic = await import('@anthropic-ai/sdk');
    
    if (!process.env.CLAUDE_API_KEY) {
      return res.json({
        success: false,
        message: 'Claude API key not configured',
      });
    }

    const anthropic = new Anthropic.default({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    const completion = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say hello in Japanese',
        },
      ],
    });

    const response = completion.content[0]?.type === 'text' 
      ? completion.content[0].text 
      : 'No response';

    res.json({
      success: true,
      claude_response: response,
      message: 'Claude API test successful',
    });

  } catch (error) {
    res.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Claude API test failed',
    });
  }
});