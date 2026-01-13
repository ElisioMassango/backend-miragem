import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase, Subscriber } from '../config/supabase.js';
import { sendWelcomeEmail } from '../config/email.js';
import { saveSubscriber, getAllSubscribers } from '../utils/fileStorage.js';

const router = Router();

// Schema de validação
const subscribeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z.string().optional(),
});

// POST /subscribe - Inscrever na newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
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

    // Salvar no arquivo JSON
    /*
    try {
      await saveSubscriber(subscriber);
    } catch (fileError) {
      console.error('Erro ao salvar em arquivo:', fileError);
      // Continuar mesmo se arquivo falhar
    }
    */

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
});

// GET /subscribers - Listar todos os subscribers
router.get('/subscribers', async (req: Request, res: Response) => {
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
});

export default router;
