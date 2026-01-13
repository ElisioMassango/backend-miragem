import { promises as fs } from 'fs';
import path from 'path';
import { Subscriber } from '../config/supabase.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

// Garantir que o diretório existe
export const ensureDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Erro ao criar diretório data:', error);
  }
};

// Ler subscribers do arquivo JSON
export const readSubscribers = async (): Promise<Subscriber[]> => {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existe, retornar array vazio
    return [];
  }
};

// Salvar subscriber no arquivo JSON
export const saveSubscriber = async (subscriber: Subscriber): Promise<void> => {
  try {
    await ensureDataDir();
    const subscribers = await readSubscribers();
    
    // Verificar se já existe
    const exists = subscribers.some(s => s.email === subscriber.email);
    if (exists) {
      console.log(`Subscriber já existe: ${subscriber.email}`);
      return;
    }
    
    subscribers.push({
      ...subscriber,
      id: subscribers.length + 1,
      created_at: new Date().toISOString(),
    });
    
    await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), 'utf-8');
    console.log(`Subscriber salvo em JSON: ${subscriber.email}`);
  } catch (error) {
    console.error('Erro ao salvar subscriber em JSON:', error);
    throw error;
  }
};

// Obter todos os subscribers
export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  return await readSubscribers();
};
