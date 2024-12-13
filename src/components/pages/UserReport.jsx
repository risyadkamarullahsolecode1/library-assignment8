import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import apiClient from "../../axiosConfig"; // Adjust based on your Axios setup
import { Button, Spinner, Alert, Container, Row, Col, Card } from "react-bootstrap";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const UserReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  // Generate PDF Report
  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/User/report", {
        headers: { "Content-Type": "application/pdf" },
        responseType: "blob", // Ensure we get a binary Blob
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfFile(pdfUrl);
      setShowPDF(true);
    } catch (err) {
      setError("Failed to generate the report. " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Download PDF
  const handleDownloadPDF = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.setAttribute("download", "UserReport.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // React-PDF callbacks
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    setError("Error loading PDF: " + error.message);
  };

  // Pagination handlers
  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h1>User Report</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button onClick={handleGenerateReport} disabled={loading} className="me-2">
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Generating...
              </>
            ) : (
              "Generate Report"
            )}
          </Button>
          {pdfFile && (
            <Button onClick={handleDownloadPDF} className="btn btn-success">
              Download PDF
            </Button>
          )}
        </Col>
      </Row>
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          {showPDF && pdfFile && (
            <Card>
              <Card.Body>
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="text-center">
                      <Spinner animation="border" />
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    width={Math.min(window.innerWidth * 0.9, 800)}
                  />
                </Document>
                {numPages && (
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
                      Previous
                    </Button>
                    <p className="mb-0">
                      Page {pageNumber} of {numPages}
                    </p>
                    <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                      Next
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default UserReport;
