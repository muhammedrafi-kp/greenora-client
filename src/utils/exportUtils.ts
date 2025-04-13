import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportData {
    headers: string[];
    data: any[];
    fileName: string;
}

export const exportToCSV = ({ headers, data, fileName }: ExportData) => {
    const csvData = data.map((row) => headers.map(header => row[header] || 'N/A').join(','));
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
};

export const exportToPDF = ({ headers, data, fileName }: ExportData) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text(`${fileName} Report`, 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

    // Prepare data for the table
    const tableData = data.map(row => headers.map(header => row[header] || 'N/A'));

    // Add the table
    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 8 },
        columnStyles: headers.reduce((acc, _, index) => ({
            ...acc,
            [index]: { cellWidth: 30 }
        }), {})
    });

    // Save the PDF
    doc.save(`${fileName}.pdf`);
};

export const exportTableData = (type: 'csv' | 'pdf', exportData: ExportData) => {
    if (type === 'csv') {
        exportToCSV(exportData);
    } else {
        exportToPDF(exportData);
    }
}; 