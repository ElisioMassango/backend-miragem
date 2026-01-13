# Miragem Newsletter Backend

Backend TypeScript para gerenciar inscrições na newsletter da Miragem.

## Funcionalidades

- ✅ Receber inscrições via API
- ✅ Enviar emails de boas-vindas com template luxuoso
- ✅ Salvar dados no Supabase
- ✅ Salvar dados em arquivo JSON local
- ✅ Listar todos os subscribers

## Instalação

```bash
cd backend
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente no arquivo `.env`:

```env
# Server
PORT=3001

# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
EMAIL_FROM=Miragem <noreply@miragem.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Configuração do Supabase

1. Crie uma tabela `subscribers` no Supabase:

```sql
CREATE TABLE subscribers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  whatsapp VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Configuração do Email (Gmail)

Para usar Gmail, você precisa criar uma "App Password":

1. Acesse sua conta Google
2. Vá em Segurança > Verificação em duas etapas
3. Crie uma "Senha de app"
4. Use essa senha no `SMTP_PASS`

## Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## Endpoints

### POST /api/subscribe
Inscrever na newsletter

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "whatsapp": "+351 912 345 678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inscrição realizada com sucesso",
  "data": {
    "name": "João Silva",
    "email": "joao@example.com",
    "whatsapp": "+351 912 345 678"
  }
}
```

### GET /api/subscribers
Listar todos os subscribers

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "whatsapp": "+351 912 345 678",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET /health
Health check do servidor

## Estrutura de Arquivos

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.ts    # Configuração do Supabase
│   │   └── email.ts        # Configuração e template de email
│   ├── routes/
│   │   └── subscribers.ts  # Rotas da API
│   ├── utils/
│   │   └── fileStorage.ts # Gerenciamento de arquivo JSON
│   └── server.ts          # Servidor principal
├── data/
│   └── subscribers.json   # Arquivo JSON (gerado automaticamente)
├── package.json
├── tsconfig.json
└── .env
```
