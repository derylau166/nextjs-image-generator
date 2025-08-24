'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const AI_MODELS = [
  'default', 'gptimage', 'flux', 'dall-e-3', 'midjourney', 'stable-diffusion'
];

const QUALITY_OPTIONS = {
  'HD': 'hd',
  'High Resolution': 'high_resolution',
  'Ultra Detail': 'ultra_detail',
};

const ASPECT_RATIOS = {
  'Square (1:1)': '1:1',
  'Portrait (9:16)': '9:16',
  'Landscape (16:9)': '16:9',
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('gptimage');
  const [seed, setSeed] = useState('');
  const [quality, setQuality] = useState('hd');
  const [enhance, setEnhance] = useState(true);
  const [history, setHistory] = useState([]);
  const [jsonConfig, setJsonConfig] = useState(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history));
  }, [history]);

  const generateImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImage('');
    setJsonConfig(null);

    let width = 1024;
    let height = 1024;
    if (aspectRatio === '9:16') {
      width = 576;
      height = 1024;
    } else if (aspectRatio === '16:9') {
      width = 1024;
      height = 576;
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const enhanceParam = enhance ? '&enhance=true' : '';
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&quality=${quality}${seed ? `&seed=${seed}` : ''}${enhanceParam}&nologo=true`;

    setImage(imageUrl);
    setLoading(false);
    
    const newHistory = [{ prompt, imageUrl, time: new Date().toLocaleString() }, ...history.slice(0, 9)];
    setHistory(newHistory);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('promptHistory');
  };

  const handleDownload = async () => {
    if (image) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `derylau-ai-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download image. Please try again.');
      }
    }
  };

  const handleGenerateRandomPrompt = () => {
    const randomPrompts = [
      "A futuristic cityscape at sunset, neon lights, high detail, photorealistic.",
      "A serene forest with a glowing mushroom village, fantasy style.",
      "An astronaut floating in space, surrounded by vibrant nebulae, digital art.",
      "A majestic dragon perched on a snow-capped mountain, cinematic lighting.",
      "A steampunk-style owl wearing a monocle and a top hat, intricate details."
    ];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  const handleGenerateJSON = (e) => {
    e.preventDefault();
    const config = {
      prompt,
      model,
      aspectRatio,
      quality,
      seed: seed || null,
      enhance,
      nologo: true,
    };
    setJsonConfig(config);
  };

  return (
    <>
      <Head>
        <title>DERY LAU AI - Image Generator</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          DERY LAU AI
        </h1>

        <form className="w-full max-w-2xl mb-8 p-6 bg-gray-800 rounded-xl shadow-lg" onSubmit={generateImage}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-gray-300 text-sm font-bold mb-2">
              Prompt:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="A futuristic cityscape at sunset, neon lights, high detail, photorealistic."
              rows="3"
              required
            />
            <button
              type="button"
              onClick={handleGenerateRandomPrompt}
              className="mt-2 text-xs text-blue-400 hover:text-blue-500 transition-colors"
              disabled={loading}
            >
              Generate Random Prompt
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="model" className="block text-gray-300 text-sm font-bold mb-2">
                AI Model:
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="shadow border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {AI_MODELS.map(m => (
                  <option key={m} value={m}>{m.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="seed" className="block text-gray-300 text-sm font-bold mb-2">
                Seed:
              </label>
              <input
                id="seed"
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Opsional (Angka)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Aspect Ratio:
              </label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(ASPECT_RATIOS).map(key => (
                  <label key={key} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="aspectRatio"
                      value={ASPECT_RATIOS[key]}
                      checked={aspectRatio === ASPECT_RATIOS[key]}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300 text-sm">{key}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Quality:
              </label>
              <div className="flex flex-wrap gap-4">
                {Object.keys(QUALITY_OPTIONS).map(key => (
                  <label key={key} className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value={QUALITY_OPTIONS[key]}
                      checked={quality === QUALITY_OPTIONS[key]}
                      onChange={(e) => setQuality(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300 text-sm">{key}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enhance}
                onChange={(e) => setEnhance(e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-300 text-sm">Enhance Image</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg font-bold text-lg transition-colors ${loading ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              Generate Image
            </button>
            <button
              type="button"
              onClick={handleGenerateJSON}
              className="py-3 px-4 rounded-lg font-bold text-sm bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Generate JSON
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center mt-8">
            <div className="animate-pulse text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              DERY LAU LOADING...
            </div>
          </div>
        )}

        {jsonConfig && (
          <div className="mt-8 w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">JSON Configuration</h2>
            <pre className="text-sm bg-gray-900 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words text-gray-300">
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          </div>
        )}

        {image && !loading && (
          <div className="mt-8 w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Generated Image</h2>
            <img 
              src={image} 
              alt="Generated by Dery Lau AI" 
              className="rounded-lg max-w-full h-auto mb-4"
            />
            <button
              onClick={handleDownload}
              className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Download PNG
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-200">Prompt History</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-400 hover:text-red-500 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="flex items-center bg-gray-700 rounded-lg p-4">
                  <img
                    src={item.imageUrl}
                    alt="History"
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 line-clamp-2">{item.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Copyright ©2025 DERY LAU AI, Powered by. Pollinations API</p>
          <p>Developed by. Dery Lau, Thanks to Github, Vercel & Gemini</p>
        </footer>
      </div>
    </>
  );
}
