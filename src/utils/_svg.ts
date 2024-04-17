export default function getSvg(
  title: string,
  author: string,
  pfp: string
): string {
  const svg = `
 <svg width="331" height="186" viewBox="0 0 331 186" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .author {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .text {
      font: 12px Helvetica;
      color: #646D7A;
      height: 430px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      max-width: 300px;
      margin-top: 20px;
    }

    .displayName {
      font: 600 16px;
      font-family: monospace;
      color: #FFFFFF;
      margin-left: 6px;
    }
  </style>
  <rect x="1" y="1" width="329" height="184" rx="7" fill="#0E0E10" />
  <rect x="1" y="1" width="329" height="184" rx="7" stroke="url(#paint0_linear_1_2)" stroke-width="2" />
  <foreignObject x="16" y="16" width="1040" height="480">
    <div class="author" xmlns="http://www.w3.org/1999/xhtml">
      <img src="${pfp}" alt="pfp" style="width: 24px; height: 24px; border-radius: 50%; object-fit: contain;" />
      <div class="displayName" xmlns="http://www.w3.org/1999/xhtml">
        ${author}
      </div>
    </div>

    <div class="text" xmlns="http://www.w3.org/1999/xhtml">
     ${title}
    </div>
  </foreignObject>
  <defs>
    <linearGradient id="paint0_linear_1_2" x1="165.5" y1="0" x2="165.5" y2="186" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7F7F7F" />
      <stop offset="1" stop-color="#303030" stop-opacity="0" />
    </linearGradient>
    <clipPath id="clip0_1_2">
      <rect width="26" height="16.6111" fill="white" transform="translate(287 20)" />
    </clipPath>
  </defs>
</svg>
  `;

  return svg;
}
