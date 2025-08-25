#!/bin/bash

echo "📦 Preparando arquivos para deploy..."
echo "______________________________________"

mkdir -p deploy

cp -r assets/ css/ data/ images/ js/ pages/ index.html deploy/

echo "Build concluído!"
echo "Arquivos copiados para: $(pwd)/deploy"
echo "Total de arquivos: $(find deploy -type f | wc -l)"
echo ""
echo "Próximo passo: Fazer upload para o servidor"
