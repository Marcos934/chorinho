# CHORINHO - Formatador de CHORE para runrun.it

## O que é o CHORINHO?

O **CHORINHO** é uma extensão de navegador (userscript) projetada para facilitar e padronizar a criação de documentação de tarefas (CHOREs) na plataforma [runrun.it](https://runrun.it/). Com ele, você pode gerar rapidamente um texto em formato Markdown com todas as informações relevantes da sua tarefa, economizando tempo e garantindo a consistência da documentação.

## Funcionalidades

*   **Painel flutuante:** Um painel lateral que pode ser aberto em qualquer página do runrun.it.
*   **Preenchimento automático:** Extrai automaticamente o número e o título da tarefa da página do runrun.it.
*   **Geração de branch:** Gera um nome de branch padronizado com base no número e título da tarefa.
*   **Formulário customizável:** Um formulário com campos para todas as informações necessárias para a documentação da CHORE.
*   **Desabilitação inteligente do formulário:** O formulário é automaticamente desabilitado se nenhuma tarefa estiver aberta no runrun.it, exibindo uma mensagem informativa. O histórico permanece acessível.
*   **Histórico de CHORINHOs:** Salva todas as CHOREs geradas no seu navegador, permitindo que você as acesse e reutilize facilmente.
*   **Busca no histórico:** Permite buscar por CHOREs salvas pelo número ou título da tarefa.
*   **Configuração de campos:** Permite que você escolha quais campos deseja exibir no formulário e no Markdown final.
*   **Exportação e importação:** Permite exportar e importar seu histórico de CHOREs em formato JSON.
*   **Alerta de campos ocultos:** Avisa se um CHORINHO salvo tem informações em campos que estão atualmente ocultos na sua configuração.
*   **Nomenclatura aprimorada para download:** Ao baixar o arquivo `.md`, o nome é formatado como `{Número da Task} - {Título da Task}.md`, com o título sanitizado para evitar caracteres inválidos.

## Como Instalar

Para usar o CHORINHO, você precisa primeiro de um gerenciador de userscripts, como o **Tampermonkey**.

### Passo 1: Instalar o Tampermonkey

Instale o Tampermonkey no seu navegador de preferência:

*   [Google Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
*   [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
*   [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
*   [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Passo 2: Instalar o CHORINHO

1.  Clique no ícone do Tampermonkey no seu navegador e selecione **"Painel de Controle"**.
2.  Vá para a aba **"Utilitários"**.
3.  Em **"Instalar a partir da URL"**, copie e cole a URL do arquivo `chorinho.user.js` e clique em **"Instalar"**.
4.  Uma nova aba será aberta com os detalhes do script. Clique em **"Instalar"** novamente.

## Como Usar

Após a instalação, o ícone do CHORINHO aparecerá no canto inferior direito de qualquer página do runrun.it.

### Abrindo o Painel

Clique no ícone do CHORINHO para abrir o painel lateral. O painel possui três abas principais: **Formulário**, **Histórico** e **Configurações**.

### Aba "Formulário"

Esta é a aba principal, onde você irá criar a documentação da sua CHORE.

*   **Task:** O número e o título da tarefa são preenchidos automaticamente se você estiver na página de uma tarefa no runrun.it. Caso nenhuma tarefa esteja aberta, o formulário será desabilitado, mas você ainda poderá acessar o histórico.
*   **Sistema:** O sistema ou projeto ao qual a tarefa pertence. Ex: Sistema XYZ
*   **Merge Request:** O link para o Merge Request (MR) da tarefa.
*   **Branch:** O nome da branch da tarefa, gerado automaticamente. Você pode copiar o nome da branch clicando no botão **"Copiar"**.
*   **Objetivo:** O objetivo da tarefa.
*   **Plano de Ação:** Os planos de ação relacionados à tarefa. Você pode adicionar ou remover planos de ação conforme necessário.
*   **Solução Implementada:** A descrição da solução que foi implementada.
*   **Modificações:** As modificações que foram feitas no código.
*   **Fluxo de teste na UI:** O fluxo de teste a ser seguido na interface do usuário.
*   **Navegação na UI:** A navegação a ser seguida na interface do usuário.
*   **Comandos para testes BANCO DE DADOS:** Comandos de banco de dados a serem executados para teste.
*   **Problemas encontrados:** Quaisquer problemas ou impedimentos encontrados durante a execução da tarefa.
*   **Observações/Notas:** Qualquer observação ou nota adicional.

No final do formulário, você encontrará os seguintes botões:

*   **Salvar:** Salva o CHORINHO atual no seu histórico.
*   **Copiar Markdown:** Copia o Markdown gerado para a sua área de transferência.
*   **Baixar .md:** Baixa um arquivo `.md` com o conteúdo do CHORINHO.

### Aba "Histórico"

Nesta aba, você pode ver todas as CHOREs que você salvou.

*   **Busca:** Você pode buscar por uma CHORE específica digitando o número ou o título da tarefa.
*   **Abrir Chorinho:** Abre o CHORINHO selecionado no formulário para edição.
*   **Acessar Task:** Abre a página da tarefa no runrun.it em uma nova aba.
*   **Excluir:** Exclui o CHORINHO do seu histórico.
*   **Exportar JSON:** Exporta todo o seu histórico de CHOREs para um arquivo JSON.
*   **Importar JSON:** Importa um histórico de CHOREs de um arquivo JSON.

### Aba "Configurações"

Nesta aba, você pode personalizar quais campos do formulário são exibidos. Basta marcar ou desmarcar os campos que você deseja ver e clicar em **"Salvar Configurações"**.