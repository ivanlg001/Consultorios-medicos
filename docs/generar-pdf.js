/**
 * Genera HTML + PDF desde Documentacion-Tecnica-Consultorios-Medicos.md
 * Uso: node docs/generar-pdf.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MD_FILE = path.join(__dirname, 'Documentacion-Tecnica-Consultorios-Medicos.md');
const HTML_FILE = path.join(__dirname, 'Documentacion-Tecnica-Consultorios-Medicos.html');
const PDF_FILE = path.join(__dirname, 'Documentacion-Tecnica-Consultorios-Medicos.pdf');

function ensureMarked() {
  try {
    return require('marked');
  } catch {
    console.log('Instalando marked...');
    execSync('npm install marked --no-save', { cwd: ROOT, stdio: 'inherit' });
    return require('marked');
  }
}

function buildHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Consultorios Médicos — Documentación Técnica</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #1a1a18;
      max-width: 210mm;
      margin: 0 auto;
      padding: 12mm 0;
    }
    .cover {
      text-align: center;
      padding: 40mm 0 30mm;
      page-break-after: always;
    }
    .cover h1 { font-size: 22pt; color: #1a4d3a; margin-bottom: 0.5em; }
    .cover p { color: #6b6b68; font-size: 11pt; }
    .cover .meta { margin-top: 2em; font-size: 10pt; }
    h1 { font-size: 16pt; color: #1a4d3a; border-bottom: 2px solid #c0ddd0; padding-bottom: 0.3em; margin-top: 1.4em; page-break-after: avoid; }
    h2 { font-size: 13pt; color: #0f6e56; margin-top: 1.2em; page-break-after: avoid; }
    h3 { font-size: 11pt; margin-top: 1em; page-break-after: avoid; }
    p, li { orphans: 3; widows: 3; }
    code, pre { font-family: Consolas, 'Courier New', monospace; font-size: 9pt; }
    pre {
      background: #f3f3f0;
      border: 1px solid #e8e8e3;
      border-radius: 6px;
      padding: 0.75em 1em;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      page-break-inside: avoid;
    }
    :not(pre) > code { background: #eef7f2; padding: 0.1em 0.35em; border-radius: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 0.8em 0; font-size: 9.5pt; page-break-inside: avoid; }
    th, td { border: 1px solid #e8e8e3; padding: 0.4em 0.6em; text-align: left; }
    th { background: #eef7f2; color: #1a4d3a; font-weight: 600; }
    tr:nth-child(even) td { background: #fafaf8; }
    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 4px solid #1a4d3a;
      background: #f8f7f4;
      color: #444;
    }
    hr { border: none; border-top: 1px solid #e8e8e3; margin: 1.5em 0; }
    .parte-ii { page-break-before: always; }
    ul { padding-left: 1.4em; }
    a { color: #0f6e56; }
    @media print {
      body { padding: 0; }
      h1#parte-ii--flujo-técnico-componente-por-componente,
      h1[id*="parte-ii"] { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Consultorios Médicos</h1>
    <p>Lector de Excel — Documentación técnica</p>
    <p class="meta">Angular 18 · SPA cliente · MoCE / EDS<br>Mayo 2026</p>
    <p class="meta"><strong>Parte I:</strong> Arquitectura general &nbsp;|&nbsp; <strong>Parte II:</strong> Flujo componente a componente</p>
  </div>
  <main>${bodyHtml}</main>
</body>
</html>`;
}

function mdToHtml(md) {
  const marked = ensureMarked();
  let body = md.replace(/^---[\s\S]*?---\n/, '');
  body = marked.parse(body);
  body = body.replace(
    /<h1([^>]*)>Parte II — Flujo técnico/i,
    '<h1$1 class="parte-ii" id="parte-ii">Parte II — Flujo técnico'
  );
  return body;
}

function pdfWithEdge(htmlPath, pdfPath) {
  const edgePaths = [
    process.env['PROGRAMFILES(X86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.PROGRAMFILES + '\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);

  const browser = edgePaths.find((p) => fs.existsSync(p));
  if (!browser) return false;

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  try {
    execSync(
      `"${browser}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${fileUrl}"`,
      { stdio: 'inherit', timeout: 60000 }
    );
    return fs.existsSync(pdfPath);
  } catch {
    return false;
  }
}

async function pdfWithPuppeteer(htmlPath, pdfPath) {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch {
    console.log('Instalando puppeteer...');
    execSync('npm install puppeteer --no-save', { cwd: ROOT, stdio: 'inherit' });
    puppeteer = require('puppeteer');
  }
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '18mm', right: '16mm', bottom: '18mm', left: '16mm' },
    printBackground: true,
  });
  await browser.close();
  return true;
}

async function main() {
  if (!fs.existsSync(MD_FILE)) {
    console.error('No se encuentra:', MD_FILE);
    process.exit(1);
  }

  const md = fs.readFileSync(MD_FILE, 'utf8');
  const bodyHtml = mdToHtml(md);
  const fullHtml = buildHtml(bodyHtml);
  fs.writeFileSync(HTML_FILE, fullHtml, 'utf8');
  console.log('HTML generado:', HTML_FILE);

  if (pdfWithEdge(HTML_FILE, PDF_FILE)) {
    console.log('PDF generado (Edge/Chrome):', PDF_FILE);
    return;
  }

  console.log('Edge/Chrome headless no disponible; usando puppeteer...');
  await pdfWithPuppeteer(HTML_FILE, PDF_FILE);
  console.log('PDF generado:', PDF_FILE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
