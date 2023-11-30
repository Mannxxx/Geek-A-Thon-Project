export function downloadCanvas({
    canvasId,
    title = "Olympics Chart"
}: {
    canvasId: string
    title?: string
}) {

    const paddingTop = 60;

    // Get the original canvas
    const originalCanvas: any = document.getElementById(canvasId);
    if (!originalCanvas) return;

    // Create a new canvas with a white background
    const newCanvas = document.createElement('canvas');
    newCanvas.width = originalCanvas.width;
    newCanvas.height = originalCanvas.height + paddingTop;

    const ctx = newCanvas.getContext('2d');
    if (!ctx) return;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw the title on the new canvas
    ctx.fillStyle = '#000000'; // Black text color
    ctx.font = '24px Arial'; // Replace with your desired font and size
    ctx.textAlign = 'center';
    ctx.fillText(title, newCanvas.width / 2, 30); // Adjust the Y-coordinate (30) as needed

    // Draw the original canvas content onto the new canvas
    ctx.drawImage(originalCanvas, 0, paddingTop);

    // Create a download link for the new canvas
    const link = document.createElement('a');
    link.download = `${title}.png`;
    link.href = newCanvas.toDataURL();

    // Trigger the download
    link.click();
}