import React, { useRef } from 'react';
import { Search, Barcode, Camera } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onBarcodeSearch: (barcode: string) => void;
}

export function SearchBar({ query, onQueryChange, onBarcodeSearch }: SearchBarProps) {
  const [isBarcode, setIsBarcode] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBarcode && query.trim()) {
      onBarcodeSearch(query.trim());
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsScanning(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        // Here you would process the image data for barcode scanning
        // For now, we'll just stop scanning
        stopScanning();
      }
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={isBarcode ? "Enter barcode..." : "Search products..."}
          className="w-full px-4 py-3 pl-12 pr-24 border border-indigo-200 rounded-xl 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200
                   placeholder-gray-400"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 w-5 h-5" />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsBarcode(!isBarcode)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            title="Toggle barcode mode"
          >
            <Barcode className="w-5 h-5" />
          </button>
          
          {isBarcode && (
            <button
              type="button"
              onClick={isScanning ? stopScanning : startScanning}
              className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              title="Scan barcode with camera"
            >
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isScanning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full h-auto"
              onLoadedMetadata={() => videoRef.current?.play()}
            />
            <canvas ref={canvasRef} className="hidden" width="640" height="480" />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={stopScanning}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={captureFrame}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}