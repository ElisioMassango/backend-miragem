import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { supabase, Subscriber } from '../src/config/supabase.js';
import { sendWelcomeEmail } from '../src/config/email.js';
import { saveSubscriber } from '../src/utils/fileStorage.js';

const subscribeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().optional(),
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido',
    });
  }

  try {
    // Validar dados
    const validatedData = subscribeSchema.parse(req.body);
    
    const subscriber: Subscriber = {
      name: validatedData.name,
      email: validatedData.email,
      whatsapp: validatedData.whatsapp || '',
    };

    // Salvar no Supabase
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .insert([subscriber])
        .select()
        .single();

      if (error && error.code !== '23505') { // 23505 = duplicate key
        console.error('Erro ao salvar no Supabase:', error);
      } else if (data) {
        console.log('Subscriber salvo no Supabase:', data);
      }
    } catch (supabaseError) {
      console.error('Erro na conexão com Supabase:', supabaseError);
      // Continuar mesmo se Supabase falhar
    }

    // Salvar no arquivo JSON (pode não funcionar na Vercel, mas tentamos)
    try {
      await saveSubscriber(subscriber);
    } catch (fileError) {
      console.error('Erro ao salvar em arquivo:', fileError);
      // Continuar mesmo se arquivo falhar
    }

    // Enviar email de boas-vindas
    try {
      await sendWelcomeEmail(subscriber.email, subscriber.name);
    } catch (emailError) {
      console.error('Erro ao enviar email:', emailError);
      // Não falhar a requisição se o email falhar
    }

    res.status(200).json({
      success: true,
      message: 'Inscrição realizada com sucesso',
      data: subscriber,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors,
      });
    }

    console.error('Erro ao processar inscrição:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar inscrição',
    });
  }
}
