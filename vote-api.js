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

  try {
    const { userId, referenceId, voteType } = req.body;
    
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', userId)
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    const ref = await supabase.from('references').select('upvotes, downvotes').eq('id', referenceId).single();
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        await supabase.from('votes').delete().eq('id', existingVote.id);
        const field = voteType === 'up' ? 'upvotes' : 'downvotes';
        await supabase.from('references')
          .update({ [field]: ref.data[field] - 1 })
          .eq('id', referenceId);
      } else {
        await supabase.from('votes').update({ vote_type: voteType }).eq('id', existingVote.id);
        const oldField = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes';
        const newField = voteType === 'up' ? 'upvotes' : 'downvotes';
        await supabase.from('references')
          .update({ 
            [oldField]: ref.data[oldField] - 1,
            [newField]: ref.data[newField] + 1
          })
          .eq('id', referenceId);
      }
    } else {
      await supabase.from('votes').insert({ user_id: userId, reference_id: referenceId, vote_type: voteType });
      const field = voteType === 'up' ? 'upvotes' : 'downvotes';
      await supabase.from('references')
        .update({ [field]: ref.data[field] + 1 })
        .eq('id', referenceId);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}