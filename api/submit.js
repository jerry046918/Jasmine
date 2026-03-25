const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { respondent_name, respondent_dept, ...answers } = req.body;

    if (!respondent_name || !respondent_dept) {
      return res.status(400).json({ error: '请填写完整的基本信息' });
    }

    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const responseData = {
      id: responseId,
      respondent_name,
      respondent_dept,
      submitted_at: new Date().toISOString(),
      submitted_at_cn: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
      answers
    };

    // 用 lpush 原子地把完整数据写入列表，避免 read-modify-write 竞态
    await kv.lpush('responses', JSON.stringify(responseData));

    return res.status(200).json({
      success: true,
      message: '提交成功',
      id: responseId
    });

  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
};
