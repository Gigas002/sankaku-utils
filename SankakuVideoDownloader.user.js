// ==UserScript==
// @name         Sankaku Video Downloader
// @namespace    ViolentMonkeyScripts
// @version      1.2
// @description  Adds a download button to Sankaku video posts and starts a file download when clicked, preserving the original filename
// @author       You
// @match        https://sankaku.app/posts/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function waitForVideoAndAddButton() {
    const video = document.querySelector('video.video-react-video');
    if (!video) {
      setTimeout(waitForVideoAndAddButton, 1000);
      return;
    }

    const source = video.querySelector('source');
    if (!source || !source.src) return;

    // Prevent duplicate buttons
    if (document.getElementById('sankaku-download-btn')) return;

    // Create download button
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'sankaku-download-btn';
    downloadBtn.textContent = '⬇ Download Video';
    downloadBtn.style.position = 'fixed';
    downloadBtn.style.bottom = '20px';
    downloadBtn.style.right = '20px';
    downloadBtn.style.backgroundColor = '#ff5555';
    downloadBtn.style.color = 'white';
    downloadBtn.style.padding = '10px 15px';
    downloadBtn.style.borderRadius = '8px';
    downloadBtn.style.fontWeight = 'bold';
    downloadBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    downloadBtn.style.zIndex = 9999;
    downloadBtn.style.border = 'none';
    downloadBtn.style.cursor = 'pointer';

    downloadBtn.addEventListener('click', function (e) {
      e.preventDefault();
      downloadBtn.textContent = 'Downloading...';

      // Fetch the video as a blob
      fetch(source.src)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          // Extract filename from URL (before the query parameters)
          const fileName = source.src.split('?')[0].split('/').pop();
          // Create a temporary URL for the blob
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          // Revoke the object URL after a delay
          setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
          downloadBtn.textContent = '⬇ Download Video';
        })
        .catch(error => {
          console.error('Download error:', error);
          downloadBtn.textContent = '⬇ Download Video';
        });
    });

    document.body.appendChild(downloadBtn);
  }

  window.addEventListener('load', waitForVideoAndAddButton);
})();
