// Verkleinert ein hochgeladenes Foto, bevor es in localStorage landet. Ein
// Handyfoto eines Etagenplans kann mehrere Megabyte groß sein, und
// localStorage hat pro Seite nur wenige Megabyte Platz insgesamt. Deshalb
// wird das Bild vor dem Speichern auf eine vernünftige Kantenlänge
// herunterskaliert und als JPEG mit moderater Qualität komprimiert.

export function compressImageFile(file, maxDimension = 1800, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Bild konnte nicht gelesen werden."));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}
