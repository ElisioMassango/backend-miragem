import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, Subscriber } from '../src/config/supabase.js';
import { getAllSubscribers } from '../src/utils/fileStorage.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido',
    });
  }

  try {
    let subscribers: Subscriber[] = [];

    // Tentar buscar do Supabase primeiro
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        subscribers = data;
        console.log('Subscribers carregados do Supabase:', subscribers.length);
      }
    } catch (supabaseError) {
      console.error('Erro ao buscar do Supabase:', supabaseError);
    }

    // Se não houver dados no Supabase, buscar do arquivo JSON
    if (subscribers.length === 0) {
      try {
        subscribers = await getAllSubscribers();
        console.log('Subscribers carregados do arquivo JSON:', subscribers.length);
      } catch (fileError) {
        console.error('Erro ao buscar do arquivo:', fileError);
      }
    }

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error('Erro ao buscar subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar subscribers',
    });
  }
}
