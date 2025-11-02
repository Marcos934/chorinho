// ==UserScript==
// @name         CHORINHO - Formatador de CHORE para runrun.it
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Extensão para formatar CHORE de tasks em Markdown no runrun.it
// @author       Marcos V. Mulinari
// @match        https://runrun.it/pt-BR/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== ÍCONES SVG ====================
    const Icons = {
        music: '<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707zm-2.121-2.121A4.987 4.987 0 0 0 11.025 8a4.987 4.987 0 0 0-1.61-3.889l-.708.707A3.989 3.989 0 0 1 10.025 8a3.989 3.989 0 0 1-1.318 2.982l.708.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/></svg>',
        close: '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>',
        save: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/></svg>',
        copy: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/></svg>',
        eye: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></svg>',
        download: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>',
        upload: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg>',
        trash: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>',
        folder: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/></svg>',
        document: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16"><path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-3z"/></svg>',
        link: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/><path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z"/></svg>',
        plus: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>',
        gear: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>'
    };

    // ==================== ESTILOS ====================
    const styles = `
        h3 {
            color: dimgrey;
        }
        .chorinho-float-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #24292e;
            border-radius: 50%;
            border: 2px solid #e1e4e8;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: white;
        }

        .chorinho-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            background: #1a1e22;
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
            background: #24292e;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
            border-bottom: 1px solid #e1e4e8;
        }

        .chorinho-header h2 {
            margin: 0;
            font-size: 24px;
            flex-grow: 1;
        }

        .chorinho-close {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .chorinho-close:hover {
            background: rgba(255, 255, 255, 0.2);
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

        .chorinho-panel .chorinho-input,
        .chorinho-panel .chorinho-textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.2s;
            box-sizing: border-box;
            color: #333;
        }

        .chorinho-panel .chorinho-textarea {
            min-height: 80px;
            resize: vertical;
        }

        .chorinho-checkbox-group {
            display: flex;
            flex-direction: column;
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

        .chorinho-config-subgroup {
            padding-left: 20px;
        }

        .chorinho-btn {
            background: #24292e;
            color: white;
            border: 1px solid rgba(27, 31, 35, 0.15);
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
            margin-right: 5px;
            margin-bottom: 12px;
            display: inline-flex;
            align-items: center;
            gap: 1px;
            margin-top: 10px;
        }

        .chorinho-btn:hover {
            background: #1a1e22;
        }

        .chorinho-btn-secondary {
            background: #fafbfc;
            color: #24292e;
        }
        
        .chorinho-btn-secondary:hover {
            background: #f3f4f6;
        }

        .chorinho-btn-success {
            background: #2ea44f;
            border-color: rgba(27, 31, 35, 0.15);
        }
        
        .chorinho-btn-success:hover {
            background: #2c974b;
        }

        .chorinho-btn-danger {
            background: #d73a49;
            border-color: rgba(27, 31, 35, 0.15);
        }
        
        .chorinho-btn-danger:hover {
            background: #cb2431;
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

        .chorinho-issue-item input[type="text"] {
            flex: 1;
        }

        .chorinho-issue-item .chorinho-issue-checkbox {
            margin-right: 5px;
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
            color: #24292e;
            border-bottom-color: #f9826c;
        }

        .chorinho-tab-content {
            display: none;
        }

        .chorinho-tab-content.active {
            display: block;
        }

        .chorinho-history-item {
            background: #f6f8fa;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 10px;
            border: 1px solid #e1e4e8;
            border-left: 3px solid #0366d6;
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
        }

        .chorinho-preview h2 {
            color: #24292e;
            border-bottom: 1px solid #e1e4e8;
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

        .chorinho-alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }

        .chorinho-badge {
            display: inline-block;
            padding: 4px 8px;
            background: #0366d6;
            color: white;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 8px;
        }
        
        .chorinho-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .chorinho-static-field {
            width: 100%;
            padding: 10px;
            background: #f6f8fa;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            box-sizing: border-box;
            min-height: 40px;
            color: #586069;
            display: flex;
            align-items: center;
        }

        #chorinho-alert-container {
            position: absolute;
            top: 10px;
            right: 50px;
            width: 300px;
            z-index: 99999999;
        }

        /* Dark Mode */
        .chorinho-panel.dark-mode {
            background: #2d333b;
            color: #c9d1d9;
        }
        .chorinho-panel.dark-mode .chorinho-header {
            background: #1c2128;
            border-bottom: 1px solid #444c56;
        }
        .chorinho-panel.dark-mode .chorinho-section label {
            color: #c9d1d9;
        }
        .chorinho-panel.dark-mode .chorinho-input,
        .chorinho-panel.dark-mode .chorinho-textarea {
            background: #1c2128;
            border-color: #444c56;
            color: #c9d1d9;
        }
        .chorinho-panel.dark-mode .chorinho-static-field {
            background: #1c2128;
            border-color: #444c56;
            color: #c9d1d9;
        }
        .chorinho-panel.dark-mode .chorinho-tab {
            color: #8b949e;
        }
        .chorinho-panel.dark-mode .chorinho-tab.active {
            color: #c9d1d9;
            border-bottom-color: #f9826c;
        }
        .chorinho-panel.dark-mode .chorinho-tabs {
            border-bottom-color: #444c56;
        }
        .chorinho-panel.dark-mode .chorinho-history-item {
            background: #1c2128;
            border-color: #444c56;
            border-left-color: #f9826c;
        }
        .chorinho-panel.dark-mode .chorinho-history-item h4 {
            color: #c9d1d9;
        }
        .chorinho-panel.dark-mode .chorinho-history-item p {
            color: #8b949e;
        }
        .chorinho-panel.dark-mode .chorinho-preview {
            background: #1c2128;
            border-color: #444c56;
        }
        .chorinho-panel.dark-mode .chorinho-preview h2 {
            color: #c9d1d9;
            border-bottom-color: #444c56;
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

        sanitizeForFilename(text) {
            return text.replace(/\//g, '-').replace(/[\\?%*:|"<>]/g, '');
        },

        // Extrai número da task
        extractTaskNumber() {
            try {
                const selector = "#task-show-modal .sc-kzGZOW.sc-OSwEw.fEAbVr.fZkMcP > span";
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
                const selector = "#task-show-modal span span";
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
            chorinho.savedAt = new Date().toISOString();
            
            const existingIndex = chorinhos.findIndex(c => c.taskNumber === chorinho.taskNumber);
            if (existingIndex >= 0) {
                chorinho.id = chorinhos[existingIndex].id; // Preserve existing ID
                chorinhos[existingIndex] = chorinho;
            } else {
                chorinho.id = Date.now().toString(); // Assign new ID
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
                    objetivo: true, // Novo campo para Objetivo
                    issuesEnabled: true, // Novo campo para habilitar/desabilitar Issues
                    issuesCheckboxes: false, // Novo campo para habilitar/desabilitar checkboxes nas Issues
                    solucao: true,
                    modificacoes: true,
                    fluxo: true,
                    comandos: true,
                    observacoes: true,
                    navegacao: true,
                    previewEnabled: false, // Feature flag para o preview
                    darkMode: false
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
                template += `## MR: ${data.mr || ''}\n`;
                if (config.fields.branch) {
                    template += `## Branch: ${data.branch || ''}\n`;
                }
            }

            if (config.fields.descricao) {
                template += `\n## Descrição:\n`;
                if (config.fields.objetivo) {
                    template += `   Objetivo: ${data.objetivo || ''}\n\n`;
                }
                if (config.fields.issuesEnabled && data.issues && data.issues.length > 0) {
                    data.issues.forEach((issue) => {
                        template += `   - ${issue || '?'}\n`;
                    });
                }
                template += `\n`;
            }

            if (config.fields.solucao) {
                template += `## Solução Implementada:\n \t${data.solucao || ''}\n\n`;
            }

            if (config.fields.modificacoes) {
                template += `## Modificações:\n \t${data.modificacoes || ''}\n\n`;
            }

            if (config.fields.fluxo) {
                template += `## Fluxo de teste na UI:\n \t${data.fluxo || ''}\n\n`;
            }

            if (config.fields.navegacao) {
                template += `## Navegação na UI:\n \t${data.navegacao || ''}\n\n`;
            }

            if (config.fields.comandos) {
                template += `## Comandos para testes BANCO DE DADOS:\n \t${data.comandos || ''}\n\n`;
            }

            if (config.fields.observacoes) {
                template += `## Observações/Notas\n \t${data.observacoes || ''}\n`;
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
            this.currentTaskNumber = '';
            this.currentTaskTitle = '';
            this.init();
        }

        init() {
            this.injectStyles();
            this.createFloatButton();
            this.createPanel();
            this.setupEventListeners();
            this.checkModalState();
            this.applyDarkMode();
        }

        injectStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }

        createFloatButton() {
            const btn = document.createElement('button');
            btn.className = 'chorinho-float-btn';
            btn.innerHTML = Icons.document;
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
                    <h2><span class="chorinho-icon">${Icons.document}</span> CHORINHO</h2>
                    <div id="chorinho-alert-container"></div>
                    <button class="chorinho-close">${Icons.close}</button>
                </div>
                <div class="chorinho-content">
                    <div class="chorinho-tabs">
                        <button class="chorinho-tab active" data-tab="form">Formulário</button>
                        ${Storage.getConfig().fields.previewEnabled ? '<button class="chorinho-tab" data-tab="preview">Preview</button>' : ''}
                        <button class="chorinho-tab" data-tab="history">Histórico</button>
                        <button class="chorinho-tab" data-tab="config">Configurações</button>
                    </div>
                    <div id="chorinho-hidden-fields-warning" class="chorinho-alert chorinho-alert-warning" style="display: none;"></div>
                    
                    <!-- Formulário -->
                    <div class="chorinho-tab-content active" data-content="form">
                        <div id="chorinho-no-task-warning" class="chorinho-alert chorinho-alert-warning" style="display: none;">O formulário está desabilitado pois não foi possível obter o número da task.</div>
                        <div class="chorinho-section">
                            <label>Task</label>
                            <div class="chorinho-static-field">
                                <h4 id="chorinho-task-display" style="margin: 0;"></h4>
                            </div>
                        </div>

                        <div class="chorinho-section" data-field="sistema">
                            <label>Sistema</label>
                            <input type="text" class="chorinho-input" id="chorinho-sistema" placeholder="Ex: Sistema XYZ">
                        </div>

                        <div class="chorinho-section" data-field="mr">
                            <label>Merge Request</label>
                            <input type="text" class="chorinho-input" id="chorinho-mr" placeholder="Link do Merge Request">
                        </div>

                        <div class="chorinho-section" data-field="branch">
                            <label>Branch</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" class="chorinho-input" id="chorinho-branch" style="flex: 1;">
                                <button class="chorinho-btn" id="chorinho-copy-branch-btn">${Icons.copy} Copiar</button>
                            </div>
                        </div>

                        <div class="chorinho-section" data-field="objetivo">
                            <label>Objetivo</label>
                            <textarea class="chorinho-textarea" id="chorinho-objetivo"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="issuesEnabled">
                            <label>Issues</label>
                            <div class="chorinho-issues-container" id="chorinho-issues-container">
                                <div class="chorinho-issue-item">
                                    <input type="text" class="chorinho-input" placeholder="Issue 1" data-issue-index="0">
                                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removeIssue(0)">${Icons.close}</button>
                                </div>
                            </div>
                            <button class="chorinho-btn chorinho-btn-small chorinho-btn-success" onclick="chorinhoApp.addIssue()">${Icons.plus} Adicionar Issue</button>
                        </div>

                        <div class="chorinho-section" data-field="solucao">
                            <label>Solução Implementada</label>
                            <textarea class="chorinho-textarea" id="chorinho-solucao"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="modificacoes">
                            <label>Modificações</label>
                            <textarea class="chorinho-textarea" id="chorinho-modificacoes"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="fluxo">
                            <label>Fluxo de teste na UI</label>
                            <textarea class="chorinho-textarea" id="chorinho-fluxo"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="navegacao">
                            <label>Navegação na UI</label>
                            <textarea class="chorinho-textarea" id="chorinho-navegacao"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="comandos">
                            <label>Comandos para testes BANCO DE DADOS</label>
                            <textarea class="chorinho-textarea" id="chorinho-comandos"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="observacoes">
                            <label>Observações/Notas</label>
                            <textarea class="chorinho-textarea" id="chorinho-observacoes"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveCurrentChorinho()">${Icons.save} Salvar</button>
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.copyMarkdown()">${Icons.copy} Copiar Markdown</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.downloadMarkdown()">${Icons.download} Baixar .md</button>
                        </div>
                    </div>

                    <!-- Preview -->
                    <div class="chorinho-tab-content" data-content="preview">
                        <div class="chorinho-section">
                            <h3>Preview do Markdown</h3>
                            <div class="chorinho-preview" id="chorinho-preview"></div>
                        </div>
                    </div>

                    <!-- Histórico -->
                    <div class="chorinho-tab-content" data-content="history">
                        <div class="chorinho-section">
                            <input type="text" class="chorinho-input" id="chorinho-history-search" placeholder="Pesquisar por número ou título da task...">
                        </div>
                        <div id="chorinho-history-list"></div>
                        <div class="chorinho-section">
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.exportChorinhos()">${Icons.upload} Exportar JSON</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.importChorinhos()">${Icons.download} Importar JSON</button>
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
                                <div class="chorinho-config-subgroup">
                                    <div class="chorinho-checkbox-item">
                                        <input type="checkbox" id="config-objetivo" checked>
                                        <label for="config-objetivo">Objetivo</label>
                                    </div>
                                    <div class="chorinho-checkbox-item">
                                        <input type="checkbox" id="config-issuesEnabled" checked>
                                        <label for="config-issuesEnabled">Issues</label>
                                    </div>
                                    <div class="chorinho-config-subgroup">
                                        <div class="chorinho-checkbox-item">
                                            <input type="checkbox" id="config-issuesCheckboxes">
                                            <label for="config-issuesCheckboxes">Habilitar Checkboxes</label>
                                        </div>
                                    </div>
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
                                    <label for="config-fluxo">Fluxo de teste na UI</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-navegacao" checked>
                                    <label for="config-navegacao">Navegação na UI</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-comandos" checked>
                                    <label for="config-comandos">Comandos para testes BANCO DE DADOS</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-observacoes" checked>
                                    <label for="config-observacoes">Observações/Notas</label>
                                </div>
                                <div class="chorinho-checkbox-item">
                                    <input type="checkbox" id="config-darkMode">
                                    <label for="config-darkMode">Modo Escuro</label>
                                </div>
                            </div>
                        </div>
                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveConfig()">${Icons.save} Salvar Configurações</button>
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
                window.chorinhoApp.handleImportFile(e);
            });

            // History search
            document.getElementById('chorinho-history-search').addEventListener('input', () => {
                this.renderHistory();
            });

            // Copy branch button
            document.getElementById('chorinho-copy-branch-btn').addEventListener('click', () => {
                const branchName = document.getElementById('chorinho-branch').value;
                Utils.copyToClipboard(branchName);
                this.showAlert('Nome da branch copiado para o clipboard!', 'success');
            });

            // Config dependencies
            const configDescricao = document.getElementById('config-descricao');
            const subGroupDescricao = configDescricao.closest('.chorinho-checkbox-item').nextElementSibling;
            const configIssuesEnabled = document.getElementById('config-issuesEnabled');
            const subGroupIssues = configIssuesEnabled.closest('.chorinho-checkbox-item').nextElementSibling;

            const toggleSubGroup = (checkbox, subGroup) => {
                if (subGroup) {
                    subGroup.style.display = checkbox.checked ? 'block' : 'none';
                }
            };

            configDescricao.addEventListener('change', () => {
                toggleSubGroup(configDescricao, subGroupDescricao);
            });

            configIssuesEnabled.addEventListener('change', () => {
                toggleSubGroup(configIssuesEnabled, subGroupIssues);
            });

            // Set initial state when config tab is switched to
            const configTab = this.panel.querySelector('.chorinho-tab[data-tab="config"]');
            configTab.addEventListener('click', () => {
                toggleSubGroup(configDescricao, subGroupDescricao);
                toggleSubGroup(configIssuesEnabled, subGroupIssues);
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
            this.applyFieldsVisibility(); // Apply field visibility when panel opens
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

            if (tabName === 'preview') {
                const data = this.getFormData();
                const config = Storage.getConfig();
                const markdown = TemplateGenerator.generate(data, config);
                const previewDiv = document.getElementById('chorinho-preview');
                if (typeof marked !== 'undefined') {
                    previewDiv.innerHTML = marked.parse(markdown);
                } else {
                    previewDiv.textContent = markdown;
                }
            }

            // Atualizar histórico se necessário
            if (tabName === 'history') {
                this.renderHistory();
            }

            // Carregar config se necessário
            if (tabName === 'config') {
                this.loadConfig();
            }
        }

        setFormEnabled(enabled) {
            const form = this.panel.querySelector('[data-content="form"]');
            const elements = form.querySelectorAll('input, textarea, button');
            const warningDiv = document.getElementById('chorinho-no-task-warning');
    
            elements.forEach(el => {
                el.disabled = !enabled;
            });
    
            if (warningDiv) {
                warningDiv.style.display = enabled ? 'none' : 'block';
            }
        }
    
        checkModalState() {
            this.fillTaskData();
        }
    
        fillTaskData() {
            const taskNumber = Utils.extractTaskNumber();
            const taskTitle = Utils.extractTaskTitle();
            const taskDisplay = document.getElementById('chorinho-task-display');
    
            if (!taskNumber) {
                this.setFormEnabled(false);
                this.clearForm();
                taskDisplay.innerText = 'Nenhuma task aberta no modal.';
                return;
            }
    
            this.setFormEnabled(true);
            
            this.currentTaskNumber = taskNumber;
            this.currentTaskTitle = taskTitle;
    
            if (taskNumber && taskTitle) {
                taskDisplay.innerText = `${taskNumber} - ${taskTitle}`;
            } else if (taskNumber) {
                taskDisplay.innerText = taskNumber;
            } else if (taskTitle) {
                taskDisplay.innerText = taskTitle;
            } else {
                taskDisplay.innerText = '';
            }
    
            if (taskNumber && taskTitle) {
                const branchName = Utils.generateBranchName(taskNumber, taskTitle);
                document.getElementById('chorinho-branch').value = branchName;
            }
    
            // Carregar dados salvos se existirem
            const savedChorinhos = Storage.getSavedChorinhos();
            const taskData = savedChorinhos.find(c => c.taskNumber === taskNumber);
    
            if (taskData) {
                this.loadFormData(taskData);
            } else {
                this.clearForm(); // Limpa o formulário se não houver dados salvos
                this.applyFieldsVisibility(); // Aplica a visibilidade dos campos
                // Preenche o nome da branch mesmo para novas tasks
                if (taskNumber && taskTitle) {
                    const branchName = Utils.generateBranchName(taskNumber, taskTitle);
                    document.getElementById('chorinho-branch').value = branchName;
                }
            }
        }

        loadFormData(data) {
            document.getElementById('chorinho-sistema').value = data.sistema || '';
            document.getElementById('chorinho-mr').value = data.mr || '';
            document.getElementById('chorinho-objetivo').value = data.objetivo || '';
            document.getElementById('chorinho-solucao').value = data.solucao || '';
            document.getElementById('chorinho-modificacoes').value = data.modificacoes || '';
            document.getElementById('chorinho-fluxo').value = data.fluxo || '';
            document.getElementById('chorinho-navegacao').value = data.navegacao || '';
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

            this.applyFieldsVisibility();
        }

        getFormData() {
            const issues = [];
            const config = Storage.getConfig();
            const showCheckboxes = config.fields.issuesCheckboxes;

            document.querySelectorAll('.chorinho-issue-item').forEach(item => {
                const input = item.querySelector('input[type="text"]');
                if (input && input.value.trim()) {
                    if (showCheckboxes) {
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        const prefix = checkbox && checkbox.checked ? '[x] ' : '[ ] ';
                        issues.push(prefix + input.value.trim());
                    } else {
                        issues.push(input.value.trim());
                    }
                }
            });

            const taskDisplay = document.getElementById('chorinho-task-display').innerText;
            let taskNumber = '';
            let taskTitle = '';

            const match = taskDisplay.match(/^(#\d+)\s*-\s*(.*)$/);
            if (match) {
                taskNumber = match[1].replace('#', '');
                taskTitle = match[2];
            } else {
                // Fallback if format is just number or just title
                taskNumber = taskDisplay.match(/#(\d+)/) ? taskDisplay.match(/#(\d+)/)[1] : '';
                taskTitle = taskDisplay;
            }

            return {
                taskNumber: this.currentTaskNumber,
                taskTitle: this.currentTaskTitle,
                sistema: document.getElementById('chorinho-sistema').value,
                mr: document.getElementById('chorinho-mr').value,
                branch: document.getElementById('chorinho-branch').value,
                objetivo: document.getElementById('chorinho-objetivo').value,
                issues: issues,
                solucao: document.getElementById('chorinho-solucao').value,
                modificacoes: document.getElementById('chorinho-modificacoes').value,
                fluxo: document.getElementById('chorinho-fluxo').value,
                navegacao: document.getElementById('chorinho-navegacao').value,
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
            const config = Storage.getConfig();
            const showCheckboxes = config.fields.issuesCheckboxes;

            const isChecked = value.startsWith('[x] ');
            const textValue = showCheckboxes ? value.replace(/\[[x ]\]\s*/, '') : value;

            issueDiv.innerHTML = `
                ${showCheckboxes ? `<input type="checkbox" class="chorinho-issue-checkbox" id="issue-checkbox-${index}" ${isChecked ? 'checked' : ''}>` : ''}
                <input type="text" class="chorinho-input" placeholder="Issue ${index + 1}" data-issue-index="${index}" value="${textValue}">
                <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removeIssue(${index})">${Icons.close}</button>
            `;
            container.appendChild(issueDiv);

            if (showCheckboxes) {
                const checkbox = issueDiv.querySelector(`#issue-checkbox-${index}`);
                checkbox.addEventListener('change', () => {
                    chorinhoApp.ui.autoSaveCurrentData();
                });
            }
        }

        renderHistory() {
            const allChorinhos = Storage.getSavedChorinhos();
            const container = document.getElementById('chorinho-history-list');
            const searchTerm = document.getElementById('chorinho-history-search').value.toLowerCase();

            const filteredChorinhos = allChorinhos.filter(chorinho => {
                return chorinho.taskNumber.toLowerCase().includes(searchTerm) ||
                       chorinho.taskTitle.toLowerCase().includes(searchTerm);
            });

            if (filteredChorinhos.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum CHORINHO encontrado.</p>';
                return;
            }

            container.innerHTML = filteredChorinhos.map(chorinho => `
                <div class="chorinho-history-item">
                    <h4>${chorinho.taskNumber} - ${chorinho.taskTitle}</h4>
                    <p>Salvo em: ${Utils.formatDate(chorinho.savedAt)}</p>
                    <button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.openChorinho('${chorinho.id}')">${Icons.folder} Abrir Chorinho</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-secondary" onclick="window.open('https://runrun.it/pt-BR/tasks/${chorinho.taskNumber}', '_blank')">${Icons.link} Acessar Task</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.deleteChorinho('${chorinho.id}')">${Icons.trash} Excluir</button>
                </div>
            `).join('');
        }

        loadConfig() {
            const config = Storage.getConfig();
            document.getElementById('config-sistema').checked = config.fields.sistema;
            document.getElementById('config-mr').checked = config.fields.mr;
            document.getElementById('config-branch').checked = config.fields.branch;
            document.getElementById('config-descricao').checked = config.fields.descricao;
            document.getElementById('config-objetivo').checked = config.fields.objetivo;
            document.getElementById('config-issuesEnabled').checked = config.fields.issuesEnabled;
            document.getElementById('config-issuesCheckboxes').checked = config.fields.issuesCheckboxes;
            document.getElementById('config-solucao').checked = config.fields.solucao;
            document.getElementById('config-modificacoes').checked = config.fields.modificacoes;
            document.getElementById('config-fluxo').checked = config.fields.fluxo;
            document.getElementById('config-comandos').checked = config.fields.comandos;
            document.getElementById('config-observacoes').checked = config.fields.observacoes;
            document.getElementById('config-navegacao').checked = config.fields.navegacao;
            document.getElementById('config-darkMode').checked = config.fields.darkMode;
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
        
        clearForm() {
            document.getElementById('chorinho-sistema').value = '';
            document.getElementById('chorinho-mr').value = '';
            document.getElementById('chorinho-branch').value = '';
            document.getElementById('chorinho-objetivo').value = '';
            document.getElementById('chorinho-solucao').value = '';
            document.getElementById('chorinho-modificacoes').value = '';
            document.getElementById('chorinho-fluxo').value = '';
            document.getElementById('chorinho-navegacao').value = '';
            document.getElementById('chorinho-comandos').value = '';
            document.getElementById('chorinho-observacoes').value = '';

            const issuesContainer = document.getElementById('chorinho-issues-container');
            issuesContainer.innerHTML = '';
            this.addIssueElement(0); // Add one empty issue
        }

        applyFieldsVisibility() {
            const config = Storage.getConfig();
            const data = this.getFormData(); // Use getFormData to get current values
            const hiddenFieldsWithValue = [];

            // Define all configurable fields
            const configurableFields = [
                'sistema', 'mr', 'branch', 'descricao', 'objetivo', 'issuesEnabled', 'solucao', 'modificacoes',
                'fluxo', 'comandos', 'observacoes', 'navegacao'
            ];

            configurableFields.forEach(field => {
                const elements = this.panel.querySelectorAll(`[data-field="${field}"]`);
                elements.forEach(el => {
                    let isVisible = config.fields[field] === undefined ? true : config.fields[field];

                    // Handle dependencies
                    if (field === 'objetivo' || field === 'issuesEnabled') {
                        if (!config.fields.descricao) {
                            isVisible = false;
                        }
                    }
                    
                    el.style.display = isVisible ? 'block' : 'none';

                    if (!isVisible && data[field] && data[field].length > 0) {
                        hiddenFieldsWithValue.push(field);
                    }
                });
            });

            const warningDiv = document.getElementById('chorinho-hidden-fields-warning');
            if (hiddenFieldsWithValue.length > 0) {
                warningDiv.innerHTML = `<strong>Atenção:</strong> Os seguintes campos possuem valores mas estão ocultos: ${hiddenFieldsWithValue.join(', ')}`;
                warningDiv.style.display = 'block';
            } else {
                warningDiv.style.display = 'none';
            }
        }

        applyDarkMode() {
            const config = Storage.getConfig();
            if (config.fields.darkMode) {
                this.panel.classList.add('dark-mode');
            } else {
                this.panel.classList.remove('dark-mode');
            }
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
                const remainingItems = container.querySelectorAll('.chorinho-issue-item');
                remainingItems.forEach((item, idx) => {
                    const textInput = item.querySelector('input[type="text"]');
                    if (textInput) {
                        textInput.dataset.issueIndex = idx;
                        textInput.placeholder = `Issue ${idx + 1}`;
                    }
                    item.querySelector('button').onclick = () => chorinhoApp.removeIssue(idx);
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
                this.ui.showAlert('CHORINHO salvo com sucesso!', 'success');
            } else {
                this.ui.showAlert('Erro ao salvar.', 'error');
            }
        }

        openChorinho(id) {
            const chorinhos = Storage.getSavedChorinhos();
            const chorinho = chorinhos.find(c => c.id === id);
            
            if (chorinho) {
                this.ui.setFormEnabled(true);
                this.ui.loadFormData(chorinho);
                this.ui.currentTaskNumber = chorinho.taskNumber;
                this.ui.currentTaskTitle = chorinho.taskTitle;
                const taskDisplay = document.getElementById('chorinho-task-display');
                taskDisplay.innerText = `${chorinho.taskNumber} - ${chorinho.taskTitle}`;
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
            this.ui.showAlert('Markdown copiado para o clipboard!', 'success');
        }



        downloadMarkdown() {
            const data = this.ui.getFormData();
            const config = Storage.getConfig();
            const markdown = TemplateGenerator.generate(data, config);
            
            let filename = 'chorinho.md';

            if (data.taskNumber && data.taskTitle) {
                const sanitizedTitle = Utils.sanitizeForFilename(data.taskTitle);
                filename = `${data.taskNumber} - ${sanitizedTitle}.md`;
            } else if (data.taskNumber) {
                filename = `${data.taskNumber}.md`;
            } else if (data.taskTitle) {
                const sanitizedTitle = Utils.sanitizeForFilename(data.taskTitle);
                filename = `${sanitizedTitle}.md`;
            } else {
                filename = 'chorinho-sem-task.md';
            }
            
            Utils.downloadFile(markdown, filename);
            this.ui.showAlert('Arquivo .md baixado com sucesso!', 'success');
        }

        saveConfig() {
            const config = {
                fields: {
                    sistema: document.getElementById('config-sistema').checked,
                    mr: document.getElementById('config-mr').checked,
                    branch: document.getElementById('config-branch').checked,
                    descricao: document.getElementById('config-descricao').checked,
                    objetivo: document.getElementById('config-objetivo').checked,
                    issuesEnabled: document.getElementById('config-issuesEnabled').checked,
                    issuesCheckboxes: document.getElementById('config-issuesCheckboxes').checked,
                    solucao: document.getElementById('config-solucao').checked,
                    modificacoes: document.getElementById('config-modificacoes').checked,
                    fluxo: document.getElementById('config-fluxo').checked,
                    comandos: document.getElementById('config-comandos').checked,
                    observacoes: document.getElementById('config-observacoes').checked,
                    navegacao: document.getElementById('config-navegacao').checked,
                    darkMode: document.getElementById('config-darkMode').checked
                }
            };

            Storage.saveConfig(config);
            this.ui.applyFieldsVisibility();
            this.ui.applyDarkMode();
            this.ui.showAlert('Configurações salvas com sucesso!', 'success');
        }

        exportChorinhos() {
            const chorinhos = Storage.getSavedChorinhos();
            const json = JSON.stringify(chorinhos, null, 2);
            const filename = `chorinhos-export-${new Date().toISOString().split('T')[0]}.json`;
            Utils.downloadFile(json, filename);
            this.ui.showAlert('CHORINHOs exportados com sucesso!', 'success');
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
                    const importedChorinhos = JSON.parse(e.target.result);
                    if (!Array.isArray(importedChorinhos)) {
                        throw new Error("O arquivo JSON não é um array.");
                    }

                    const currentChorinhos = Storage.getSavedChorinhos();
                    
                    importedChorinhos.forEach(importedChorinho => {
                        // Validar se o chorinho importado tem os campos mínimos
                        if (!importedChorinho.taskNumber || !importedChorinho.id) {
                            console.warn('Chorinho importado ignorado por falta de taskNumber ou id:', importedChorinho);
                            return; // Pula para o próximo
                        }

                        const existingIndex = currentChorinhos.findIndex(c => c.id === importedChorinho.id);

                        if (existingIndex >= 0) {
                            // Se já existe, atualiza
                            currentChorinhos[existingIndex] = importedChorinho;
                        } else {
                            // Se não existe, adiciona
                            currentChorinhos.unshift(importedChorinho);
                        }
                    });

                    Storage.set(Storage.KEYS.CHORINHOS, currentChorinhos);
                    this.ui.renderHistory();
                    this.ui.showAlert('CHORINHOs importados com sucesso!', 'success');
                } catch (error) {
                    console.error('Erro ao importar CHORINHOs:', error);
                    this.ui.showAlert('Erro ao importar arquivo JSON. Verifique o formato do arquivo.', 'error');
                }
            };
            reader.readAsText(file);
        }
    }

    // ==================== INICIALIZAÇÃO ====================
    // Aguardar após o carregamento da página
    function init() {
        setTimeout(() => {
        window.chorinhoApp = new ChorinhoApp();
        console.log('CHORINHO inicializado com sucesso!');
        }, 200);
    }
    
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
