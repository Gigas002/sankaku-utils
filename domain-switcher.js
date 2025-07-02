// ==UserScript==
// @name         Sankaku Domain Switcher
// @namespace    ViolentMonkeyScripts
// @version      1.0
// @description  Adds a domain switcher to all posts. Works with site navigation (SPA).
// @author       gigas002
// @match        https://*.sankakucomplex.com/*
// @match        https://*.sankaku.app/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const domains = [
        'sankaku.app',
        'sankakucomplex.com',
        'chan.sankakucomplex.com'
    ];

    const switcherButtonHTML = `
        <button id="sankaku-domain-switcher-button" class="MuiButtonBase-root MuiIconButton-root" title="Open on another domain">
            <img class="MuiSvgIcon-root" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAzMiAzMiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuMDAwMDAwLCAtNjcxLjAwMDAwMCkiIGZpbGw9IiMwMDAwMDAiPjxwYXRoIGQ9Ik0yMzEuNTk2LDY5NC44MjkgQzIyOS42ODEsNjk0LjE5MiAyMjcuNjIyLDY5My43MTYgMjI1LjQ1NSw2OTMuNDA4IEMyMjUuNzUsNjkxLjY3NSAyMjUuOTA3LDY4OS44NTkgMjI1Ljk1Nyw2ODggTDIzMy45NjIsNjg4IEMyMzMuNzgzLDY5MC41MjEgMjMyLjkzNiw2OTIuODU0IDIzMS41OTYsNjk0LjgyOSBMMjMxLjU5Niw2OTQuODI5IFogTTIyMy40MzQsNzAwLjU1OSBDMjI0LjEsNjk4Ljk1IDIyNC42NDUsNjk3LjIxMSAyMjUuMDY0LDY5NS4zNzkgQzIyNi44NjIsNjk1LjY0NSAyMjguNTg2LDY5Ni4wMzggMjMwLjIxOSw2OTYuNTU0IEMyMjguNDE1LDY5OC40NzcgMjI2LjA3Myw2OTkuODkyIDIyMy40MzQsNzAwLjU1OSBMMjIzLjQzNCw3MDAuNTU5IFogTTIyMC45NzEsNzAwLjk1MSBDMjIwLjY0OSw3MDAuOTc0IDIyMC4zMjgsNzAxIDIyMCw3MDEgQzIxOS42NzIsNzAxIDIxOS4zNTIsNzAwLjk3NCAyMTkuMDI5LDcwMC45NTEgQzIxOC4xNzgsNjk5LjE3OSAyMTcuNDg5LDY5Ny4yMDcgMjE2Ljk3OSw2OTUuMTE0IEMyMTcuOTczLDY5NS4wMjcgMjE4Ljk4LDY5NC45NzYgMjIwLDY5NC45NzYgQzIyMS4wMiw2OTQuOTc2IDIyMi4wMjcsNjk1LjAyNyAyMjMuMDIyLDY5NS4xMTQgQzIyMi41MTEsNjk3LjIwNyAyMjEuODIyLDY5OS4xNzkgMjIwLjk3MSw3MDAuOTUxIEwyMjAuOTcxLDcwMC45NTEgWiBNMjA5Ljc4MSw2OTYuNTU0IEMyMTEuNDE0LDY5Ni4wMzggMjEzLjEzOCw2OTUuNjQ1IDIxNC45MzYsNjk1LjM3OSBDMjE1LjM1NSw2OTcuMjExIDIxNS45LDY5OC45NSAyMTYuNTY2LDcwMC41NTkgQzIxMy45MjcsNjk5Ljg5MiAyMTEuNTg2LDY5OC40NzcgMjA5Ljc4MSw2OTYuNTU0IEwyMDkuNzgxLDY5Ni41NTQgWiBNMjA4LjQwNCw2OTQuODI5IEMyMDcuMDY0LDY5Mi44NTQgMjA2LjIxNyw2OTAuNTIxIDIwNi4wMzgsNjg4IEwyMTQuMDQzLDY4OCBDMjE0LjA5Myw2ODkuODU5IDIxNC4yNSw2OTEuNjc1IDIxNC41NDUsNjkzLjQwOCBDMjEyLjM3OCw2OTMuNzE2IDIxMC4zMTksNjk0LjE5MiAyMDguNDA0LDY5NC44MjkgTDIwOC40MDQsNjk0LjgyOSBaIE0yMDguNDA0LDY3OS4xNzEgQzIxMC4zMTksNjc5LjgwOCAyMTIuMzc4LDY4MC4yODUgMjE0LjU0NSw2ODAuNTkyIEMyMTQuMjUsNjgyLjMyNSAyMTQuMDkzLDY4NC4xNDEgMjE0LjA0Myw2ODYgTDIwNi4wMzgsNjg2IEMyMDYuMjE3LDY4My40NzkgMjA3LjA2NCw2ODEuMTQ2IDIwOC40MDQsNjc5LjE3MSBMMjA4LjQwNCw2NzkuMTcxIFogTTIxNi41NjYsNjczLjQ0MSBDMjE1LjksNjc1LjA1IDIxNS4zNTUsNjc2Ljc4OSAyMTQuOTM2LDY3OC42MjEgQzIxMy4xMzgsNjc4LjM1NiAyMTEuNDE0LDY3Ny45NjIgMjA5Ljc4MSw2NzcuNDQ2IEMyMTEuNTg2LDY3NS41MjMgMjEzLjkyNyw2NzQuMTA4IDIxNi41NjYsNjczLjQ0MSBMMjE2LjU2Niw2NzMuNDQxIFogTTIxOS4wMjksNjczLjA0OSBDMjE5LjM1Miw2NzMuMDI3IDIxOS42NzIsNjczIDIyMCw2NzMgQzIyMC4zMjgsNjczIDIyMC42NDksNjczLjAyNyAyMjAuOTcxLDY3My4wNDkgQzIyMS44MjIsNjc0LjgyMSAyMjIuNTExLDY3Ni43OTQgMjIzLjAyMiw2NzguODg2IEMyMjIuMDI3LDY3OC45NzMgMjIxLjAyLDY3OS4wMjQgMjIwLDY3OS4wMjQgQzIxOC45OCw2NzkuMDI0IDIxNy45NzMsNjc4Ljk3MyAyMTYuOTc5LDY3OC44ODYgQzIxNy40ODksNjc2Ljc5NCAyMTguMTc4LDY3NC44MjEgMjE5LjAyOSw2NzMuMDQ5IEwyMTkuMDI5LDY3My4wNDkgWiBNMjIzLjk1NCw2ODggQzIyMy45LDY4OS43NjEgMjIzLjc0LDY5MS40OTMgMjIzLjQzOSw2OTMuMTU2IEMyMjIuMzEzLDY5My4wNTggMjIxLjE2OCw2OTMgMjIwLDY5MyBDMjE4LjgzMiw2OTMgMjE3LjY4Nyw2OTMuMDU4IDIxNi41NjIsNjkzLjE1NiBDMjE2LjI2LDY5MS40OTMgMjE2LjEsNjg5Ljc2MSAyMTYuMDQ3LDY4OCBMMjIzLjk1NCw2ODggTDIyMy45NTQsNjg4IFogTTIxNi4wNDcsNjg2IEMyMTYuMSw2ODQuMjM5IDIxNi4yNiw2ODIuNTA3IDIxNi41NjIsNjgwLjg0NCBDMjE3LjY4Nyw2ODAuOTQyIDIxOC44MzIsNjgxIDIyMCw2ODEgQzIyMS4xNjgsNjgxIDIyMi4zMTMsNjgwLjk0MiAyMjMuNDM4LDY4MC44NDQgQzIyMy43NCw2ODIuNTA3IDIyMy45LDY4NC4yMzkgMjIzLjk1NCw2ODYgTDIxNi4wNDcsNjg2IEwyMTYuMDQ3LDY4NiBaIE0yMzAuMjE5LDY3Ny40NDYgQzIyOC41ODYsNjc3Ljk2MiAyMjYuODYyLDY3OC4zNTYgMjI1LjA2NCw2NzguNjIxIEMyMjQuNjQ1LDY3Ni43ODkgMjI0LjEsNjc1LjA1IDIyMy40MzQsNjczLjQ0MSBDMjI2LjA3Myw2NzQuMTA4IDIyOC40MTUsNjc1LjUyMyAyMzAuMjE5LDY3Ny40NDYgTDIzMC4yMTksNjc3LjQ0NiBaIE0yMzEuNTk2LDY3OS4xNzEgQzIzMi45MzYsNjgxLjE0NiAyMzMuNzgzLDY4My40NzkgMjMzLjk2Miw2ODYgTDIyNS45NTcsNjg2IEMyMjUuOTA3LDY4NC4xNDEgMjI1Ljc1LDY4Mi4zMjUgMjI1LjQ1NSw2ODAuNTkyIEMyMjcuNjIyLDY4MC4yODUgMjI5LjY4MSw2NzkuODA4IDIzMS41OTYsNjc5LjE3MSBMMjMxLjU5Niw2NzkuMTcxIFogTTIyMCw2NzEgQzIxMS4xNjQsNjcxIDIwNCw2NzguMTYzIDIwNCw2ODcgQzIwNCw2OTUuODM3IDIxMS4xNjQsNzAzIDIyMCw3MDMgQzIyOC44MzYsNzAzIDIzNiw2OTUuODM3IDIzNiw2ODcgQzIzNiw2NzguMTYzIDIyOC44MzYsNjcxIDIyMCw2NzEgTDIyMCw2NzEgWiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" style="filter: invert(1);" style="width: 24px; height: 24px;">
        </button>
    `;

    GM_addStyle(`
        #sankaku-domain-switcher-popup {
            position: absolute;
            top: 50px;
            right: 10px;
            background-color: #2e2e2e;
            border: 1px solid #555;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            z-index: 9999;
            padding: 5px 0;
        }
        #sankaku-domain-switcher-popup a {
            display: block;
            padding: 8px 16px;
            color: white;
            text-decoration: none;
            font-family: sans-serif;
            font-size: 14px;
            white-space: nowrap;
        }
        #sankaku-domain-switcher-popup a:hover {
            background-color: #4a4a4a;
        }
    `);

    function manageCustomButtons() {
        const isPostPage = window.location.pathname.includes('/posts/');
        const switcherButton = document.getElementById('sankaku-domain-switcher-button');

        if (!isPostPage) {
            if (switcherButton) switcherButton.remove();
            const popup = document.getElementById('sankaku-domain-switcher-popup');
            if (popup) popup.remove();
            return;
        }

        if (!switcherButton) {
            const targetDiv = document.querySelector('.MuiToolbar-root > div:has(.MuiGrid-container)');
            if (!targetDiv) return;

            const switcherTemp = document.createElement('div');
            switcherTemp.innerHTML = switcherButtonHTML.trim();
            const newSwitcherButton = switcherTemp.firstChild;
            targetDiv.insertAdjacentElement('afterend', newSwitcherButton);

            const popup = createSwitcherPopup();
            newSwitcherButton.addEventListener('click', (e) => {
                e.stopPropagation();
                popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
            });
        }

        const currentSwitcherButton = document.getElementById('sankaku-domain-switcher-button');
    }

    function createSwitcherPopup() {
        const existingPopup = document.getElementById('sankaku-domain-switcher-popup');
        if (existingPopup) existingPopup.remove();

        const popup = document.createElement('div');
        popup.id = 'sankaku-domain-switcher-popup';
        popup.style.display = 'none';

        const currentPath = window.location.pathname + window.location.search;

        domains.forEach(domain => {
            const link = document.createElement('a');
            link.href = `https://${domain}${currentPath}`;
            link.textContent = domain;
            link.target = '_blank';
            popup.appendChild(link);
        });

        document.body.appendChild(popup);
        return popup;
    }

    document.addEventListener('click', () => {
        const popup = document.getElementById('sankaku-domain-switcher-popup');
        if (popup) {
            popup.style.display = 'none';
        }
    });

    const observer = new MutationObserver(manageCustomButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    manageCustomButtons();

})();
