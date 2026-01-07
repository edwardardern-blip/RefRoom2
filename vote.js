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
    const { userId, referenceId, voteType } = req.body;
    
    // Check existing vote
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', userId)
      .eq('reference_id', referenceId)
      .maybeSingle();
    
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote
        await supabase.from('votes').delete().eq('id', existingVote.id);
        
        const field = voteType === 'up' ? 'upvotes' : 'downvotes';
        await supabase.rpc('decrement_vote', { ref_id: referenceId, field });
      } else {
        // Change vote
        await supabase.from('votes').update({ vote_type: voteType }).eq('id', existingVote.id);
        
        const oldField = existingVote.vote_type === 'up' ? 'upvotes' : 'downvotes';
        const newField = voteType === 'up' ? 'upvotes' : 'downvotes';
        
        await supabase.from('references')
          .update({ [oldField]: supabase.raw(`${oldField} - 1`), [newField]: supabase.raw(`${newField} + 1`) })
          .eq('id', referenceId);
      }
    } else {
      // New vote
      await supabase.from('votes').insert({ user_id: userId, reference_id: referenceId, vote_type: voteType });
      
      const field = voteType === 'up' ? 'upvotes' : 'downvotes';
      await supabase.from('references')
        .update({ [field]: supabase.raw(`${field} + 1`) })
        .eq('id', referenceId);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}