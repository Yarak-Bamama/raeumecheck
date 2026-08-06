// Kopiert Text in die Zwischenablage. Die moderne Clipboard-API braucht
// einen sicheren Kontext (https oder localhost) und eine Nutzererlaubnis,
// die nicht überall gegeben ist, etwa wenn die App als lokale Datei über
// file:// geöffnet wird. Für diesen Fall gibt es einen Rückfallweg über ein
// unsichtbares Textfeld und das ältere execCommand("copy").

export function copyToClipboard(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => fallbackCopy(text),
    );
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
