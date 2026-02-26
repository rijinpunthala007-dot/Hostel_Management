import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

/**
 * Utility: create a cropped image from the source + crop area + rotation.
 * Returns a base64 data URL.
 */
const createCroppedImage = (imageSrc, pixelCrop, rotation = 0) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Output a square image at a reasonable size
            const size = Math.min(pixelCrop.width, pixelCrop.height, 400);
            canvas.width = size;
            canvas.height = size;

            // If rotation is needed, we use a larger intermediate canvas
            if (rotation !== 0) {
                const radians = (rotation * Math.PI) / 180;
                const sin = Math.abs(Math.sin(radians));
                const cos = Math.abs(Math.cos(radians));
                const newWidth = image.width * cos + image.height * sin;
                const newHeight = image.width * sin + image.height * cos;

                const rotCanvas = document.createElement('canvas');
                rotCanvas.width = newWidth;
                rotCanvas.height = newHeight;
                const rotCtx = rotCanvas.getContext('2d');

                rotCtx.translate(newWidth / 2, newHeight / 2);
                rotCtx.rotate(radians);
                rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

                ctx.drawImage(
                    rotCanvas,
                    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
                    0, 0, size, size
                );
            } else {
                ctx.drawImage(
                    image,
                    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
                    0, 0, size, size
                );
            }

            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        image.onerror = reject;
        image.src = imageSrc;
    });
};

const ImageCropModal = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => setCrop(crop), []);
    const onZoomChange = useCallback((zoom) => setZoom(zoom), []);

    const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        if (!croppedAreaPixels) return;
        try {
            const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels, rotation);
            onCropComplete(croppedImage);
        } catch (err) {
            console.error('Crop failed:', err);
            alert('Failed to crop image. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: '90vh' }}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Crop Profile Photo</h3>
                    <button
                        onClick={onCancel}
                        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="relative bg-gray-900" style={{ height: '340px' }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropAreaComplete}
                    />
                </div>

                {/* Controls */}
                <div className="px-5 py-4 space-y-4 bg-gray-50">
                    {/* Zoom */}
                    <div className="flex items-center gap-3">
                        <ZoomOut size={16} className="text-gray-400 shrink-0" />
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#991B1B]"
                        />
                        <ZoomIn size={16} className="text-gray-400 shrink-0" />
                    </div>

                    {/* Rotation */}
                    <div className="flex items-center gap-3">
                        <RotateCw size={16} className="text-gray-400 shrink-0" />
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#991B1B]"
                        />
                        <span className="text-xs text-gray-500 w-10 text-right shrink-0">{rotation}°</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-[#991B1B] text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors shadow-sm"
                    >
                        Save & Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
