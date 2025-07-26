
'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Configure the worker
// This is critical for the library to work
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const { toast } = useToast();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF Load Error:', error);
    toast({
        title: 'Error loading PDF',
        description: 'There was an issue loading the document. Please try again later.',
        variant: 'destructive'
    })
  }

  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => (prevPageNumber > 1 ? prevPageNumber - 1 : 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => (numPages && prevPageNumber < numPages ? prevPageNumber + 1 : prevPageNumber));
  };

  const zoomIn = () => setScale(s => s + 0.2);
  const zoomOut = () => setScale(s => (s > 0.4 ? s - 0.2 : 0.4));


  return (
    <div className="w-full h-full flex flex-col bg-gray-800/50">
      <div className="bg-slate-800 p-2 flex items-center justify-center gap-4 shadow-md z-10">
        <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-white">
          Page {pageNumber} of {numPages || '--'}
        </span>
        <Button variant="outline" size="icon" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="w-px bg-slate-600 h-6 mx-2"></div>
        <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
        </Button>
        <span className='text-white'>{Math.round(scale * 100)}%</span>
         <Button variant="outline" size="icon" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={options}
          loading={
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          }
          className="flex justify-center"
        >
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} />
        </Document>
      </div>
    </div>
  );
}
