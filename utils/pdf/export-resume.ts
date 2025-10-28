type ExportOptions = {
  title: string;
  styles?: string;
};

function buildDocumentHtml(content: string, title: string, styles = "") {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
      }

      @page {
        size: A4;
        margin: 18mm;
      }

      body {
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 0;
        color: #111827;
        background: #ffffff;
      }

      * {
        box-sizing: border-box;
      }

      ${styles}
    </style>
  </head>
  <body>
    ${content}
  </body>
</html>`;
}

export async function exportResumeToPdf(element: HTMLElement, options: ExportOptions) {
  if (!import.meta.client) {
    return;
  }

  const printWindow = window.open("", "resume-preview", "noopener,noreferrer,width=1280,height=720");

  if (!printWindow) {
    console.warn("[resume-pdf] Unable to open print window");
    return;
  }

  const cloned = element.cloneNode(true) as HTMLElement;

  // Ensure the cloned document stretches to full width for better rendering.
  cloned.style.maxWidth = "100%";
  cloned.style.margin = "0";
  cloned.style.padding = "0";

  const serialized = cloned.outerHTML;
  const html = buildDocumentHtml(serialized, options.title, options.styles);

  printWindow.document.write(html);
  printWindow.document.title = options.title;
  printWindow.document.close();

  await new Promise((resolve) => {
    printWindow.addEventListener("load", resolve, { once: true });
  });

  printWindow.focus();
  printWindow.print();
}
