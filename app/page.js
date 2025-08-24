'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

const AI_MODELS = [
  'default', 'gpt-image', 'flux', 'dall-e-3', 'midjourney', 'stable-diffusion'
];

const STYLE_OPTIONS = [
  'default', 'realistic', 'surrealism', 'psicadelic', 'macabre', 'chaotic', 'fractal', 'cartoon', 'anime', 'disney_3d', 'dark_fantasy'
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
  'default', 'close-up', 'wide_shot', 'askew_view', 'macro_photography', 'aerial', 'low_view_angle', 'drone_wide_angle_view_shot'
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
  const [style, setStyle] = useState('default');
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
    const styleParam = style !== 'default' ? `&style=${style}` : '';
    const advStyleParams = [
      colorPalette !== 'default' && `palette=${colorPalette}`,
      composition !== 'default' && `composition=${composition}`,
      lighting !== 'hdr' && `lighting=${lighting}`
    ].filter(Boolean).join('&');

    const apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&quality=${quality}${seedParam}${enhanceParam}${styleParam}&nologo=true&${advStyleParams}`;

    // Error handling for API response
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      setImage(apiUrl);
      const newHistory = [{ prompt, imageUrl: apiUrl, time: new Date().toLocaleString() }, ...history.slice(0, 9)];
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please check your prompt and try again.');
    } finally {
      setLoading(false);
    }
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
      style,
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
    <div className="mb-4">
      <span className="text-gray-600 text-sm font-semibold">{label}:</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map(option => (
          <label key={option} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name={label}
              value={option}
              checked={selected === option}
              onChange={() => onSelect(option)}
              className="form-radio h-4 w-4 text-blue-500 transition-colors duration-200"
            />
            <span className="ml-2 text-gray-700 text-xs font-medium">
              {option.replace(/_/g, ' ').toUpperCase()}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const AspectRatioGroup = ({ label, options, selected, onSelect }) => (
    <div className="mb-4">
      <span className="text-gray-600 text-sm font-semibold">{label}:</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {Object.keys(options).map(key => (
          <label key={key} className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name={label}
              value={options[key]}
              checked={selected === options[key]}
              onChange={() => onSelect(options[key])}
              className="form-radio h-4 w-4 text-blue-500 transition-colors duration-200"
            />
            <span className="ml-2 text-gray-700 text-xs font-medium">
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
      <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 p-4 sm:p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          DERY LAU AI
        </h1>

        <div className="w-full max-w-5xl mb-8 p-6 bg-white rounded-xl shadow-2xl ring-1 ring-gray-100">
          <form className="w-full" onSubmit={generateImage}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-1">
                <div className="mb-6">
                  <label htmlFor="prompt" className="block text-gray-800 text-lg font-bold mb-2">
                    Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-32 p-4 text-gray-800 bg-gray-100 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Describe your creative vision here..."
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <button
                      type="button"
                      onClick={handleGenerateRandomPrompt}
                      className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                      disabled={loading}
                    >
                      Generate Random Prompt
                    </button>
                    <div className="flex items-center">
                      <label htmlFor="enhance-toggle" className="text-sm text-gray-600 mr-2">
                        Enhance
                      </label>
                      <input
                        type="checkbox"
                        id="enhance-toggle"
                        checked={enhance}
                        onChange={(e) => setEnhance(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-purple-600 rounded-md transition duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-gray-800 text-sm font-bold mb-4">BASIC SETTINGS</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="model" className="block text-gray-600 text-xs mb-1">Model:</label>
                      <select
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full py-2 px-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
                          className="w-full py-2 px-3 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Optional"
                        />
                        <button
                          type="button"
                          onClick={handleRandomSeed}
                          className="ml-2 btn-icon"
                          title="Generate random seed"
                        >
                          🎲
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-gray-800 text-sm font-bold mb-4">ADVANCE SETTINGS</h2>
                  <SettingsGroup label="Style" options={STYLE_OPTIONS} selected={style} onSelect={setStyle} />
                  <SettingsGroup label="Color Palette" options={COLOR_PALETTES} selected={colorPalette} onSelect={setColorPalette} />
                  <SettingsGroup label="Composition" options={COMPOSITIONS} selected={composition} onSelect={setComposition} />
                  <SettingsGroup label="Lighting" options={LIGHTINGS} selected={lighting} onSelect={setLighting} />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-gray-800 text-sm font-bold mb-4">FORMAT SETTINGS</h2>
                  <AspectRatioGroup label="Aspect Ratio" options={ASPECT_RATIOS} selected={aspectRatio} onSelect={setAspectRatio} />
                  <SettingsGroup label="Quality" options={QUALITY_OPTIONS} selected={quality} onSelect={setQuality} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                type="submit"
                className={`flex-1 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
                disabled={loading}
              >
                {loading ? 'DERY LAU LOADING...' : 'Generate Image'}
              </button>
              <button
                type="button"
                onClick={handleGenerateJSON}
                className="flex-1 btn-secondary"
              >
                Generate JSON
              </button>
            </div>
          </form>
        </div>

        {jsonConfig && (
          <div className="mt-8 w-full max-w-5xl p-6 bg-white rounded-xl shadow-2xl ring-1 ring-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">JSON Configuration</h2>
            <pre className="text-sm bg-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-words text-gray-800">
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          </div>
        )}

        {image && !loading && (
          <div className="mt-8 w-full max-w-5xl p-6 bg-white rounded-xl shadow-2xl ring-1 ring-gray-100 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Image</h2>
            <img 
              src={image} 
              alt="Generated by Dery Lau AI" 
              className="rounded-lg max-w-full h-auto mb-4 border-2 border-gray-300 shadow-md"
            />
            <button
              onClick={handleDownload}
              className="btn-primary mt-2"
            >
              Download PNG
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-12 w-full max-w-5xl p-6 bg-white rounded-xl shadow-2xl ring-1 ring-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Prompt History</h2>
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {history.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                  <img
                    src={item.imageUrl}
                    alt="History"
                    className="w-full h-auto object-cover rounded-lg mb-2 border border-gray-200"
                  />
                  <p className="text-sm text-gray-700 line-clamp-2">{item.prompt}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
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
