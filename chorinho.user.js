// ==UserScript==
// @name         CHORINHO - Formatador de CHORE para runrun.it
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Extensão para formatar CHORE de tasks em Markdown no runrun.it
// @author       Your Name
// @match        https://runrun.it/pt-BR/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== ESTILOS ====================
    const styles = `
        .chorinho-float-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            font-size: 24px;
            color: white;
        }

        .chorinho-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .chorinho-panel {
            position: fixed;
            top: 0;
            right: -600px;
            width: 600px;
            height: 100vh;
            background: white;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
            z-index: 9999999;
            transition: right 0.3s ease;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .chorinho-panel.open {
            right: 0;
        }

        .chorinho-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .chorinho-header h2 {
            margin: 0;
            font-size: 24px;
        }

        .chorinho-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .chorinho-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .chorinho-content {
            padding: 20px;
        }

        .chorinho-section {
            margin-bottom: 20px;
        }

        .chorinho-section label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
            font-size: 14px;
        }

        .chorinho-input,
        .chorinho-textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .chorinho-input:focus,
        .chorinho-textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .chorinho-textarea {
            min-height: 80px;
            resize: vertical;
            font-family: 'Courier New', monospace;
        }

        .chorinho-checkbox-group {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
        }

        .chorinho-checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .chorinho-checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        .chorinho-checkbox-item label {
            margin: 0;
            font-weight: normal;
            cursor: pointer;
        }

        .chorinho-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-right: 10px;
            margin-bottom: 10px;
        }

        .chorinho-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .chorinho-btn-secondary {
            background: #6c757d;
        }

        .chorinho-btn-success {
            background: #28a745;
        }

        .chorinho-btn-danger {
            background: #dc3545;
        }

        .chorinho-btn-small {
            padding: 6px 12px;
            font-size: 12px;
        }

        .chorinho-issues-container {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }

        .chorinho-issue-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }

        .chorinho-issue-item input {
            flex: 1;
        }

        .chorinho-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
        }

        .chorinho-tab {
            padding: 10px 20px;
            background: none;
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            color: #666;
            transition: all 0.2s;
        }

        .chorinho-tab.active {
            color: #667eea;
            border-bottom-color: #667eea;
        }

        .chorinho-tab-content {
            display: none;
        }

        .chorinho-tab-content.active {
            display: block;
        }

        .chorinho-history-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 10px;
            border-left: 4px solid #667eea;
        }

        .chorinho-history-item h4 {
            margin: 0 0 10px 0;
            color: #333;
        }

        .chorinho-history-item p {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 12px;
        }

        .chorinho-preview {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
            max-height: 500px;
            overflow-y: auto;
        }

        .chorinho-preview h2 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
            margin-top: 20px;
        }

        .chorinho-preview h2:first-child {
            margin-top: 0;
        }

        .chorinho-alert {
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .chorinho-alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .chorinho-alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .chorinho-badge {
            display: inline-block;
            padding: 4px 8px;
            background: #667eea;
            color: white;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
        }
    `;

    // ==================== UTILITÁRIOS ====================
    const Utils = {
        // Remove acentos e caracteres especiais
        slugify(text) {
            return text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .toLowerCase();
        },

        // Extrai número da task
        extractTaskNumber() {
            try {
                const selector = "#task-show-modal > div > div > div > div.sc-FMLfs.lfqNlo > div.sc-dMmxNm.iVpVKn > div > div.sc-iyGwaJ.iLLVTt > div:nth-child(2) > div.sc-kzGZOW.sc-OSwEw.fEAbVr.fZkMcP";
                const element = document.querySelector(selector);
                if (element) {
                    const text = element.innerText;
                    const match = text.match(/#(\d+)/);
                    return match ? match[1] : '';
                }
            } catch (e) {
                console.error('Erro ao extrair número da task:', e);
            }
            return '';
        },

        // Extrai título da task
        extractTaskTitle() {
            try {
                const selector = "#task-show-modal > div > div > div > div.sc-FMLfs.lfqNlo > div.sc-dMmxNm.iVpVKn > div > div.sc-iyGwaJ.iLLVTt > div:nth-child(2) > div.sc-loWDTB.dNyYie > div > span > div > span";
                const element = document.querySelector(selector);
                return element ? element.innerText.trim() : '';
            } catch (e) {
                console.error('Erro ao extrair título da task:', e);
            }
            return '';
        },

        // Verifica se modal está aberto
        isTaskModalOpen() {
            return document.querySelector("#modal-container") !== null;
        },

        // Gera nome de branch
        generateBranchName(number, title) {
            const slugTitle = this.slugify(title);
            return `Feature-${number}-${slugTitle}`;
        },

        // Copia para clipboard
        copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        },

        // Download arquivo
        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        },

        // Formata data
        formatDate(date) {
            return new Date(date).toLocaleString('pt-BR');
        }
    };

    // ==================== STORAGE ====================
    const Storage = {
        KEYS: {
            CHORINHOS: 'chorinho_saved',
            CONFIG: 'chorinho_config',
            CURRENT: 'chorinho_current'
        },

        get(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                console.error('Erro ao ler do storage:', e);
                return null;
            }
        },

        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Erro ao salvar no storage:', e);
                return false;
            }
        },

        getSavedChorinhos() {
            return this.get(this.KEYS.CHORINHOS) || [];
        },

        saveChorinho(chorinho) {
            const chorinhos = this.getSavedChorinhos();
            chorinho.id = chorinho.id || Date.now().toString();
            chorinho.savedAt = new Date().toISOString();
            
            const existingIndex = chorinhos.findIndex(c => c.id === chorinho.id);
            if (existingIndex >= 0) {
                chorinhos[existingIndex] = chorinho;
            } else {
                chorinhos.unshift(chorinho);
            }
            
            return this.set(this.KEYS.CHORINHOS, chorinhos);
        },

        deleteChorinho(id) {
            const chorinhos = this.getSavedChorinhos();
            const filtered = chorinhos.filter(c => c.id !== id);
            return this.set(this.KEYS.CHORINHOS, filtered);
        },

        getConfig() {
            return this.get(this.KEYS.CONFIG) || {
                fields: {
                    sistema: true,
                    mr: true,
                    branch: true,
                    descricao: true,
                    solucao: true,
                    modificacoes: true,
                    fluxo: true,
                    comandos: true,
                    observacoes: true
                }
            };
        },

        saveConfig(config) {
            return this.set(this.KEYS.CONFIG, config);
        },

        getCurrentData() {
            return this.get(this.KEYS.CURRENT) || {};
        },

        saveCurrentData(data) {
            return this.set(this.KEYS.CURRENT, data);
        }
    };

    // ==================== TEMPLATE ====================
    const TemplateGenerator = {
        generate(data, config) {
            let template = '';

            if (config.fields.sistema) {
                template += `## Sistema: ${data.sistema || ''}\n\n`;
            }

            if (config.fields.mr) {
                template += `## MR:\n`;
                if (config.fields.branch) {
                    template += `Branch: ${data.branch || ''}\n`;
                }
            }

            if (config.fields.descricao) {
                template += `## Descrição:\n`;
                template += `Objetivo: ${data.objetivo || ''}\n`;
                if (data.issues && data.issues.length > 0) {
                    data.issues.forEach((issue, index) => {
                        template += `Issue ${index + 1}: ${issue || '?'}\n`;
                    });
                }
                template += `\n`;
            }

            if (config.fields.solucao) {
                template += `## Solução Implementada:\n${data.solucao || ''}\n\n`;
            }

            if (config.fields.modificacoes) {
                template += `## Modificações:\n${data.modificacoes || ''}\n\n`;
            }

            if (config.fields.fluxo) {
                template += `## Fluxo de teste na UI:\n${data.fluxo || ''}\n\n`;
            }

            template += `## Navegação na UI\n`;

            if (config.fields.comandos) {
                template += `## Comandos para testes BANCO DE DADOS:\n${data.comandos || ''}\n\n`;
            }

            if (config.fields.observacoes) {
                template += `## Observações/Notas\n${data.observacoes || ''}\n`;
            }

            return template;
        }
    };

    // ==================== UI ====================
    class ChorinhoUI {
        constructor() {
            this.isOpen = false;
            this.currentTab = 'form';
            this.currentChorinho = null;
            this.init();
        }

        init() {
            this.injectStyles();
            this.createFloatButton();
            this.createPanel();
            this.setupEventListeners();
            this.checkModalState();
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        createFloatButton() {
            const btn = document.createElement('button');
            btn.className = 'chorinho-float-btn';
            btn.innerHTML = '🎵';
            btn.title = 'Abrir CHORINHO';
            btn.onclick = () => this.togglePanel();
            document.body.appendChild(btn);
            this.floatBtn = btn;
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.className = 'chorinho-panel';
            panel.innerHTML = `
                <div class="chorinho-header">
                    <h2>🎵 CHORINHO</h2>
                    <button class="chorinho-close">×</button>
                </div>
                <div class="chorinho-content">
                    <div class="chorinho-tabs">
                        <button class="chorinho-tab active" data-tab="form">Formulário</button>
                        <button class="chorinho-tab" data-tab="history">Histórico</button>
                        <button class="chorinho-tab" data-tab="config">Configurações</button>
                    </div>
                    
                    <!-- Formulário -->
                    <div class="chorinho-tab-content active" data-content="form">
                        <div id="chorinho-alert-container"></div>
                        
                        <div class="chorinho-section">
                            <label>Número da Task</label>
                            <input type="text" class="chorinho-input" id="chorinho-task-number" readonly>
                        </div>

                        <div class="chorinho-section">
                            <label>Título da Task</label>
                            <input type="text" class="chorinho-input" id="chorinho-task-title" readonly>
                        </div>

                        <div class="chorinho-section">
                            <label>Sistema</label>
                            <input type="text" class="chorinho-input" id="chorinho-sistema" placeholder="Ex: Via Ponto">
                        </div>

                        <div class="chorinho-section">
                            <label>Branch</label>
                            <input type="text" class="chorinho-input" id="chorinho-branch" readonly>
                        </div>

                        <div class="chorinho-section">
                            <label>Objetivo</label>
                            <textarea class="chorinho-textarea" id="chorinho-objetivo"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <label>Issues</label>
                            <div class="chorinho-issues-container" id="chorinho-issues-container">
                                <div class="chorinho-issue-item">
                                    <input type="text" class="chorinho-input" placeholder="Issue 1" data-issue-index="0">
                                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removeIssue(0)">×</button>
                                </div>
                            </div>
                            <button class="chorinho-btn chorinho-btn-small chorinho-btn-success" onclick="chorinhoApp.addIssue()">+ Adicionar Issue</button>
                        </div>

                        <div class="chorinho-section">
                            <label>Solução Implementada</label>
                            <textarea class="chorinho-textarea" id="chorinho-solucao"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <label>Modificações</label>
                            <textarea class="chorinho-textarea" id="chorinho-modificacoes"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <label>Fluxo de teste na UI</label>
                            <textarea class="chorinho-textarea" id="chorinho-fluxo"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <label>Comandos para testes BANCO DE DADOS</label>
                            <textarea class="chorinho-textarea" id="chorinho-comandos"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <label>Observações/Notas</label>
                            <textarea class="chorinho-textarea" id="chorinho-observacoes"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveCurrentChorinho()">💾 Salvar CHORINHO</button>
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.copyMarkdown()">📋 Copiar Markdown</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.showPreview()">👁️ Preview</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.downloadMarkdown()">⬇️ Baixar .md</button>
                        </div>

                        <div id="chorinho-preview-container" style="display: none;">
                            <h3>Preview do Markdown</h3>
                            <div class="chorinho-preview" id="chorinho-preview"></div>
                        </div>
                    </div>

                    <!-- Histórico -->
                    <div class="chorinho-tab-content" data-content="history">
                        <div id="chorinho-history-list"></div>
                        <div class="chorinho-section">
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.exportChorinhos()">📤 Exportar JSON</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.importChorinhos()">📥 Importar JSON</button>
                            <input type="file" id="chorinho-import-file" accept=".json" style="display: none;">
                        </div>
                    </div>

                    <!-- Configurações -->
                    <div class="chorinho-tab-content" data-content="config">
                        <div class="chorinho-section">
                            <label>Campos Visíveis no Template</label>
                            <div class="chorinho-checkbox-group">
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-sistema" checked>
                                    <label for="config-sistema">Sistema</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-mr" checked>
                                    <label for="config-mr">MR</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-branch" checked>
                                    <label for="config-branch">Branch</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-descricao" checked>
                                    <label for="config-descricao">Descrição</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-solucao" checked>
                                    <label for="config-solucao">Solução Implementada</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-modificacoes" checked>
                                    <label for="config-modificacoes">Modificações</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-fluxo" checked>
                                    <label for="config-fluxo">Fluxo de teste</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-comandos" checked>
                                    <label for="config-comandos">Comandos BD</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-observacoes" checked>
                                    <label for="config-observacoes">Observações</label>
                                </div>
                            </div>
                        </div>
                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveConfig()">💾 Salvar Configurações</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
        }

        setupEventListeners() {
            // Fechar painel
            this.panel.querySelector('.chorinho-close').onclick = () => this.closePanel();

            // Tabs
            this.panel.querySelectorAll('.chorinho-tab').forEach(tab => {
                tab.onclick = () => this.switchTab(tab.dataset.tab);
            });

            // Auto-save current data
            this.panel.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('change', () => this.autoSaveCurrentData());
            });

            // Import file
            document.getElementById('chorinho-import-file').addEventListener('change', (e) => {
                this.handleImportFile(e);
            });
        }

        togglePanel() {
            if (this.isOpen) {
                this.closePanel();
            } else {
                this.openPanel();
            }
        }

        openPanel() {
            this.panel.classList.add('open');
            this.isOpen = true;
            this.checkModalState();
        }

        closePanel() {
            this.panel.classList.remove('open');
            this.isOpen = false;
        }

        switchTab(tabName) {
            this.currentTab = tabName;

            // Atualizar tabs
            this.panel.querySelectorAll('.chorinho-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            // Atualizar conteúdo
            this.panel.querySelectorAll('.chorinho-tab-content').forEach(content => {
                content.classList.toggle('active', content.dataset.content === tabName);
            });

            // Atualizar histórico se necessário
            if (tabName === 'history') {
                this.renderHistory();
            }

            // Carregar config se necessário
            if (tabName === 'config') {
                this.loadConfig();
            }
        }

        checkModalState() {
            const hasModal = Utils.isTaskModalOpen();
            
            if (hasModal) {
                // Pré-preencher dados
                this.fillTaskData();
                this.switchTab('form');
            } else {
                // Mostrar histórico
                this.switchTab('history');
            }
        }

        fillTaskData() {
            const taskNumber = Utils.extractTaskNumber();
            const taskTitle = Utils.extractTaskTitle();
            
            if (taskNumber) {
                document.getElementById('chorinho-task-number').value = taskNumber;
            }
            
            if (taskTitle) {
                document.getElementById('chorinho-task-title').value = taskTitle;
            }

            if (taskNumber && taskTitle) {
                const branchName = Utils.generateBranchName(taskNumber, taskTitle);
                document.getElementById('chorinho-branch').value = branchName;
            }

            // Carregar dados salvos se existirem
            const currentData = Storage.getCurrentData();
            if (currentData && currentData.taskNumber === taskNumber) {
                this.loadFormData(currentData);
            }
        }

        loadFormData(data) {
            document.getElementById('chorinho-sistema').value = data.sistema || '';
            document.getElementById('chorinho-objetivo').value = data.objetivo || '';
            document.getElementById('chorinho-solucao').value = data.solucao || '';
            document.getElementById('chorinho-modificacoes').value = data.modificacoes || '';
            document.getElementById('chorinho-fluxo').value = data.fluxo || '';
            document.getElementById('chorinho-comandos').value = data.comandos || '';
            document.getElementById('chorinho-observacoes').value = data.observacoes || '';

            // Carregar issues
            if (data.issues && data.issues.length > 0) {
                const container = document.getElementById('chorinho-issues-container');
                container.innerHTML = '';
                data.issues.forEach((issue, index) => {
                    this.addIssueElement(index, issue);
                });
            }
        }

        getFormData() {
            const issues = [];
            document.querySelectorAll('[data-issue-index]').forEach(input => {
                if (input.value.trim()) {
                    issues.push(input.value.trim());
                }
            });

            return {
                taskNumber: document.getElementById('chorinho-task-number').value,
                taskTitle: document.getElementById('chorinho-task-title').value,
                sistema: document.getElementById('chorinho-sistema').value,
                branch: document.getElementById('chorinho-branch').value,
                objetivo: document.getElementById('chorinho-objetivo').value,
                issues: issues,
                solucao: document.getElementById('chorinho-solucao').value,
                modificacoes: document.getElementById('chorinho-modificacoes').value,
                fluxo: document.getElementById('chorinho-fluxo').value,
                comandos: document.getElementById('chorinho-comandos').value,
                observacoes: document.getElementById('chorinho-observacoes').value
            };
        }

        autoSaveCurrentData() {
            const data = this.getFormData();
            Storage.saveCurrentData(data);
        }

        addIssueElement(index, value = '') {
            const container = document.getElementById('chorinho-issues-container');
            const issueDiv = document.createElement('div');
            issueDiv.className = 'chorinho-issue-item';
            issueDiv.innerHTML = `
                <input type="text" class="chorinho-input" placeholder="Issue ${index + 1}" data-issue-index="${index}" value="${value}">
                <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removeIssue(${index})">×</button>
            `;
            container.appendChild(issueDiv);
        }

        renderHistory() {
            const chorinhos = Storage.getSavedChorinhos();
            const container = document.getElementById('chorinho-history-list');

            if (chorinhos.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum CHORINHO salvo ainda.</p>';
                return;
            }

            container.innerHTML = chorinhos.map(chorinho => `
                <div class="chorinho-history-item">
                    <h4>${chorinho.taskNumber} - ${chorinho.taskTitle}</h4>
                    <p>Salvo em: ${Utils.formatDate(chorinho.savedAt)}</p>
                    <button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.openChorinho('${chorinho.id}')">📂 Abrir Chorinho</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-secondary" onclick="window.open('https://runrun.it/pt-BR/tasks/${chorinho.taskNumber}', '_blank')">🔗 Acessar Task</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.deleteChorinho('${chorinho.id}')">🗑️ Excluir</button>
                </div>
            `).join('');
        }

        loadConfig() {
            const config = Storage.getConfig();
            document.getElementById('config-sistema').checked = config.fields.sistema;
            document.getElementById('config-mr').checked = config.fields.mr;
            document.getElementById('config-branch').checked = config.fields.branch;
            document.getElementById('config-descricao').checked = config.fields.descricao;
            document.getElementById('config-solucao').checked = config.fields.solucao;
            document.getElementById('config-modificacoes').checked = config.fields.modificacoes;
            document.getElementById('config-fluxo').checked = config.fields.fluxo;
            document.getElementById('config-comandos').checked = config.fields.comandos;
            document.getElementById('config-observacoes').checked = config.fields.observacoes;
        }

        showAlert(message, type = 'success') {
            const container = document.getElementById('chorinho-alert-container');
            const alert = document.createElement('div');
            alert.className = `chorinho-alert chorinho-alert-${type}`;
            alert.textContent = message;
            container.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 3000);
        }
    }

    // ==================== APP ====================
    class ChorinhoApp {
        constructor() {
            this.ui = new ChorinhoUI();
        }

        addIssue() {
            const container = document.getElementById('chorinho-issues-container');
            const currentCount = container.querySelectorAll('.chorinho-issue-item').length;
            this.ui.addIssueElement(currentCount);
        }

        removeIssue(index) {
            const container = document.getElementById('chorinho-issues-container');
            const items = container.querySelectorAll('.chorinho-issue-item');
            if (items.length > 1) {
                items[index].remove();
                // Re-index remaining items
                container.querySelectorAll('[data-issue-index]').forEach((input, idx) => {
                    input.setAttribute('data-issue-index', idx);
                    input.placeholder = `Issue ${idx + 1}`;
                });
            }
        }

        saveCurrentChorinho() {
            const data = this.ui.getFormData();
            
            if (!data.taskNumber || !data.taskTitle) {
                this.ui.showAlert('Por favor, preencha pelo menos o número e título da task.', 'error');
                return;
            }

            const success = Storage.saveChorinho(data);
            
            if (success) {
                this.ui.showAlert('CHORINHO salvo com sucesso! 🎉');
            } else {
                this.ui.showAlert('Erro ao salvar CHORINHO.', 'error');
            }
        }

        openChorinho(id) {
            const chorinhos = Storage.getSavedChorinhos();
            const chorinho = chorinhos.find(c => c.id === id);
            
            if (chorinho) {
                this.ui.loadFormData(chorinho);
                document.getElementById('chorinho-task-number').value = chorinho.taskNumber;
                document.getElementById('chorinho-task-title').value = chorinho.taskTitle;
                document.getElementById('chorinho-branch').value = chorinho.branch;
                this.ui.switchTab('form');
                this.ui.currentChorinho = chorinho;
            }
        }

        deleteChorinho(id) {
            if (confirm('Tem certeza que deseja excluir este CHORINHO?')) {
                Storage.deleteChorinho(id);
                this.ui.renderHistory();
                this.ui.showAlert('CHORINHO excluído com sucesso.');
            }
        }

        copyMarkdown() {
            const data = this.ui.getFormData();
            const config = Storage.getConfig();
            const markdown = TemplateGenerator.generate(data, config);
            
            Utils.copyToClipboard(markdown);
            this.ui.showAlert('Markdown copiado para o clipboard! 📋');
        }

        showPreview() {
            const data = this.ui.getFormData();
            const config = Storage.getConfig();
            const markdown = TemplateGenerator.generate(data, config);
            
            const previewContainer = document.getElementById('chorinho-preview-container');
            const previewDiv = document.getElementById('chorinho-preview');
            
            // Usar marked.js para renderizar markdown
            if (typeof marked !== 'undefined') {
                previewDiv.innerHTML = marked.parse(markdown);
            } else {
                previewDiv.textContent = markdown;
            }
            
            previewContainer.style.display = previewContainer.style.display === 'none' ? 'block' : 'none';
        }

        downloadMarkdown() {
            const data = this.ui.getFormData();
            const config = Storage.getConfig();
            const markdown = TemplateGenerator.generate(data, config);
            
            const filename = `chorinho-${data.taskNumber}-${Utils.slugify(data.taskTitle)}.md`;
            Utils.downloadFile(markdown, filename);
            this.ui.showAlert('Arquivo .md baixado com sucesso! ⬇️');
        }

        saveConfig() {
            const config = {
                fields: {
                    sistema: document.getElementById('config-sistema').checked,
                    mr: document.getElementById('config-mr').checked,
                    branch: document.getElementById('config-branch').checked,
                    descricao: document.getElementById('config-descricao').checked,
                    solucao: document.getElementById('config-solucao').checked,
                    modificacoes: document.getElementById('config-modificacoes').checked,
                    fluxo: document.getElementById('config-fluxo').checked,
                    comandos: document.getElementById('config-comandos').checked,
                    observacoes: document.getElementById('config-observacoes').checked
                }
            };

            Storage.saveConfig(config);
            this.ui.showAlert('Configurações salvas com sucesso! ⚙️');
        }

        exportChorinhos() {
            const chorinhos = Storage.getSavedChorinhos();
            const json = JSON.stringify(chorinhos, null, 2);
            const filename = `chorinhos-export-${new Date().toISOString().split('T')[0]}.json`;
            Utils.downloadFile(json, filename);
            this.ui.showAlert('CHORINHOs exportados com sucesso! 📤');
        }

        importChorinhos() {
            document.getElementById('chorinho-import-file').click();
        }

        handleImportFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    const current = Storage.getSavedChorinhos();
                    const merged = [...current, ...imported];
                    Storage.set(Storage.KEYS.CHORINHOS, merged);
                    this.ui.renderHistory();
                    this.ui.showAlert('CHORINHOs importados com sucesso! 📥');
                } catch (error) {
                    this.ui.showAlert('Erro ao importar arquivo JSON.', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // ==================== INICIALIZAÇÃO ====================
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        window.chorinhoApp = new ChorinhoApp();
        console.log('🎵 CHORINHO inicializado com sucesso!');
    }
})();
