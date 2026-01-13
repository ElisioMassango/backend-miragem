# Deploy na Vercel - Backend Miragem

## Passos para Deploy

### 1. Instalar Vercel CLI (se ainda não tiver)
```bash
npm i -g vercel
```

### 2. Fazer Login na Vercel
```bash
vercel login
```

### 3. Deploy
```bash
cd backend-miragem
vercel
```

Ou faça o deploy através do GitHub:
1. Conecte seu repositório na Vercel
2. Configure o projeto:
   - **Framework Preset**: Other
   - **Root Directory**: `backend-miragem`
   - **Build Command**: (deixe vazio ou `npm run build`)
   - **Output Directory**: (deixe vazio)

### 4. Configurar Variáveis de Ambiente

Na dashboard da Vercel, vá em **Settings > Environment Variables** e adicione:

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
EMAIL_FROM=Miragem <noreply@miragem.com>
FRONTEND_URL=https://seu-frontend.vercel.app
```

### 5. Estrutura de Arquivos

A Vercel reconhece automaticamente a pasta `api/` e cria serverless functions:

```
backend-miragem/
├── api/
│   ├── subscribe.ts      # POST /api/subscribe
│   ├── subscribers.ts    # GET /api/subscribers
│   └── health.ts         # GET /health
├── src/
│   ├── config/
│   │   ├── email.ts
│   │   └── supabase.ts
│   └── utils/
│       └── fileStorage.ts
├── vercel.json
└── package.json
```

### 6. URLs das APIs

Após o deploy, suas APIs estarão disponíveis em:

- `https://backend-miragem.vercel.app/api/subscribe` (POST)
- `https://backend-miragem.vercel.app/api/subscribers` (GET)
- `https://backend-miragem.vercel.app/health` (GET)

### 7. Atualizar Frontend

Certifique-se de que o frontend está usando a URL correta:

```typescript
const response = await fetch('https://backend-miragem.vercel.app/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    whatsapp: formData.whatsapp || undefined,
  }),
});
```

### 8. Testar

Após o deploy, teste as rotas:

```bash
# Health check
curl https://backend-miragem.vercel.app/health

# Inscrever
curl -X POST https://backend-miragem.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "whatsapp": "+351 912 345 678"
  }'

# Listar subscribers
curl https://backend-miragem.vercel.app/api/subscribers
```

## Notas Importantes

1. **Arquivo JSON**: O salvamento em arquivo JSON pode não funcionar na Vercel (serverless functions são stateless). O Supabase é a fonte principal de dados.

2. **CORS**: As rotas já estão configuradas com CORS para aceitar requisições do frontend.

3. **Timeout**: Serverless functions da Vercel têm timeout de 10 segundos no plano gratuito. Se o envio de email demorar muito, considere usar uma queue.

4. **Logs**: Acesse os logs na dashboard da Vercel em **Deployments > [seu deployment] > Functions**.

## Troubleshooting

### Erro 500
- Verifique as variáveis de ambiente na Vercel
- Verifique os logs na dashboard
- Certifique-se de que o Supabase está configurado corretamente

### CORS Error
- Verifique se `FRONTEND_URL` está correto
- As rotas já têm CORS configurado, mas você pode ajustar em cada arquivo `api/*.ts`

### Email não enviando
- Verifique as credenciais SMTP
- Verifique os logs para ver erros específicos
- Certifique-se de que a "App Password" do Gmail está correta
