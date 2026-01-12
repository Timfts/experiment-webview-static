# GitHub Pages Deployment Guide

## 📋 Passos para configurar:

### 1. **Ajustar configuração**
Edite o arquivo `astro.config.mjs` e substitua `USERNAME` pelo seu nome de usuário do GitHub:

```js
site: 'https://SEU-USUARIO.github.io',
base: '/stellar-spiral',
```

### 2. **Ativar GitHub Pages**
1. Vá para o repositório no GitHub
2. Acesse **Settings** → **Pages**
3. Em **Source**, selecione **GitHub Actions**

### 3. **Deploy automático**
O deploy acontece automaticamente quando você fizer push para a branch `main`.

### 4. **Acesso**
Após o deploy, seu site estará disponível em:
`https://SEU-USUARIO.github.io/stellar-spiral`

## 🔄 Status do deploy
Você pode acompanhar o status na aba **Actions** do seu repositório.

## ⚙️ Configurações incluídas:
- ✅ Build automático com Astro
- ✅ Deploy para GitHub Pages
- ✅ Configuração para SPAs
- ✅ Cache de dependências Node.js
- ✅ Suporte a React + React Query