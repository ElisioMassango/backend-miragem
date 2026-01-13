# Setup Rápido - Backend Miragem Newsletter

## 1. Instalar Dependências

```bash
cd backend
npm install
```

## 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas informações:

```env
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua_chave_anonima
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
EMAIL_FROM=Miragem <noreply@miragem.com>
FRONTEND_URL=http://localhost:5173
```

## 3. Configurar Supabase

1. Acesse o Supabase SQL Editor
2. Execute o arquivo `supabase-schema.sql` para criar a tabela `subscribers`

## 4. Configurar Email (Gmail)

Para usar Gmail, você precisa criar uma "App Password":

1. Acesse: https://myaccount.google.com/security
2. Ative a "Verificação em duas etapas" (se ainda não estiver ativada)
3. Vá em "Senhas de app"
4. Crie uma nova senha de app para "Email"
5. Use essa senha no campo `SMTP_PASS` do `.env`

## 5. Executar o Servidor

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3001`

## 6. Testar a API

### Health Check
```bash
curl http://localhost:3001/health
```

### Inscrever
```bash
curl -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "whatsapp": "+351 912 345 678"
  }'
```

### Listar Subscribers
```bash
curl http://localhost:3001/api/subscribers
```

## Estrutura de Dados

Os dados são salvos em dois lugares:

1. **Supabase** - Banco de dados na nuvem
2. **Arquivo JSON** - `backend/data/subscribers.json` (backup local)

## Troubleshooting

### Erro de conexão com Supabase
- Verifique se as credenciais estão corretas no `.env`
- Certifique-se de que a tabela foi criada corretamente

### Erro ao enviar email
- Verifique se a "Senha de app" do Gmail está correta
- Certifique-se de que a verificação em duas etapas está ativada
- Teste com outro provedor SMTP se necessário

### CORS Error
- Verifique se `FRONTEND_URL` no `.env` está correto
- Certifique-se de que o frontend está rodando na URL especificada
