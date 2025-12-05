import { useState, useEffect, FormEvent } from 'react';
import { XIcon } from './icons.tsx';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'openai'>('gemini');

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('gemini_key') || '';
    const storedOpenaiKey = localStorage.getItem('openai_key') || '';
    const storedModel = localStorage.getItem('selected_model') as 'gemini' | 'openai' || 'gemini';
    
    setGeminiKey(storedGeminiKey);
    setOpenaiKey(storedOpenaiKey);
    setSelectedModel(storedModel);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('gemini_key', geminiKey);
    localStorage.setItem('openai_key', openaiKey);
    localStorage.setItem('selected_model', selectedModel);
    
    // Close modal
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <XIcon className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as 'gemini' | 'openai')}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>

          {/* Gemini API Key */}
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-zinc-300 mb-2">
              Gemini API Key
            </label>
            <input
              id="gemini-key"
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Get your API key from{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {/* OpenAI API Key */}
          <div>
            <label htmlFor="openai-key" className="block text-sm font-medium text-zinc-300 mb-2">
              OpenAI API Key
            </label>
            <input
              id="openai-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              Get your API key from{' '}
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
