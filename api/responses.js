const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 无环境变量时直接拒绝，不使用硬编码默认值
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return res.status(500).json({ error: '服务器配置错误' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ error: '未授权访问' });
    }

    // 一次性读取整个列表，避免 N 次串行 kv.get
    const raw = await kv.lrange('responses', 0, -1);
    const responses = (raw || []).map(item =>
      typeof item === 'string' ? JSON.parse(item) : item
    );

    responses.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

    return res.status(200).json({
      success: true,
      count: responses.length,
      responses
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: '服务器错误' });
  }
};
