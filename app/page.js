'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const AI_MODELS = [
  'default', 'gpt-image', 'flux', 'dall-e-3', 'midjourney', 'stable-diffusion'
];

const QUALITY_OPTIONS = [
  'hd', 'high_resolution', 'ultra_detail'
];

const ASPECT_RATIOS = {
  'Square (1:1)': '1:1',
  'Portrait (9:16)': '9:16',
  'Landscape (16:9)': '16:9',
};

const COLOR_PALETTES = [
  'default', 'vibrant', 'pastel', 'monochrome', 'warm_tones', 'cool_tones', 'rgb'
];

const COMPOSITIONS = [
  'default', 'close-up', 'wide_shot', 'askew_view', 'macro', 'aerial', 'low_view_angle', 'drone_wide_angle_view_shot'
];

const LIGHTINGS = [
  'hdr', 'ultra_detail', 'cinematic_lighting', 'neon_glow', 'photorealistic', 'drama_light', 'night_mode'
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [model, setModel] = useState('gpt-image');
  const [seed, setSeed] = useState('');
  const [quality, setQuality] = useState('hd');
  const [enhance, setEnhance] = useState(true);
  const [colorPalette, setColorPalette] = useState('default');
  const [composition, setComposition] = useState('default');
  const [lighting, setLighting] = useState('hdr');
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
    const seedParam = seed ? `&seed=${seed}` : '';
    const styleParams = [
      colorPalette !== 'default' && `palette=${colorPalette}`,
      composition !== 'default' && `composition=${composition}`,
      lighting !== 'hdr' && `lighting=${lighting}`
    ].filter(Boolean).join('&');

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&quality=${quality}${seedParam}${enhanceParam}&nologo=true&${styleParams}`;

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
        if (!response.ok) {
          throw new Error('Image could not be fetched.');
        }
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
      colorPalette,
      composition,
      lighting,
      nologo: true,
    };
    setJsonConfig(config);
  };

  const handleRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000000);
    setSeed(randomSeed);
  };

  const SettingsGroup = ({ label, options, selected, onSelect }) => (
    <div className="mb-2">
      <span className="text-gray-500 text-sm font-medium">{label}:</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map(option => (
          <label key={option} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option}
              checked={selected === option}
              onChange={() => onSelect(option)}
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <span className="ml-1 text-gray-700 text-xs">
              {option.replace(/_/g, ' ').toUpperCase()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const AspectRatioGroup = ({ label, options, selected, onSelect }) => (
    <div className="mb-2">
      <span className="text-gray-500 text-sm font-medium">{label}:</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.keys(options).map(key => (
          <label key={key} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name={label}
              value={options[key]}
              checked={selected === options[key]}
              onChange={() => onSelect(options[key])}
              className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
            />
            <span className="ml-1 text-gray-700 text-xs">
              {key}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>DERY LAU AI - Image Generator</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 p-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          DERY LAU AI
        </h1>

        <form className="w-full max-w-4xl mb-8 p-6 bg-gray-50 rounded-lg shadow-lg" onSubmit={generateImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-gray-700 text-sm font-bold mb-2">
                  Prompt:
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="A futuristic cityscape at sunset, neon lights, high detail, photorealistic."
                  rows="3"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateRandomPrompt}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                  disabled={loading}
                >
                  Generate Random Prompt
                </button>
              </div>

              <div className="mb-6">
                <h2 className="text-gray-700 text-sm font-bold mb-2">BASIC SETTINGS:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="model" className="block text-gray-600 text-xs mb-1">Model:</label>
                    <select
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      {AI_MODELS.map(m => (
                        <option key={m} value={m}>{m.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="seed" className="block text-gray-600 text-xs mb-1">Seed:</label>
                    <div className="flex items-center">
                      <input
                        id="seed"
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="Opsional (Angka)"
                      />
                      <button
                        type="button"
                        onClick={handleRandomSeed}
                        className="ml-2 py-2 px-3 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
                      >
                        🎲
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <label className="inline-flex items-center cursor-pointer text-gray-600 text-sm">
                    <input
                      type="checkbox"
                      checked={enhance}
                      onChange={(e) => setEnhance(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 text-gray-700">Enhance</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="mb-6">
                <h2 className="text-gray-700 text-sm font-bold mb-2">ADVANCE SETTINGS:</h2>
                <SettingsGroup 
                  label="Color Palette" 
                  options={COLOR_PALETTES} 
                  selected={colorPalette} 
                  onSelect={setColorPalette} 
                />
                <SettingsGroup 
                  label="Composition" 
                  options={COMPOSITIONS} 
                  selected={composition} 
                  onSelect={setComposition} 
                />
                <SettingsGroup 
                  label="Lighting" 
                  options={LIGHTINGS} 
                  selected={lighting} 
                  onSelect={setLighting} 
                />
              </div>

              <div className="mb-6">
                <h2 className="text-gray-700 text-sm font-bold mb-2">FORMAT SETTINGS:</h2>
                <AspectRatioGroup 
                  label="Aspect Ratio" 
                  options={ASPECT_RATIOS} 
                  selected={aspectRatio} 
                  onSelect={setAspectRatio} 
                />
                <SettingsGroup 
                  label="Quality" 
                  options={QUALITY_OPTIONS} 
                  selected={quality} 
                  onSelect={setQuality} 
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className={`flex-1 py-3 px-6 rounded-md font-bold text-lg text-white transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              Generate Image
            </button>
            <button
              type="button"
              onClick={handleGenerateJSON}
              className="py-3 px-6 rounded-md font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Generate JSON
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center mt-8">
            <div className="animate-pulse text-lg font-bold text-gray-500">
              DERY LAU LOADING...
            </div>
          </div>
        )}

        {jsonConfig && (
          <div className="mt-8 w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">JSON Configuration</h2>
            <pre className="text-sm bg-gray-200 rounded-md p-4 overflow-x-auto whitespace-pre-wrap break-words text-gray-800">
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          </div>
        )}

        {image && !loading && (
          <div className="mt-8 w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Generated Image</h2>
            <img 
              src={image} 
              alt="Generated by Dery Lau AI" 
              className="rounded-lg max-w-full h-auto mb-4 border border-gray-300"
            />
            <button
              onClick={handleDownload}
              className="py-2 px-4 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors"
            >
              Download PNG
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 w-full max-w-4xl p-6 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Prompt History</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-100 rounded-md shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt="History"
                    className="w-16 h-16 object-cover rounded-md mr-4 border border-gray-200"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 line-clamp-2">{item.prompt}</p>
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
