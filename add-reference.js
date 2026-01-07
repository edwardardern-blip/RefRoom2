import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
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
    const { title, url, subject, description, userId } = req.body;
    
    const { data, error } = await supabase
      .from('references')
      .insert({
        title,
        url,
        subject,
        description,
        added_by: userId,
        upvotes: 0,
        downvotes: 0,
        verified: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}