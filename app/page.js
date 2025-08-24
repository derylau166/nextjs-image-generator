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

  return (
    <>
      <Head>
        <title>DERY LAU AI - Image Generator</title>
      </Head>
      <div className="flex flex-col items-center min-h-screen p-4 neumorphism-bg">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-8 text-transparent bg-clip-text neon-text">
          DERY LAU AI
        </h1>

        <form className="w-full max-w-4xl mb-8 p-8 neumorphism-card" onSubmit={generateImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-gray-800 text-sm font-bold mb-2 neon-text-sub">
                  PROMPT:
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="neumorphism-input"
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
                <label className="block text-gray-800 text-sm font-bold mb-2 neon-text-sub">
                  BASIC SETTINGS:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="model" className="block text-gray-600 text-xs mb-1">Model:</label>
                    <select
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="neumorphism-select"
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
                        className="neumorphism-input-inline"
                        placeholder="Opsional (Angka)"
                      />
                      <button
                        type="button"
                        onClick={handleRandomSeed}
                        className="neumorphism-button-small ml-2 text-gray-600"
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
                      className="neumorphism-checkbox"
                    />
                    <span className="ml-2">Enhance</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-2 neon-text-sub">
                  ADVANCE SETTINGS:
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-gray-600 text-xs">Color Palette:</span>
                  {COLOR_PALETTES.map(p => (
                    <label key={p} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="colorPalette"
                        value={p}
                        checked={colorPalette === p}
                        onChange={(e) => setColorPalette(e.target.value)}
                        className="neumorphism-radio"
                      />
                      <span className="ml-1 text-gray-600 text-xs">{p.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-gray-600 text-xs">Composition:</span>
                  {COMPOSITIONS.map(c => (
                    <label key={c} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="composition"
                        value={c}
                        checked={composition === c}
                        onChange={(e) => setComposition(e.target.value)}
                        className="neumorphism-radio"
                      />
                      <span className="ml-1 text-gray-600 text-xs">{c.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-gray-600 text-xs">Lighting:</span>
                  {LIGHTINGS.map(l => (
                    <label key={l} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="lighting"
                        value={l}
                        checked={lighting === l}
                        onChange={(e) => setLighting(e.target.value)}
                        className="neumorphism-radio"
                      />
                      <span className="ml-1 text-gray-600 text-xs">{l.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-2 neon-text-sub">
                  FORMAT SETTINGS:
                </label>
                <div className="flex flex-wrap gap-4 mb-2">
                  <span className="text-gray-600 text-xs">Aspect Ratio:</span>
                  {Object.keys(ASPECT_RATIOS).map(key => (
                    <label key={key} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="aspectRatio"
                        value={ASPECT_RATIOS[key]}
                        checked={aspectRatio === ASPECT_RATIOS[key]}
                        onChange={(e) => setAspectRatio(e.target.value)}
                        className="neumorphism-radio"
                      />
                      <span className="ml-1 text-gray-600 text-xs">{key}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span className="text-gray-600 text-xs">Quality:</span>
                  {QUALITY_OPTIONS.map(q => (
                    <label key={q} className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="quality"
                        value={q}
                        checked={quality === q}
                        onChange={(e) => setQuality(e.target.value)}
                        className="neumorphism-radio"
                      />
                      <span className="ml-1 text-gray-600 text-xs">{q.replace('_', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className={`neumorphism-button text-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
              disabled={loading}
            >
              Generate Image
            </button>
            <button
              type="button"
              onClick={handleGenerateJSON}
              className="neumorphism-button text-sm bg-purple-200"
            >
              Generate JSON
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex flex-col items-center mt-8">
            <div className="animate-pulse text-lg font-bold neon-text">
              DERY LAU LOADING...
            </div>
          </div>
        )}

        {jsonConfig && (
          <div className="mt-8 w-full max-w-4xl p-6 neumorphism-card">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 neon-text-sub">JSON Configuration</h2>
            <pre className="text-sm bg-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words text-gray-600">
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          </div>
        )}

        {image && !loading && (
          <div className="mt-8 w-full max-w-4xl p-6 neumorphism-card flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 neon-text-sub">Generated Image</h2>
            <img 
              src={image} 
              alt="Generated by Dery Lau AI" 
              className="rounded-lg max-w-full h-auto mb-4"
            />
            <button
              onClick={handleDownload}
              className="neumorphism-button bg-green-200"
            >
              Download PNG
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 w-full max-w-4xl p-6 neumorphism-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 neon-text-sub">Prompt History</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, index) => (
                <div key={index} className="flex items-center neumorphism-inner p-4 rounded-xl">
                  <img
                    src={item.imageUrl}
                    alt="History"
                    className="w-16 h-16 object-cover rounded-lg mr-4 neumorphism-image"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.prompt}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>Copyright ©2025 DERY LAU AI, Powered by. Pollinations API</p>
          <p>Developed by. Dery Lau, Thanks to Github, Vercel & Gemini</p>
        </footer>
      </div>
    </>
  );
    }
    
