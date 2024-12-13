import React, {useState} from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import apiClient from "../../axiosConfig";

pdfjs.GlobalWorkerOptions.workerSrc =
`//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReport = () => {
    const [showPDF, setShowPDF] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [filename, setFileName] = useState('');

    const handleGenerateReport = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get('/Book/report', {
                headers :{
                    'Content-Type': 'application/pdf',
                },
                responseType: 'blob'
            });
            console.log(response);
            const contentDisposition = response.headers.get('content-disposition');
            let tempfilename = 'document.pdf'; // default filename
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    tempfilename = filenameMatch[1].replace(/['"]/g, '');
                    setFileName(tempfilename);
                }
            }
            console.log(contentDisposition);
              // Buat URL untuk preview PDF
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            
            setPdfFile(pdfUrl);
            setShowPDF(true);
          } catch (err) {
            setError('Error fetching PDF: ' + (err.message || 'Unknown error'));
          } finally {
            setLoading(false);
          }
          
      };

      const handleDownloadPDF = () => {
        if (pdfFile) {
          const link = document.createElement('a');
          link.href = pdfFile;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
      };
    
    
      const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
      };
    
      const onDocumentLoadError = (error) => {
        setError('Error loading PDF: ' + error.message);
      };
    
      const goToPreviousPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1));
      };
    
      const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
      };
    
      return (
        <div className="container">
          <div className="row">
    
          <div className="mb-2">
               <button onClick={handleGenerateReport} disabled={loading} className="btn btn-primary me-2">
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </>
                ) : ('Lihat Laporan')}
              </button>
              {pdfFile && (
                  <button className="btn btn-success" onClick={handleDownloadPDF}>
                    Unduh PDF
                  </button>
               )}
          </div>
          <div className="col-12">
          {/* PDF Viewer */}
          {showPDF && (
            <div className="card">
              <div className="card-body">
                {loading && (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger" role="alert"> {error}</div>
                )}

                {pdfFile && (
                  <>
                  <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}
                             onLoadError={onDocumentLoadError}
                      loading={
                        <div className="text-center">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      }>
                      <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false}
                        className="mx-auto" width={Math.min(window.innerWidth * 0.9, 800)} />
                    </Document>
                    {numPages && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                 <button onClick={goToPreviousPage} disabled={pageNumber <= 1} className="btn btn-primary">
                   Previous
                  </button>
                        
                 <p className="mb-0"> Page {pageNumber} of {numPages} </p>
                        
                  <button onClick={goToNextPage} disabled={pageNumber >= numPages} className="btn btn-primary">
                    Next
                  </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReport;