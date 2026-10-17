export async function exportChartAsPNG(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const canvas = document.createElement('canvas');
  const rect = element.getBoundingClientRect();
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.scale(2, 2);
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, rect.width, rect.height);
  
  // Use html2canvas approach - simplified SVG capture
  const svgData = new XMLSerializer().serializeToString(
    element.querySelector('svg') || document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  );
  
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  img.onload = () => {
    ctx.drawImage(img, 0, 0, rect.width, rect.height);
    URL.revokeObjectURL(url);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a');
        link.download = `${filename}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      }
    }, 'image/png');
  };
  img.src = url;
}
