#!/usr/bin/env bash
set -euo pipefail

MSG="${1:-Atualiza dashboard}"

cd "$(dirname "$0")/.."

if ! command -v git >/dev/null 2>&1; then
  echo "ERRO: git não encontrado. Instale git antes de continuar."
  exit 1
fi

if [ ! -d .git ]; then
  git init
  git branch -M main
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/yuricore/meta-ads-dashboard-fase2.git
fi

git add index.html vercel.json README_AUTOMACAO.md scripts/deploy.sh

if git diff --cached --quiet; then
  echo "Nada novo para publicar."
  exit 0
fi

git commit -m "$MSG"
git push -u origin main

echo "Deploy enviado para GitHub. A Vercel deve publicar automaticamente se o projeto estiver conectado."
