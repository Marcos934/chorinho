// ==UserScript==
// @name         CHORINHO - Formatador de CHORE para runrun.it
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Extensão para formatar CHORE de tasks em Markdown no runrun.it
// @author       Marcos V. Mulinari
// @match        https://runrun.it/pt-BR/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js
// ==/UserScript==

(function () {
    'use strict';

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
        gear: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>',
        drag: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16"><path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>',
        archive: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>',
        unarchive: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM6.854 7.146a.5.5 0 1 0-.708.708L7.293 9H5.5a.5.5 0 0 0 0 1h1.793l-1.147 1.146a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2z"/></svg>',
        tag: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>',
        filter: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/></svg>',
        edit: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>',
        star: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>',
        starFill: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>',
        duplicate: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/></svg>',
        sort: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/><path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/></svg>',
        search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>' 
   };

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
        .chorinho-plano-de-acao-container {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
        }
        .chorinho-plano-de-acao-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }
        .chorinho-issue-item input[type="text"] {
            flex: 1;
        }
        .chorinho-issue-item .chorinho-plano-de-acao-checkbox {
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
        .chorinho-drag-handle {
            cursor: grab;
            color: #586069;
            margin-left: 8px;
        }
        .chorinho-sortable-ghost {
            opacity: 0.4;
            background: #f0f0f0;
        }
        
        .chorinho-label {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 6px;
            margin-bottom: 4px;
            color: white;
        }

        .chorinho-label-clickable {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            margin-right: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid transparent;
            opacity: 0.5;
        }

        .chorinho-label-clickable:hover {
            opacity: 0.8;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chorinho-label-clickable.selected {
            opacity: 1;
            border-color: rgba(0,0,0,0.2);
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .chorinho-label-clickable.selected::before {
            content: '✓ ';
        }

        .chorinho-labels-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }

        .chorinho-label-manager {
            margin-top: 20px;
        }
        .chorinho-label-manager h3 {
            color: #333; /* Ensure dark text in light mode */
        }

        .chorinho-label-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 8px;
        }

        .chorinho-label-preview {
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            color: white;
            min-width: 80px;
            text-align: center;
        }

        .chorinho-color-picker {
            width: 50px;
            height: 32px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
        }

        .chorinho-history-header {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 20px;
            background: white;
            padding: 15px;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
        }

        .chorinho-filters-row {
            display: flex;
            gap: 10px;
            width: 100%;
        }

        .chorinho-filters-row .chorinho-input {
            margin: 0; 
        }

        .chorinho-search-wrapper {
            flex: 2;
            position: relative;
        }

        .chorinho-search-wrapper input {
            width: 100%;
            padding-left: 32px !important; 
        }

        .chorinho-search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #6a737d;
            pointer-events: none;
        }

        .chorinho-filter-select {
            flex: 1;
            min-width: 140px;
        }

        .chorinho-toggles-row {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        
        .chorinho-toggle-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border: 1px solid #e1e4e8;
            border-radius: 20px;
            background: white;
            color: #586069;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
        }

        .chorinho-toggle-btn:hover {
            background: #f6f8fa;
            border-color: #c0c4c8;
        }

        .chorinho-toggle-btn.active {
            background: #e1f0ff; 
            color: #0366d6;
            border-color: #0366d6;
        }

        .chorinho-toggle-btn.active svg {
            fill: currentColor;
        }

        .chorinho-toggle-btn input {
            display: none;
        }

        .chorinho-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .chorinho-stat {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 15px;
            background: white;
            border: 1px solid #e1e4e8;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
        }

        .chorinho-stat::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
        }

        .chorinho-stat.total::after { background: #0366d6; }
        .chorinho-stat.active-stat::after { background: #2ea44f; }
        .chorinho-stat.archived-stat::after { background: #6a737d; }

        .chorinho-stat-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #586069;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .chorinho-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: #24292e;
            line-height: 1;
        }

        .chorinho-history-item.archived {
            opacity: 0.65;
            border-left-color: #999;
        }

        .chorinho-archived-badge {
            background: #999;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            margin-left: 10px;
        }
        
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
        .chorinho-panel.dark-mode .chorinho-textarea,
        .chorinho-panel.dark-mode select {
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
        .chorinho-panel.dark-mode .chorinho-label-item,
        .chorinho-panel.dark-mode .chorinho-stats {
            background: transparent; 
            border: none; 
            padding: 0;
        }
        
        .chorinho-panel.dark-mode .chorinho-stat {
            background: #1c2128;
            border-color: #444c56;
        }
        
        .chorinho-panel.dark-mode .chorinho-stat-header {
            color: #8b949e;
        }
        
        .chorinho-panel.dark-mode .chorinho-stat-value {
            color: #c9d1d9;
        }
        
        .chorinho-panel.dark-mode .chorinho-history-header {
            background: #1c2128;
            border-color: #444c56;
        }
        
        .chorinho-panel.dark-mode .chorinho-toggle-btn {
            background: #1c2128;
            border-color: #444c56;
            color: #c9d1d9;
        }
        
        .chorinho-panel.dark-mode .chorinho-toggle-btn:hover {
            background: #2d333b;
            border-color: #768390;
        }
        
        .chorinho-panel.dark-mode .chorinho-toggle-btn.active {
            background: rgba(56, 139, 253, 0.15);
            color: #58a6ff;
            border-color: #58a6ff;
        }
        
        .chorinho-panel.dark-mode .chorinho-search-icon {
            color: #8b949e;
        }

        
        .chorinho-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .chorinho-modal-overlay.open {
            display: flex;
        }

        .chorinho-modal {
            background: white;
            width: 90%;
            max-width: 400px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chorinho-panel.dark-mode .chorinho-modal {
            background: #2d333b;
            border: 1px solid #444c56;
        }

        .chorinho-modal-header {
            padding: 15px;
            border-bottom: 1px solid #e1e4e8;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: #333;
        }

        .chorinho-panel.dark-mode .chorinho-modal-header {
            border-bottom-color: #444c56;
            color: #c9d1d9;
        }

        .chorinho-modal-body {
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
        }

        .chorinho-modal-footer {
            padding: 15px;
            border-top: 1px solid #e1e4e8;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .chorinho-panel.dark-mode .chorinho-modal-footer {
            border-top-color: #444c56;
        }

        .chorinho-label-option {
            display: flex;
            align-items: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 4px;
            transition: background 0.2s;
            margin-bottom: 4px;
        }

        .chorinho-label-option:hover {
            background: #f6f8fa;
        }

        .chorinho-panel.dark-mode .chorinho-label-option:hover {
            background: #1c2128;
        }

        .chorinho-label-option input {
            margin-right: 10px;
        }

        .chorinho-label-option span {
            padding: 2px 8px;
            border-radius: 10px;
            color: white;
            font-size: 12px;
            font-weight: 600;
        }
    `;

    const Utils = {
        
        slugify(text) {
            return text
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/[^a-zA-Z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .toLowerCase();
        },

        sanitizeForFilename(text) {
            return text.replace(/\//g, '-').replace(/[\\?%*:|"<>]/g, '');
        },

        
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

        
        isTaskModalOpen() {
            return document.querySelector("#modal-container") !== null;
        },

        
        generateBranchName(number, title) {
            const slugTitle = this.slugify(title);
            return `Feature-${number}-${slugTitle}`;
        },

        
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

        
        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        },

        
        formatDate(date) {
            return new Date(date).toLocaleString('pt-BR');
        }
    };

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
                chorinho.id = chorinhos[existingIndex].id; 
                chorinhos[existingIndex] = chorinho;
            } else {
                chorinho.id = Date.now().toString(); 
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
                    objetivo: true,
                    planoDeAcaoEnabled: true,
                    solucao: true,
                    modificacoes: true,
                    fluxo: true,
                    comandos: true,
                    problemasEncontrados: true,
                    observacoes: true,
                    navegacao: true,
                    previewEnabled: false,
                    darkMode: false
                },
                labels: [
                    { id: 'label-urgent', name: 'Urgente', color: '#d73a49' },
                    { id: 'label-bug', name: 'Bug', color: '#fb8500' },
                    { id: 'label-feature', name: 'Feature', color: '#2ea44f' },
                    { id: 'label-improvement', name: 'Melhoria', color: '#0366d6' }
                ]
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

    const TemplateGenerator = {
        generate(data, config) {
            let template = '';

            const indent = (text, indentation = '\t') => (text || '').replace(/\n/g, `\n${indentation}`);

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
                    template += `   Objetivo: ${(data.objetivo || '').replace(/\n/g, '\n   ')}\n\n`;
                }
                if (config.fields.planoDeAcaoEnabled && data.planoDeAcao && data.planoDeAcao.length > 0) {
                    template += `\n## Plano de Ação:\n`;
                    data.planoDeAcao.forEach((plano) => {
                        template += `   - ${plano || '?'}\n`;
                    });
                }
                template += `\n`;
            }

            if (config.fields.solucao) {
                template += `## Solução Implementada:\n \t${indent(data.solucao)}\n\n`;
            }

            if (config.fields.modificacoes) {
                template += `## Modificações:\n \t${indent(data.modificacoes)}\n\n`;
            }

            if (config.fields.fluxo) {
                template += `## Fluxo de teste na UI:\n \t${indent(data.fluxo)}\n\n`;
            }

            if (config.fields.navegacao) {
                template += `## Navegação na UI:\n \t${indent(data.navegacao)}\n\n`;
            }

            if (config.fields.comandos) {
                template += `## Comandos para testes BANCO DE DADOS:\n \t${indent(data.comandos)}\n\n`;
            }

            if (config.fields.problemasEncontrados) {
                template += `## Problemas encontrados:\n \t${indent(data.problemasEncontrados)}\n\n`;
            }

            if (config.fields.observacoes) {
                template += `## Observações/Notas\n \t${indent(data.observacoes)}\n`;
            }

            return template;
        }
    };

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
            this.initSortable();
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
                        <button class="chorinho-tab" data-tab="history">Gerenciamento</button>
                        <button class="chorinho-tab" data-tab="config">Configurações</button>
                    </div>
                    <div id="chorinho-hidden-fields-warning" class="chorinho-alert chorinho-alert-warning" style="display: none;"></div>

                    
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

                        <div class="chorinho-section">
                            <label>${Icons.tag} Labels</label>
                            <div id="chorinho-labels-selector" class="chorinho-checkbox-group">
                                
                            </div>
                            <div id="chorinho-selected-labels" class="chorinho-labels-container" style="margin-top: 10px;">
                                
                            </div>
                        </div>

                        <div class="chorinho-section" data-field="objetivo">
                            <label>Objetivo</label>
                            <textarea class="chorinho-textarea" id="chorinho-objetivo"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="planoDeAcaoEnabled">
                            <label>Plano de Ação</label>
                            <div class="chorinho-checkbox-item" style="margin-bottom: 10px;">
                                <input type="checkbox" id="chorinho-plano-de-acao-checkboxes">
                                <label for="chorinho-plano-de-acao-checkboxes">Habilitar Checkboxes</label>
                            </div>
                            <div class="chorinho-plano-de-acao-container" id="chorinho-plano-de-acao-container">
                                <div class="chorinho-plano-de-acao-item">
                                    <input type="text" class="chorinho-input" placeholder="Plano de Ação 1" data-plano-de-acao-index="0">
                                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removePlanoDeAcao(0)">${Icons.close}</button>
                                </div>
                            </div>
                            <button class="chorinho-btn chorinho-btn-small chorinho-btn-success" onclick="chorinhoApp.addPlanoDeAcao()">${Icons.plus} Adicionar Plano de Ação</button>
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

                        <div class="chorinho-section" data-field="problemasEncontrados">
                            <label>Problemas encontrados</label>
                            <textarea class="chorinho-textarea" id="chorinho-problemas-encontrados"></textarea>
                        </div>

                        <div class="chorinho-section" data-field="observacoes">
                            <label>Observações/Notas</label>
                            <textarea class="chorinho-textarea" id="chorinho-observacoes"></textarea>
                        </div>

                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveCurrentChorinho()">${Icons.save} &nbsp;Salvar</button>
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.copyMarkdown()">${Icons.copy} Copiar Markdown</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.downloadMarkdown()">${Icons.download} Baixar .md</button>
                        </div>
                    </div>

                    
                    <div class="chorinho-tab-content" data-content="preview">
                        <div class="chorinho-section">
                            <h3>Preview do Markdown</h3>
                            <div class="chorinho-preview" id="chorinho-preview"></div>
                        </div>
                    </div>

                    
                    <div class="chorinho-tab-content" data-content="history">
                        
                        <div class="chorinho-stats" id="chorinho-stats">
                            <div class="chorinho-stat total">
                                <div class="chorinho-stat-header">${Icons.document} Total</div>
                                <span class="chorinho-stat-value" id="stat-total">0</span>
                            </div>
                            <div class="chorinho-stat active-stat">
                                <div class="chorinho-stat-header">${Icons.tag} Ativos</div>
                                <span class="chorinho-stat-value" id="stat-active">0</span>
                            </div>
                            <div class="chorinho-stat archived-stat">
                                <div class="chorinho-stat-header">${Icons.archive} Arquivados</div>
                                <span class="chorinho-stat-value" id="stat-archived">0</span>
                            </div>
                        </div>

                        
                        <div class="chorinho-history-header">
                            <div class="chorinho-filters-row">
                                <div class="chorinho-search-wrapper">
                                    <span class="chorinho-search-icon">${Icons.search}</span>
                                    <input type="text" class="chorinho-input" id="chorinho-history-search" placeholder="Pesquisar...">
                                </div>
                                <select class="chorinho-input chorinho-filter-select" id="chorinho-label-filter">
                                    <option value="">🏷️ Todas as Labels</option>
                                </select>
                                <select class="chorinho-input chorinho-filter-select" id="chorinho-sort-order">
                                    <option value="date-desc">📅 Mais recentes</option>
                                    <option value="date-asc">📅 Mais antigos</option>
                                    <option value="title-asc">🔤 Título (A-Z)</option>
                                    <option value="title-desc">🔤 Título (Z-A)</option>
                                    <option value="number-asc">🔢 Número (1-9)</option>
                                    <option value="number-desc">🔢 Número (9-1)</option>
                                </select>
                            </div>
                            <div class="chorinho-toggles-row">
                                <button class="chorinho-toggle-btn" id="btn-toggle-favorites" onclick="chorinhoApp.ui.toggleFilter('favorites')">
                                    ${Icons.star} Apenas Favoritos
                                    <input type="checkbox" id="chorinho-show-favorites">
                                </button>
                                <button class="chorinho-toggle-btn" id="btn-toggle-archived" onclick="chorinhoApp.ui.toggleFilter('archived')">
                                    ${Icons.archive} Mostrar Arquivados
                                    <input type="checkbox" id="chorinho-show-archived">
                                </button>
                            </div>
                        </div>

                        <div id="chorinho-history-list"></div>
                        <div class="chorinho-section">
                            <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.exportChorinhos()">${Icons.upload} Exportar JSON</button>
                            <button class="chorinho-btn chorinho-btn-secondary" onclick="chorinhoApp.importChorinhos()">${Icons.download} Importar JSON</button>
                            <input type="file" id="chorinho-import-file" accept=".json" style="display: none;">
                        </div>
                    </div>

                    
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
                                        <input type="checkbox" id="config-planoDeAcaoEnabled" checked>
                                        <label for="config-planoDeAcaoEnabled">Plano de Ação</label>
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
                                    <input type="checkbox" id="config-problemasEncontrados" checked>
                                    <label for="config-problemasEncontrados">Problemas encontrados</label>
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

                        
                        <div class="chorinho-label-manager">
                            <label><h3>${Icons.tag} Gerenciar Labels Personalizadas</h3></label>

                            
                            <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center;">
                                <input type="text" class="chorinho-input" id="chorinho-new-label-name" placeholder="Nome da label" style="flex: 1;">
                                <input type="color" class="chorinho-color-picker" id="chorinho-new-label-color" value="#3498db">
                                <button class="chorinho-btn chorinho-btn-success" onclick="chorinhoApp.createLabel()">${Icons.plus} Criar</button>
                            </div>

                            
                            <div id="chorinho-labels-list">
                                
                            </div>
                        </div>

                        <div class="chorinho-section">
                            <button class="chorinho-btn" onclick="chorinhoApp.saveConfig()">${Icons.save} &nbsp;Salvar Configurações</button>
                        </div>
                    </div>
                </div>

                
                <div class="chorinho-modal-overlay" id="chorinho-labels-modal">
                    <div class="chorinho-modal">
                        <div class="chorinho-modal-header">
                            <span>Gerenciar Labels</span>
                            <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" id="chorinho-labels-modal-close">${Icons.close}</button>
                        </div>
                        <div class="chorinho-modal-body" id="chorinho-labels-modal-body">
                            
                        </div>
                        <div class="chorinho-modal-footer">
                            <button class="chorinho-btn" id="chorinho-labels-modal-cancel">Cancelar</button>
                            <button class="chorinho-btn chorinho-btn-primary" id="chorinho-labels-modal-save">Salvar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(panel);
            this.panel = panel;
        }

        setupEventListeners() {
            
            this.panel.querySelector('.chorinho-close').onclick = () => this.closePanel();

            
            this.panel.querySelectorAll('.chorinho-tab').forEach(tab => {
                tab.onclick = () => this.switchTab(tab.dataset.tab);
            });

            
            this.panel.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('change', () => this.autoSaveCurrentData());
            });

            
            document.getElementById('chorinho-import-file').addEventListener('change', (e) => {
                window.chorinhoApp.handleImportFile(e);
            });

            
            document.getElementById('chorinho-history-search').addEventListener('input', () => {
                this.renderHistory();
            });

            
            document.getElementById('chorinho-copy-branch-btn').addEventListener('click', () => {
                const branchName = document.getElementById('chorinho-branch').value;
                Utils.copyToClipboard(branchName);
                this.showAlert('Nome da branch copiado para o clipboard!', 'success');
            });
            
            
            const labelsListContainer = document.getElementById('chorinho-labels-list');
            if (labelsListContainer) {
                labelsListContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('button');
                    if (!button) return;

                    const action = button.dataset.action;
                    const labelId = button.dataset.labelId;

                    if (action === 'update') {
                        chorinhoApp.updateLabel(labelId);
                    } else if (action === 'delete') {
                        chorinhoApp.deleteLabel(labelId);
                    }
                });
            }

            
            const configDescricao = document.getElementById('config-descricao');
            const subGroupDescricao = configDescricao.closest('.chorinho-checkbox-item').nextElementSibling;
            const configPlanoDeAcaoEnabled = document.getElementById('config-planoDeAcaoEnabled');
            const subGroupPlanoDeAcao = configPlanoDeAcaoEnabled.closest('.chorinho-checkbox-item').nextElementSibling;

            const toggleSubGroup = (checkbox, subGroup) => {
                if (subGroup) {
                    subGroup.style.display = checkbox.checked ? 'block' : 'none';
                }
            };

            configDescricao.addEventListener('change', () => {
                toggleSubGroup(configDescricao, subGroupDescricao);
            });

            configPlanoDeAcaoEnabled.addEventListener('change', () => {
                toggleSubGroup(configPlanoDeAcaoEnabled, subGroupPlanoDeAcao);
            });

            
            const configTab = this.panel.querySelector('.chorinho-tab[data-tab="config"]');
            configTab.addEventListener('click', () => {
                toggleSubGroup(configDescricao, subGroupDescricao);
                toggleSubGroup(configPlanoDeAcaoEnabled, subGroupPlanoDeAcao);
            });

            document.getElementById('chorinho-plano-de-acao-checkboxes').addEventListener('change', () => {
                this.refreshPlanoDeAcaoUI();
                this.autoSaveCurrentData();
            });

            
            document.getElementById('chorinho-label-filter').addEventListener('change', () => {
                this.renderHistory();
            });

            document.getElementById('chorinho-sort-order').addEventListener('change', () => {
                this.renderHistory();
            });

            document.getElementById('chorinho-show-favorites').addEventListener('change', () => {
                this.renderHistory();
            });

            document.getElementById('chorinho-show-archived').addEventListener('change', () => {
                this.renderHistory();
            });

            
            const labelModal = document.getElementById('chorinho-labels-modal');
            if (labelModal) {
                const labelModalSaveBtn = document.getElementById('chorinho-labels-modal-save');
                const labelModalCloseBtn = document.getElementById('chorinho-labels-modal-close');
                const labelModalCancelBtn = document.getElementById('chorinho-labels-modal-cancel');

                labelModalSaveBtn.addEventListener('click', () => {
                    const chorinhoId = labelModal.dataset.chorinhoId;
                    if (!chorinhoId) return;

                    const body = document.getElementById('chorinho-labels-modal-body');
                    const selectedLabels = Array.from(body.querySelectorAll('input:checked')).map(input => input.value);
                    
                    chorinhoApp.saveChorinhoLabels(chorinhoId, selectedLabels);
                    this.closeLabelSelectorModal();
                });

                labelModalCloseBtn.addEventListener('click', () => this.closeLabelSelectorModal());
                labelModalCancelBtn.addEventListener('click', () => this.closeLabelSelectorModal());
            }
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
            this.applyFieldsVisibility(); 
        }

        closePanel() {
            this.panel.classList.remove('open');
            this.isOpen = false;
        }

        switchTab(tabName) {
            this.currentTab = tabName;

            
            this.panel.querySelectorAll('.chorinho-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });

            
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

            
            if (tabName === 'history') {
                this.renderHistory();
                this.populateLabelFilter();
            }

            
            if (tabName === 'config') {
                this.loadConfig();
                this.renderLabelsManager();
            }

            
            if (tabName === 'form') {
                this.renderLabelsSelector();
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
                taskDisplay.innerText = 'Nenhuma task do Runrun.it detectada. Crie uma chorinho manualmente.'; 
                this.currentTaskNumber = ''; 
                this.currentTaskTitle = '';   
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

            
            const savedChorinhos = Storage.getSavedChorinhos();
            const taskData = savedChorinhos.find(c => c.taskNumber === taskNumber);

            if (taskData) {
                this.loadFormData(taskData);
            } else {
                this.clearForm(); 
                this.applyFieldsVisibility(); 
                
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
            document.getElementById('chorinho-problemas-encontrados').value = data.problemasEncontrados || '';
            document.getElementById('chorinho-observacoes').value = data.observacoes || '';
            document.getElementById('chorinho-plano-de-acao-checkboxes').checked = data.planoDeAcaoCheckboxes || false;

            
            const container = document.getElementById('chorinho-plano-de-acao-container');
            container.innerHTML = '';
            if (data.planoDeAcao && data.planoDeAcao.length > 0) {
                data.planoDeAcao.forEach((plano, index) => {
                    this.addPlanoDeAcaoElement(index, plano);
                });
            } else {
                this.addPlanoDeAcaoElement(0);
            }

            
            this.currentChorinho = data;
            this.renderLabelsSelector();

            this.applyFieldsVisibility();
        }

        getFormData() {
            const planoDeAcao = [];
            const showCheckboxes = document.getElementById('chorinho-plano-de-acao-checkboxes').checked;

            document.querySelectorAll('.chorinho-plano-de-acao-item').forEach(item => {
                const input = item.querySelector('input[type="text"]');
                if (input && input.value.trim()) {
                    if (showCheckboxes) {
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        const prefix = checkbox && checkbox.checked ? '[x] ' : '[ ] ';
                        planoDeAcao.push(prefix + input.value.trim());
                    } else {
                        planoDeAcao.push(input.value.trim());
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
                planoDeAcao: planoDeAcao,
                planoDeAcaoCheckboxes: document.getElementById('chorinho-plano-de-acao-checkboxes').checked,
                solucao: document.getElementById('chorinho-solucao').value,
                modificacoes: document.getElementById('chorinho-modificacoes').value,
                fluxo: document.getElementById('chorinho-fluxo').value,
                navegacao: document.getElementById('chorinho-navegacao').value,
                comandos: document.getElementById('chorinho-comandos').value,
                problemasEncontrados: document.getElementById('chorinho-problemas-encontrados').value,
                observacoes: document.getElementById('chorinho-observacoes').value,
                labels: this.getSelectedLabels(),
                archived: false,
                favorite: false
            };
        }

        getSelectedLabels() {
            const selectedLabels = [];
            document.querySelectorAll('#chorinho-labels-selector .chorinho-label-clickable.selected').forEach(badge => {
                selectedLabels.push(badge.dataset.labelId);
            });
            return selectedLabels;
        }

        autoSaveCurrentData() {
            const data = this.getFormData();
            Storage.saveCurrentData(data);
        }

        addPlanoDeAcaoElement(index, value = '') {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            const planoDeAcaoDiv = document.createElement('div');
            planoDeAcaoDiv.className = 'chorinho-plano-de-acao-item';
            const showCheckboxes = document.getElementById('chorinho-plano-de-acao-checkboxes').checked;

            const isChecked = value.startsWith('[x] ');
            const textValue = value.replace(/[[x ]]\s*/, '');

            planoDeAcaoDiv.innerHTML = `
                ${showCheckboxes ? `<input type="checkbox" class="chorinho-plano-de-acao-checkbox" id="plano-de-acao-checkbox-${index}" ${isChecked ? 'checked' : ''}>` : ''}
                <input type="text" class="chorinho-input" placeholder="Plano de Ação ${index + 1}" data-plano-de-acao-index="${index}" value="${textValue}">
                <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.removePlanoDeAcao(${index})">${Icons.close}</button>
                <span class="chorinho-drag-handle">${Icons.drag}</span>
            `;
            container.appendChild(planoDeAcaoDiv);

            if (showCheckboxes) {
                const checkbox = planoDeAcaoDiv.querySelector(`#plano-de-acao-checkbox-${index}`);
                checkbox.addEventListener('change', () => {
                    chorinhoApp.ui.autoSaveCurrentData();
                });
            }
        }

        refreshPlanoDeAcaoUI() {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            const items = container.querySelectorAll('.chorinho-plano-de-acao-item');
            const planos = [];

            items.forEach(item => {
                const input = item.querySelector('input[type="text"]');
                const checkbox = item.querySelector('input[type="checkbox"]');

                let planoString = input.value;
                if (checkbox) {
                    if (checkbox.checked) {
                        planoString = '[x] ' + planoString;
                    } else {
                        planoString = '[ ] ' + planoString;
                    }
                }
                planos.push(planoString);
            });

            container.innerHTML = '';

            if (planos.length > 0) {
                planos.forEach((plano, index) => {
                    this.addPlanoDeAcaoElement(index, plano);
                });
            } else {
                this.addPlanoDeAcaoElement(0);
            }
        }

        initSortable() {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            if (typeof Sortable !== 'undefined') {
                new Sortable(container, {
                    animation: 150,
                    ghostClass: 'chorinho-sortable-ghost',
                    handle: '.chorinho-drag-handle',
                    onEnd: () => {
                        this.reindexPlanoDeAcao();
                        this.autoSaveCurrentData();
                    }
                });
            }
        }

        reindexPlanoDeAcao() {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            const items = container.querySelectorAll('.chorinho-plano-de-acao-item');
            items.forEach((item, idx) => {
                const textInput = item.querySelector('input[type="text"]');
                if (textInput) {
                    textInput.dataset.planoDeAcaoIndex = idx;
                    textInput.placeholder = `Plano de Ação ${idx + 1}`;
                }
                const removeButton = item.querySelector('button');
                if (removeButton) {
                    removeButton.onclick = () => chorinhoApp.removePlanoDeAcao(idx);
                }
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.id = `plano-de-acao-checkbox-${idx}`;
                }
            });
        }

        renderHistory() {
            const allChorinhos = Storage.getSavedChorinhos();
            const container = document.getElementById('chorinho-history-list');
            const searchTerm = document.getElementById('chorinho-history-search').value.toLowerCase();

            const labelFilter = document.getElementById('chorinho-label-filter').value;
            const config = Storage.getConfig();

            
            const totalActive = allChorinhos.filter(c => !c.archived).length;
            const totalArchived = allChorinhos.filter(c => c.archived).length;
            document.getElementById('stat-total').textContent = allChorinhos.length;
            document.getElementById('stat-active').textContent = totalActive;
            document.getElementById('stat-archived').textContent = totalArchived;

            
            const showFavorites = document.getElementById('chorinho-show-favorites').checked;
            const showArchived = document.getElementById('chorinho-show-archived').checked;
            const sortOrder = document.getElementById('chorinho-sort-order').value;

            
            const btnFavorites = document.getElementById('btn-toggle-favorites');
            const btnArchived = document.getElementById('btn-toggle-archived');

            if (btnFavorites) {
                if (showFavorites) btnFavorites.classList.add('active');
                else btnFavorites.classList.remove('active');
            }

            if (btnArchived) {
                if (showArchived) btnArchived.classList.add('active');
                else btnArchived.classList.remove('active');
            }

            let filteredChorinhos = allChorinhos.filter(chorinho => {
                const matchesSearch = chorinho.taskNumber.toLowerCase().includes(searchTerm) ||
                    chorinho.taskTitle.toLowerCase().includes(searchTerm);
                const matchesArchived = showArchived || !chorinho.archived;
                const matchesLabel = !labelFilter || (chorinho.labels && chorinho.labels.includes(labelFilter));
                const matchesFavorite = !showFavorites || chorinho.favorite;

                return matchesSearch && matchesArchived && matchesLabel && matchesFavorite;
            });

            
            filteredChorinhos.sort((a, b) => {
                switch (sortOrder) {
                    case 'date-asc':
                        return new Date(a.savedAt) - new Date(b.savedAt);
                    case 'date-desc':
                        return new Date(b.savedAt) - new Date(a.savedAt);
                    case 'title-asc':
                        return a.taskTitle.localeCompare(b.taskTitle);
                    case 'title-desc':
                        return b.taskTitle.localeCompare(a.taskTitle);
                    case 'number-asc':
                        return parseInt(a.taskNumber) - parseInt(b.taskNumber);
                    case 'number-desc':
                        return parseInt(b.taskNumber) - parseInt(a.taskNumber);
                    default:
                        return new Date(b.savedAt) - new Date(a.savedAt);
                }
            });

            if (filteredChorinhos.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum CHORINHO encontrado.</p>';
                return;
            }

            container.innerHTML = filteredChorinhos.map(chorinho => {
                const labelsHTML = this.renderLabelsBadges(chorinho.labels || [], config.labels || []);
                const archiveClass = chorinho.archived ? 'archived' : '';
                const archiveBtn = chorinho.archived
                    ? `<button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.toggleArchive('${chorinho.id}')">${Icons.unarchive} Desarquivar</button>`
                    : `<button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.toggleArchive('${chorinho.id}')">${Icons.archive} Arquivar</button>`;
                const archivedBadge = chorinho.archived ? '<span class="chorinho-archived-badge">Arquivado</span>' : '';
                const favoriteIcon = chorinho.favorite ? Icons.starFill : Icons.star;
                const favoriteBtn = `<button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.toggleFavorite('${chorinho.id}')" style="color: ${chorinho.favorite ? '#fbbf24' : 'inherit'};">${favoriteIcon}</button>`;

                return `
                <div class="chorinho-history-item ${archiveClass}">
                    <h4>${chorinho.favorite ? '⭐ ' : ''}${chorinho.taskNumber} - ${chorinho.taskTitle} ${archivedBadge}</h4>
                    ${labelsHTML ? `<div style="margin: 8px 0;">${labelsHTML}</div>` : ''}
                    <p>Salvo em: ${Utils.formatDate(chorinho.savedAt)}</p>
                    ${favoriteBtn}
                    <button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.openChorinho('${chorinho.id}')">${Icons.folder} Abrir</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-secondary" onclick="window.open('https://runrun.it/pt-BR/tasks/${chorinho.taskNumber}', '_blank')">${Icons.link} Task</button>
                    <button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.editChorinhoLabels('${chorinho.id}')">${Icons.tag} Labels</button>
                    <button class="chorinho-btn chorinho-btn-small" onclick="chorinhoApp.duplicateChorinho('${chorinho.id}')">${Icons.duplicate} Duplicar</button>
                    ${archiveBtn}
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" onclick="chorinhoApp.deleteChorinho('${chorinho.id}')">${Icons.trash} Excluir</button>
                </div>
            `;
            }).join('');
        }

        renderLabelsBadges(labelIds, availableLabels) {
            if (!labelIds || labelIds.length === 0) return '';
            return labelIds.map(labelId => {
                const label = availableLabels.find(l => l.id === labelId);
                if (!label) return '';
                return `<span class="chorinho-label" style="background-color: ${label.color};">${label.name}</span>`;
            }).join('');
        }

        populateLabelFilter() {
            const config = Storage.getConfig();
            const select = document.getElementById('chorinho-label-filter');
            const currentValue = select.value;
            select.innerHTML = '<option value="">🏷️ Todas as Labels</option>';
            if (config.labels) {
                config.labels.forEach(label => {
                    const option = document.createElement('option');
                    option.value = label.id;
                    option.textContent = label.name;
                    select.appendChild(option);
                });
            }
            select.value = currentValue;
        }

        renderLabelsSelector() {
            const config = Storage.getConfig();
            const container = document.getElementById('chorinho-labels-selector');
            const selectedLabelsContainer = document.getElementById('chorinho-selected-labels');

            if (!config.labels || config.labels.length === 0) {
                container.innerHTML = '<p style="color: #999; font-size: 12px;">Nenhuma label disponível. Crie labels nas configurações.</p>';
                selectedLabelsContainer.innerHTML = ''; 
                return;
            }

            
            const currentData = this.currentChorinho || {};
            const selectedLabels = currentData.labels || [];
            selectedLabelsContainer.innerHTML = this.renderLabelsBadges(selectedLabels, config.labels);

            
            container.innerHTML = `
                <button type="button" class="chorinho-btn chorinho-btn-sm" id="chorinho-open-labels-modal-btn">${Icons.tag} Selecionar Labels</button>
            `;

            
            document.getElementById('chorinho-open-labels-modal-btn').onclick = () => {
                const chorinhoId = this.currentChorinho ? this.currentChorinho.id : null;
                const initialSelectedLabels = this.currentChorinho ? this.currentChorinho.labels : [];
                chorinhoApp.ui.showLabelSelectorModal(chorinhoId, initialSelectedLabels);
            };
        }

        toggleLabelSelection(labelId) {
            const badge = document.querySelector(`[data-label-id="${labelId}"]`);
            if (!badge) return;

            badge.classList.toggle('selected');
            this.updateSelectedLabelsBadges();
            this.autoSaveCurrentData();
        }

        updateSelectedLabelsBadges() {
            const config = Storage.getConfig();
            const container = document.getElementById('chorinho-selected-labels');
            const selectedLabels = this.getSelectedLabels();

            if (selectedLabels.length === 0) {
                container.innerHTML = '';
                return;
            }

            container.innerHTML = selectedLabels.map(labelId => {
                const label = config.labels.find(l => l.id === labelId);
                if (!label) return '';
                return `<span class="chorinho-label" style="background-color: ${label.color};">${label.name}</span>`;
            }).join('');
        }

        renderLabelsManager() {
            const config = Storage.getConfig();
            const container = document.getElementById('chorinho-labels-list');

            if (!config.labels || config.labels.length === 0) {
                container.innerHTML = '<p style="color: #999;">Nenhuma label criada ainda.</p>';
                return;
            }

            container.innerHTML = config.labels.map(label => `
                <div class="chorinho-label-item">
                    <span class="chorinho-label-preview" style="background-color: ${label.color};">${label.name}</span>
                    <input type="text" class="chorinho-input" value="${label.name}" id="edit-label-name-${label.id}" style="flex: 1;">
                    <input type="color" class="chorinho-color-picker" value="${label.color}" id="edit-label-color-${label.id}">
                    <button class="chorinho-btn chorinho-btn-small" data-action="update" data-label-id="${label.id}">${Icons.edit} Salvar</button>
                    <button class="chorinho-btn chorinho-btn-small chorinho-btn-danger" data-action="delete" data-label-id="${label.id}">${Icons.trash}</button>
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
            document.getElementById('config-planoDeAcaoEnabled').checked = config.fields.planoDeAcaoEnabled;
            document.getElementById('config-solucao').checked = config.fields.solucao;
            document.getElementById('config-modificacoes').checked = config.fields.modificacoes;
            document.getElementById('config-fluxo').checked = config.fields.fluxo;
            document.getElementById('config-comandos').checked = config.fields.comandos;
            document.getElementById('config-problemasEncontrados').checked = config.fields.problemasEncontrados;
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
            document.getElementById('chorinho-problemas-encontrados').value = '';
            document.getElementById('chorinho-observacoes').value = '';

            const container = document.getElementById('chorinho-plano-de-acao-container');
            container.innerHTML = '';
            this.addPlanoDeAcaoElement(0); 
        }

        applyFieldsVisibility() {
            const config = Storage.getConfig();
            const data = this.getFormData(); 
            const hiddenFieldsWithValue = [];

            const fieldDisplayNames = {
                sistema: 'Sistema',
                mr: 'MR',
                branch: 'Branch',
                descricao: 'Descrição',
                objetivo: 'Objetivo',
                planoDeAcaoEnabled: 'Plano de Ação',
                solucao: 'Solução Implementada',
                modificacoes: 'Modificações',
                fluxo: 'Fluxo de teste na UI',
                comandos: 'Comandos para testes BANCO DE DADOS',
                problemasEncontrados: 'Problemas encontrados',
                observacoes: 'Observações/Notas',
                navegacao: 'Navegação na UI'
            };

            const configurableFields = Object.keys(fieldDisplayNames);

            configurableFields.forEach(field => {
                const elements = this.panel.querySelectorAll(`[data-field="${field}"]`);
                elements.forEach(el => {
                    let isVisible = config.fields[field] === undefined ? true : config.fields[field];

                    
                    if (field === 'objetivo' || field === 'planoDeAcaoEnabled') {
                        if (!config.fields.descricao) {
                            isVisible = false;
                        }
                    }

                    el.style.display = isVisible ? 'block' : 'none';

                    if (!isVisible) {
                        let fieldValue = data[field];
                        if (field === 'planoDeAcaoEnabled') {
                            fieldValue = data.planoDeAcao;
                        }

                        if (fieldValue && fieldValue.length > 0) {
                            const displayName = fieldDisplayNames[field];
                            if (!hiddenFieldsWithValue.includes(displayName)) {
                                hiddenFieldsWithValue.push(displayName);
                            }
                        }
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

        toggleFilter(type) {
            const btnId = type === 'favorites' ? 'btn-toggle-favorites' : 'btn-toggle-archived';
            const checkboxId = type === 'favorites' ? 'chorinho-show-favorites' : 'chorinho-show-archived';

            const btn = document.getElementById(btnId);
            const checkbox = document.getElementById(checkboxId);

            if (btn && checkbox) {
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }

                
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            }
        }

        showLabelSelectorModal(chorinhoId, currentLabels = []) {
            const modal = document.getElementById('chorinho-labels-modal');
            const body = document.getElementById('chorinho-labels-modal-body');
            const config = Storage.getConfig();

            if (!config.labels || config.labels.length === 0) {
                alert('Nenhuma label disponível. Crie labels nas configurações primeiro.');
                return;
            }

            modal.dataset.chorinhoId = chorinhoId; 

            body.innerHTML = '';
            config.labels.forEach(label => {
                const isChecked = currentLabels.includes(label.id);
                const option = document.createElement('label');
                option.className = 'chorinho-label-option';
                option.innerHTML = `
                    <input type="checkbox" value="${label.id}" ${isChecked ? 'checked' : ''}>
                    <span style="background-color: ${label.color}">${label.name}</span>
                `;
                body.appendChild(option);
            });

            modal.classList.add('open');
        }

        closeLabelSelectorModal() {
            const modal = document.getElementById('chorinho-labels-modal');
            modal.classList.remove('open');
        }
    }

    class ChorinhoApp {
        constructor() {
            this.ui = new ChorinhoUI();
        }

        addPlanoDeAcao() {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            const currentCount = container.querySelectorAll('.chorinho-plano-de-acao-item').length;
            this.ui.addPlanoDeAcaoElement(currentCount);
        }

        removePlanoDeAcao(index) {
            const container = document.getElementById('chorinho-plano-de-acao-container');
            const items = container.querySelectorAll('.chorinho-plano-de-acao-item');
            if (items.length > 1) {
                items[index].remove();
                this.ui.reindexPlanoDeAcao();
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

        editChorinhoLabels(chorinhoId) {
            const chorinhos = Storage.getSavedChorinhos();
            const chorinho = chorinhos.find(c => c.id === chorinhoId);
            if (chorinho) {
                this.ui.showLabelSelectorModal(chorinhoId, chorinho.labels || []);
            }
        }

        saveChorinhoLabels(chorinhoId, newLabels) {
            if (chorinhoId) { 
                const chorinhos = Storage.getSavedChorinhos();
                const chorinhoIndex = chorinhos.findIndex(c => c.id === chorinhoId);

                if (chorinhoIndex >= 0) {
                    chorinhos[chorinhoIndex].labels = newLabels;
                    Storage.set(Storage.KEYS.CHORINHOS, chorinhos);
                    this.ui.renderHistory();
                    this.ui.showAlert('Labels atualizadas com sucesso!', 'success');
                }
            } else { 
                if (this.ui.currentChorinho) {
                    this.ui.currentChorinho.labels = newLabels;
                    this.ui.showAlert('Labels selecionadas para o formulário!', 'success');
                } else {
                    
                    
                    this.ui.showAlert('Erro: Não foi possível aplicar as labels. Nenhum CHORINHO ativo no formulário.', 'error');
                }
            }
            this.ui.renderLabelsSelector(); 
        }

        saveConfig() {
            const currentConfig = Storage.getConfig();
            const config = {
                ...currentConfig,
                fields: {
                    sistema: document.getElementById('config-sistema').checked,
                    mr: document.getElementById('config-mr').checked,
                    branch: document.getElementById('config-branch').checked,
                    descricao: document.getElementById('config-descricao').checked,
                    objetivo: document.getElementById('config-objetivo').checked,
                    planoDeAcaoEnabled: document.getElementById('config-planoDeAcaoEnabled').checked,
                    solucao: document.getElementById('config-solucao').checked,
                    modificacoes: document.getElementById('config-modificacoes').checked,
                    fluxo: document.getElementById('config-fluxo').checked,
                    comandos: document.getElementById('config-comandos').checked,
                    problemasEncontrados: document.getElementById('config-problemasEncontrados').checked,
                    observacoes: document.getElementById('config-observacoes').checked,
                    navegacao: document.getElementById('config-navegacao').checked,
                    darkMode: document.getElementById('config-darkMode').checked
                }
            };

            Storage.saveConfig(config);
            this.ui.applyFieldsVisibility();
            this.ui.applyDarkMode();
            this.ui.refreshPlanoDeAcaoUI();
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
                        
                        if (!importedChorinho.taskNumber || !importedChorinho.id) {
                            console.warn('Chorinho importado ignorado por falta de taskNumber ou id:', importedChorinho);
                            return; 
                        }

                        const existingIndex = currentChorinhos.findIndex(c => c.id === importedChorinho.id);

                        if (existingIndex >= 0) {
                            
                            currentChorinhos[existingIndex] = importedChorinho;
                        } else {
                            
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

        createLabel() {
            const name = document.getElementById('chorinho-new-label-name').value.trim();
            const color = document.getElementById('chorinho-new-label-color').value;

            if (!name) {
                this.ui.showAlert('Digite um nome para a label.', 'error');
                return;
            }

            const config = Storage.getConfig();
            if (!config.labels) {
                config.labels = [];
            }

            const newLabel = {
                id: Date.now().toString(),
                name: name,
                color: color
            };

            config.labels.push(newLabel);
            Storage.saveConfig(config);

            document.getElementById('chorinho-new-label-name').value = '';
            document.getElementById('chorinho-new-label-color').value = '#3498db';

            this.ui.renderLabelsManager();
            this.ui.showAlert('Label criada com sucesso!', 'success');
        }

        updateLabel(labelId) {
            const config = Storage.getConfig();
            const label = config.labels.find(l => l.id === labelId);

            if (!label) {
                this.ui.showAlert('Label não encontrada.', 'error');
                return;
            }

            const newName = document.getElementById(`edit-label-name-${labelId}`).value.trim();
            const newColor = document.getElementById(`edit-label-color-${labelId}`).value;

            if (!newName) {
                this.ui.showAlert('O nome da label não pode estar vazio.', 'error');
                return;
            }

            label.name = newName;
            label.color = newColor;

            Storage.saveConfig(config);
            this.ui.renderLabelsManager();
            this.ui.showAlert('Label atualizada com sucesso!', 'success');
        }

        deleteLabel(labelId) {
            if (!confirm('Tem certeza que deseja excluir esta label?')) {
                return;
            }

            const config = Storage.getConfig();
            config.labels = config.labels.filter(l => l.id !== labelId);
            Storage.saveConfig(config);

            
            const chorinhos = Storage.getSavedChorinhos();
            chorinhos.forEach(chorinho => {
                if (chorinho.labels) {
                    chorinho.labels = chorinho.labels.filter(id => id !== labelId);
                }
            });
            Storage.set(Storage.KEYS.CHORINHOS, chorinhos);

            this.ui.renderLabelsManager();
            this.ui.showAlert('Label excluída com sucesso!', 'success');
        }

        toggleArchive(chorinhoId) {
            const chorinhos = Storage.getSavedChorinhos();
            const chorinho = chorinhos.find(c => c.id === chorinhoId);

            if (!chorinho) {
                this.ui.showAlert('Chorinho não encontrado.', 'error');
                return;
            }

            chorinho.archived = !chorinho.archived;
            Storage.set(Storage.KEYS.CHORINHOS, chorinhos);

            this.ui.renderHistory();
            const message = chorinho.archived ? 'Chorinho arquivado!' : 'Chorinho desarquivado!';
            this.ui.showAlert(message, 'success');
        }

        toggleFavorite(chorinhoId) {
            const chorinhos = Storage.getSavedChorinhos();
            const chorinho = chorinhos.find(c => c.id === chorinhoId);

            if (!chorinho) return;

            chorinho.favorite = !chorinho.favorite;
            Storage.set(Storage.KEYS.CHORINHOS, chorinhos);
            this.ui.renderHistory();
        }

        duplicateChorinho(chorinhoId) {
            const chorinhos = Storage.getSavedChorinhos();
            const originalChorinho = chorinhos.find(c => c.id === chorinhoId);

            if (!originalChorinho) return;

            const newChorinho = { ...originalChorinho };
            newChorinho.id = Date.now().toString();
            newChorinho.savedAt = new Date().toISOString();
            newChorinho.taskTitle = `${newChorinho.taskTitle} (Cópia)`;
            newChorinho.favorite = false; 
            newChorinho.archived = false; 

            chorinhos.unshift(newChorinho);
            Storage.set(Storage.KEYS.CHORINHOS, chorinhos);

            this.ui.renderHistory();
            this.ui.showAlert('Chorinho duplicado com sucesso!', 'success');
        }
    }

    
    
    function init() {
        window.chorinhoApp = new ChorinhoApp();
        console.log('CHORINHO inicializado com sucesso!');
    }

    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();