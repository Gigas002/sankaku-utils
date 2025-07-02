// ==UserScript==
// @name         Sankaku Video Downloader
// @namespace    ViolentMonkeyScripts
// @version      1.0
// @description  Adds a download button for videos on Sankaku. Works with site navigation (SPA).
// @author       gigas002
// @match        https://*.sankakucomplex.com/*
// @match        https://*.sankaku.app/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const buttonHTML = `
        <button id="main-sankaku-download-button" class="MuiButtonBase-root MuiIconButton-root" title="Download Page">
            <img class="MuiSvgIcon-root" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPGcgaWQ9IkludGVyZmFjZSAvIERvd25sb2FkIj4NCjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik02IDIxSDE4TTEyIDNWMTdNMTIgMTdMMTcgMTJNMTIgMTdMNyAxMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9nPg0KPC9zdmc+" style="filter: invert(1); width: 24px; height: 24px;">
        </button>
    `;

    function updateDownloadButtonState() {
        const videoPlayer = document.querySelector('video.video-react-video');
        const existingButton = document.getElementById('main-sankaku-download-button');

        if (videoPlayer && !existingButton) {
            const targetDiv = document.querySelector('.MuiToolbar-root > div:has(.MuiGrid-container)');
            if (!targetDiv) {
                return;
            }

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = buttonHTML.trim();
            const button = tempDiv.firstChild;

            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const videoSource = document.querySelector('video.video-react-video source');
                if (!videoSource || !videoSource.src) {
                    console.error('Sankaku Downloader: Unable to find video source');
                    alert('Unable to find video source');
                    return;
                }

                const videoUrl = videoSource.src;
                const fileName = new URL(videoUrl).pathname.split('/').pop().split('?')[0] || 'video.mp4';

                try {
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.title = 'Downloading...';

                    const response = await fetch(videoUrl);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const blob = await response.blob();

                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                } catch (error) {
                    console.error('Sankaku Downloader: Downloader error', error);
                    alert('Downloader error');
                } finally {
                    button.disabled = false;
                    button.style.opacity = '1';
                    button.title = 'Download Page';
                }
            });

            targetDiv.insertAdjacentElement('afterend', button);
        }
        else if (!videoPlayer && existingButton) {
            existingButton.remove();
        }
    }

    const observer = new MutationObserver(() => {
        updateDownloadButtonState();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    updateDownloadButtonState();

})();
