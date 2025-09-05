import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface AnalysisResult {
  cropType: string;
  healthScore: number;
  diseases: string[];
  recommendations: string[];
  confidence: number;
}

const CropAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockResults: AnalysisResult[] = [
    {
      cropType: 'Wheat',
      healthScore: 87,
      diseases: ['Leaf Rust (Early Stage)'],
      recommendations: [
        'Apply fungicide spray within 3-5 days',
        'Increase air circulation between plants',
        'Monitor soil moisture levels',
        'Consider organic neem oil treatment'
      ],
      confidence: 92
    },
    {
      cropType: 'Tomato',
      healthScore: 95,
      diseases: [],
      recommendations: [
        'Excellent health! Continue current care',
        'Harvest ready in 10-14 days',
        'Maintain consistent watering schedule',
        'Monitor for pests during harvest season'
      ],
      confidence: 96
    },
    {
      cropType: 'Rice',
      healthScore: 73,
      diseases: ['Brown Spot', 'Nutrient Deficiency'],
      recommendations: [
        'Apply potassium-rich fertilizer',
        'Improve drainage to prevent waterlogging',
        'Use copper-based fungicide for brown spot',
        'Test soil pH levels'
      ],
      confidence: 89
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Return random mock result
    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
    setAnalysisResult(randomResult);
    setIsAnalyzing(false);
  };

  const useSampleImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const sampleImages = [
    'https://images.pexels.com/photos/1468390/pexels-photo-1468390.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    'https://images.pexels.com/photos/533982/pexels-photo-533982.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2',
    'https://images.pexels.com/photos/1459773/pexels-photo-1459773.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=2'
  ];

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Health Analysis</h1>
          <p className="text-gray-600">AI-powered analysis of crop health using computer vision</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Crop Image</h2>
            
            {!selectedImage ? (
              <div>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-green-500 transition-colors duration-200 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload a crop image</p>
                  <p className="text-gray-600">Click to select or drag and drop an image</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Or try sample images:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {sampleImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => useSampleImage(image)}
                        className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={image}
                          alt={`Sample crop ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors duration-200"></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="relative rounded-xl overflow-hidden mb-6">
                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="w-full h-64 object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Scan className="h-12 w-12 mx-auto mb-3 animate-pulse" />
                        <p className="font-medium">Analyzing image...</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Crop'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysisResult(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
            
            {!analysisResult ? (
              <div className="text-center text-gray-500 py-12">
                <Scan className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Upload an image to get AI-powered crop analysis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Crop Type & Health Score */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Detected Crop</p>
                    <p className="text-2xl font-bold text-gray-900">{analysisResult.cropType}</p>
                  </div>
                  <div className={`${getHealthBg(analysisResult.healthScore)} rounded-xl p-4`}>
                    <p className="text-sm text-gray-600 mb-1">Health Score</p>
                    <div className="flex items-center space-x-2">
                      <p className={`text-2xl font-bold ${getHealthColor(analysisResult.healthScore)}`}>
                        {analysisResult.healthScore}%
                      </p>
                      {analysisResult.healthScore >= 80 ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Analysis Confidence</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.confidence}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">{analysisResult.confidence}% confident</p>
                </div>

                {/* Diseases */}
                {analysisResult.diseases.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Detected Issues</h4>
                    <div className="space-y-2">
                      {analysisResult.diseases.map((disease, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-red-50 rounded-lg p-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <span className="text-red-900">{disease}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                  <div className="space-y-3">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-green-50 rounded-lg p-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-900">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAnalysis;