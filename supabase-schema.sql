-- Criar tabela de subscribers no Supabase
CREATE TABLE IF NOT EXISTS subscribers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice no email para melhor performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- Criar índice na data de criação
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at DESC);

-- Comentários nas colunas
COMMENT ON TABLE subscribers IS 'Tabela de inscritos na newsletter da Miragem';
COMMENT ON COLUMN subscribers.name IS 'Nome completo do subscriber';
COMMENT ON COLUMN subscribers.email IS 'Email único do subscriber';
COMMENT ON COLUMN subscribers.whatsapp IS 'Número de WhatsApp (opcional)';
COMMENT ON COLUMN subscribers.created_at IS 'Data e hora da inscrição';
