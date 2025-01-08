import { getDocument } from "pdfjs-dist";
import { TextItem } from "pdfjs-dist/types/src/display/api";

export const extractPdfText = async (fileUrl: string): Promise<string> => {
  const loadingTask = getDocument(fileUrl);
  const pdf = await loadingTask.promise;

  let extractedText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => (item as TextItem).str)
      .join(" ");

    extractedText += `Page ${pageNum}:\n${pageText}\n\n`;
  }

  return extractedText;
};
