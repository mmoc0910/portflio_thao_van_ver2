/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useMemo, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type PdfSource =
  | { type: "url"; url: string }
  | { type: "file"; file: File };

type Props = {
  source: PdfSource;
  scale?: number; // 1.0 - 2.0 thường ổn
  className?: string;
};

async function renderPageToDataURL(page: PDFPageProxy, scale: number) {
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  // ✅ pdfjs-dist bản mới: dùng canvas, không dùng canvasContext
  const renderTask = page.render({
    canvas,
    viewport,
  });

  await renderTask.promise;

  return canvas.toDataURL("image/png");
}

async function loadPdfDocument(src: string | Uint8Array): Promise<PDFDocumentProxy> {
  const loadingTask = pdfjsLib.getDocument(src as any);
  return await loadingTask.promise;
}

export default function PdfToImages({
  source,
  scale = 1.5,
  className = "",
}: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Nếu source là file -> convert sang objectURL để cleanup
  const fileUrl = useMemo(() => {
    if (source.type !== "file") return "";
    return URL.createObjectURL(source.file);
  }, [source]);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        setImages([]);
        setNumPages(0);

        let pdf: PDFDocumentProxy;

        if (source.type === "url") {
          if (!source.url) throw new Error("URL PDF rỗng");
          pdf = await loadPdfDocument(source.url);
        } else {
          // Dùng fileUrl (objectURL) cho đơn giản
          if (!fileUrl) throw new Error("Không tạo được URL cho file");
          pdf = await loadPdfDocument(fileUrl);
        }

        if (cancelled) return;

        setNumPages(pdf.numPages);

        const results: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const dataUrl = await renderPageToDataURL(page, scale);
          results.push(dataUrl);

          if (cancelled) return;
          // update dần để UI có ảnh xuất hiện từ từ
          setImages([...results]);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Render PDF failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [source, scale, fileUrl]);

  return (
    <div className={className}>
      {loading && (
        <div className="mb-3 text-sm opacity-80">
         Rendering Resume {numPages ? ` (${images.length}/${numPages})` : ""}...
        </div>
      )}
      {error && <div className="text-red-600 mb-3">Lỗi: {error}</div>}

      <div className="space-y-6">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`pdf-page-${idx + 1}`}
            className="w-full h-auto"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}