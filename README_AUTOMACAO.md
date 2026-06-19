# Automação do Dashboard Meta Ads na Vercel

Objetivo: transformar o dashboard em um fluxo automático.

## Resultado esperado

Depois de configurado uma vez:

1. Ana gera ou atualiza o dashboard HTML.
2. O arquivo `index.html` é atualizado.
3. Um comando faz commit e push para o GitHub.
4. A Vercel detecta o push automaticamente.
5. O link público é atualizado sozinho.

Repositório:

```text
https://github.com/yuricore/meta-ads-dashboard-fase2
```

---

# Fluxo recomendado

## 1. GitHub

O repositório precisa conter:

```text
index.html
vercel.json
README_AUTOMACAO.md
scripts/deploy.sh
```

## 2. Vercel

Na Vercel, importar o repositório GitHub:

```text
yuricore/meta-ads-dashboard-fase2
```

Configuração:

```text
Framework Preset: Other
Build Command: vazio
Output Directory: vazio
Install Command: vazio
```

Depois disso, todo push na branch `main` publica automaticamente.

---

# Como atualizar o dashboard depois

Dentro da pasta:

```bash
cd /home/ana/.openclaw/workspace/vercel-meta-ads-dashboard
./scripts/deploy.sh "Atualiza dashboard bruto de escala"
```

O script faz:

```bash
git add index.html vercel.json README_AUTOMACAO.md scripts/deploy.sh
git commit -m "mensagem"
git push origin main
```

---

# Primeiro setup local

Se ainda não foi conectado ao GitHub:

```bash
cd /home/ana/.openclaw/workspace/vercel-meta-ads-dashboard
git init
git branch -M main
git remote add origin https://github.com/yuricore/meta-ads-dashboard-fase2.git
git add index.html vercel.json README_AUTOMACAO.md scripts/deploy.sh
git commit -m "Initial dashboard deploy"
git push -u origin main
```

Se pedir autenticação, usar login do GitHub/token no terminal seguro, nunca enviar token no chat.

---

# Alternativa ainda mais automática

Instalar e autenticar:

```bash
sudo apt update
sudo apt install gh
npm i -g vercel

gh auth login
vercel login
```

Depois podemos automatizar também:

```bash
vercel --prod
```

Mas o caminho mais estável é GitHub conectado à Vercel.
