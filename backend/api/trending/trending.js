import { supabase } from './client';
import moment from 'moment';

async function getTrendingItems(timeFrame) {
  const { data, error } = await supabase
    .from('user_interactions')
    .select('item_id, count:item_id')
    .gte('timestamp', moment().subtract(timeFrame, 'seconds').toISOString())
    .group('item_id')
    .order('count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching trending items:', error);
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  try {
    const trendingItems = await getTrendingItems(7 * 24 * 60 * 60); // 1 week in seconds
    res.json(trendingItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
}
