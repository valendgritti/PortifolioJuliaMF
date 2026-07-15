# Portfólio de cinema — Julia Marques Figueiroa

Primeira versão de um portfólio artístico para apresentar os trabalhos audiovisuais
de uma estudante de cinema. O projeto também foi pensado como uma introdução prática
a desenvolvimento web.

## Tecnologias

- HTML: estrutura e conteúdo da página;
- CSS: cores, tipografia, layout, responsividade e animações;
- JavaScript: menu mobile, animações de entrada e atualização automática do ano.

## Como visualizar

Abra o arquivo `index.html` no navegador. Para uma experiência melhor durante o
desenvolvimento, também é possível usar a extensão **Live Server** do VS Code.

## Estrutura do projeto

```text
PortifolioJu/
├── projetos/    # páginas com os detalhes de cada projeto
├── index.html   # conteúdo e estrutura
├── styles.css   # aparência do site
├── script.js    # interações
└── README.md    # documentação
```

## Próximos passos

1. Adicionar imagens e frames autorizados dos projetos.
2. Atualizar nomes, anos, funções e links de cada trabalho.
3. Substituir os conteúdos provisórios das páginas individuais.

Os trabalhos estão separados nas categorias **Produção**, **Fotografia**, **Edição**
e **Diversos**. Para classificar um novo projeto, use o atributo `data-category` no
elemento `<article>` correspondente.

As classes visuais descrevem a categoria, em vez da posição: use
`project-image--producao`, `project-image--fotografia`, `project-image--edicao` ou
`project-image--diversos`. Assim, inserir um cartão no meio da lista não exige
renomear as classes seguintes.

### Subcategorias

Fotografia e Diversos possuem um segundo filtro. Para classificar um trabalho,
adicione `data-subcategory` ao mesmo `<article>` que já contém `data-category`:

```html
<article
  class="project reveal"
  data-category="fotografia"
  data-subcategory="foto-still"
>
```

Valores aceitos em Fotografia: `direcao-foto`, `foto-still` e
`fotografia-digital`. Em Diversos: `direcao`, `direcao-som` e `roteiros`. Trabalhos
sem `data-subcategory` continuam aparecendo ao selecionar **Todos** na categoria.

Cada botão **Conhecer projeto** aponta para um arquivo dentro da pasta `projetos`.
Essas páginas reutilizam `styles.css` e `script.js`, mantendo a aparência e as
interações centralizadas nos mesmos arquivos.

A navegação **Próximo projeto** também é automática: o JavaScript lê a ordem dos
cartões em `index.html` e usa o título do próximo link único. Para que essa leitura
funcione, visualize o projeto por um servidor local, como o Live Server, e dê a cada
trabalho seu próprio arquivo HTML.

## Como adicionar mais de um projeto à mesma categoria

As categorias funcionam como filtros e podem ser repetidas. Cada trabalho é um
`<article>` independente. Para incluir outro projeto de produção:

1. Duplique um cartão com `data-category="producao"` em `index.html`.
2. Altere título, ano, resumo, número e imagem do novo cartão.
3. Duplique uma página da pasta `projetos` e dê a ela o nome do trabalho, como
   `meu-curta.html`.
4. No cartão, use `href="projetos/meu-curta.html"`.

Os filtros mostram apenas as categorias. A numeração individual de cada projeto
aparece sobre sua imagem. As outras categorias disponíveis são `fotografia`,
`edicao` e `diversos`.

As páginas de **Direção de foto** reutilizam o layout narrativo de Produção. As
páginas de **Foto still** de Canto V e Polvo Livre e a página de **Fotografia
digital** usam mosaicos fluidos que preservam a proporção natural de cada arquivo.
Para adicionar uma foto digital, duplique um elemento
`<figure class="digital-frame">` e altere o caminho da imagem.

As páginas de **Edição** também reutilizam o layout narrativo e possuem o campo
`Programa de edição` na ficha inicial para registrar o software utilizado.

Em **Diversos**, Direção e Direção de som permanecem no modelo narrativo. As páginas
de **Roteiro** usam um layout editorial focado em logline, sinopse, processo de
escrita e trecho selecionado, com apenas uma capa vertical na proporção A4.

Os projetos **Poison** e **Giants** usam uma versão compacta para vídeos de Instagram,
com uma única imagem vertical em `9:16`, descrição curta e informações essenciais.

As galerias still usam mosaicos, com destaques em largura total e imagens fluindo em
colunas. Elas preservam a proporção `4:3` nas fotos horizontais e `3:4` nas verticais.
Canto V possui cinco horizontais e três verticais; Polvo Livre possui nove
horizontais; e a página conjunta separa duas fotos de O Que Restou de Lá e uma de
A Máquina do Dr. Reiner.

A numeração dos cartões é definida automaticamente pelo JavaScript conforme a ordem
dos elementos `<article>` em `index.html`. Ao inserir um projeto no meio da lista,
os números seguintes são atualizados sem alterações manuais.

> Os trechos provisórios estão identificados visualmente no site para evitar que
> sejam confundidos com informações definitivas.
