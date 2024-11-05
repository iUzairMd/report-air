


        document.getElementById('printBtn').addEventListener('click', async function() {
            const element = document.getElementById('capture');
            const printBtn = document.getElementById('printBtn');
            
            try {
                // Hide the button before capturing
                printBtn.style.display = 'none';
                
                // Create canvas with better resolution
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: true,
                    backgroundColor: '#ffffff',
                    onclone: function(clonedDoc) {
                        // Hide button in cloned document as well
                        clonedDoc.getElementById('printBtn').style.display = 'none';
                    }
                });
        
                // Convert canvas to PDF
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const pdf = new jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
        
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                let imgHeight = canvas.height * imgWidth / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
        
                // Add first page
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
        
                // Add subsequent pages if needed
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
        
                // Open PDF in new window
                window.open(URL.createObjectURL(pdf.output('blob')));
                
                // Optionally auto-print
                pdf.autoPrint();
                pdf.output('dataurlnewwindow');
                
            } catch (error) {
                console.error('Error generating PDF:', error);
            } finally {
                // Show the button again after process is complete
                printBtn.style.display = 'block';
            }
        });
        
        // Add CSS to hide button during printing
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                #printBtn {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);