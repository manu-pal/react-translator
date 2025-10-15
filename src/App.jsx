import React, { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import { API_CONFIG } from "./config/api.js";
import { languages } from "./consts/languages.js";

function App() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [languageSearchTerm, setLanguageSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [translationHistory, setTranslationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Filter languages based on search term
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
      lang.code.toLowerCase().includes(languageSearchTerm.toLowerCase())
  );

  // Get selected language name
  const selectedLanguageName =
    languages.find((lang) => lang.code === selectedLanguage)?.name || "";

  // Load history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem("translationHistory");
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setTranslationHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error("Error loading translation history:", error);
        // Clear corrupted data
        localStorage.removeItem("translationHistory");
        setTranslationHistory([]);
      }
    };

    loadHistory();
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      if (translationHistory.length > 0) {
        localStorage.setItem(
          "translationHistory",
          JSON.stringify(translationHistory)
        );
      } else {
        // Clear localStorage when history is empty
        localStorage.removeItem("translationHistory");
      }
    } catch (error) {
      console.error("Error saving translation history:", error);
    }
  }, [translationHistory]);

  // Add translation to history
  const addToHistory = useCallback(
    (inputText, translatedText, targetLanguage) => {
      const historyItem = {
        id: Date.now(),
        inputText,
        translatedText,
        targetLanguage,
        targetLanguageName:
          languages.find((lang) => lang.code === targetLanguage)?.name ||
          targetLanguage,
        timestamp: new Date().toISOString(),
      };

      setTranslationHistory((prev) => [historyItem, ...prev]);
    },
    []
  );

  // Delete individual history item
  const deleteHistoryItem = useCallback((id) => {
    setTranslationHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear all history
  const clearAllHistory = useCallback(() => {
    setTranslationHistory([]);
    localStorage.removeItem("translationHistory");
  }, []);

  // Reuse translation from history
  const reuseTranslation = useCallback((item) => {
    setInputText(item.inputText);
    setTranslatedText(item.translatedText);
    setSelectedLanguage(item.targetLanguage);
    setError("");
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(translationHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistoryItems = translationHistory.slice(startIndex, endIndex);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
        setLanguageSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Copy to clipboard functionality
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, [translatedText]);

  // Clear input text
  const clearInput = useCallback(() => {
    setInputText("");
    setTranslatedText("");
    setError("");
  }, []);

  // Handle language selection
  const handleLanguageSelect = useCallback((languageCode) => {
    setSelectedLanguage(languageCode);
    setIsLanguageDropdownOpen(false);
    setLanguageSearchTerm("");
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setLanguageSearchTerm(e.target.value);
    setIsLanguageDropdownOpen(true);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsLanguageDropdownOpen(false);
      setLanguageSearchTerm("");
    }
  }, []);

  // Translate text using RapidAPI
  const translateText = useCallback(async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    if (API_CONFIG.RAPIDAPI_KEY === "YOUR_RAPIDAPI_KEY_HERE") {
      setError("Please configure your RapidAPI key in src/config/api.js");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_CONFIG.RAPIDAPI_URL, {
        method: "POST",
        headers: {
          "x-rapidapi-key": API_CONFIG.RAPIDAPI_KEY,
          "x-rapidapi-host": API_CONFIG.RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_lang: selectedLanguage,
          text: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.translatedText) {
        setTranslatedText(data.translatedText);
        // Add to history
        addToHistory(inputText, data.translatedText, selectedLanguage);
      } else {
        throw new Error("Translation failed - no translated text received");
      }
    } catch (err) {
      setError(
        err.message ||
          "Translation failed. Please check your API configuration and try again."
      );
      console.error("Translation error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, selectedLanguage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌍 Text Translator
          </h1>
          <p className="text-gray-600">
            Translate your English text to 100+ languages
          </p>
        </div>

        {/* Main Translation Interface */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label
                  htmlFor="inputText"
                  className="block text-sm font-medium text-gray-700"
                >
                  English Text
                </label>
                <button
                  onClick={clearInput}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Clear
                </button>
              </div>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your English text here..."
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {inputText.length} characters
              </div>
            </div>

            {/* Output Section */}
            <div>
              <label
                htmlFor="translatedText"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Translation
              </label>
              <textarea
                id="translatedText"
                value={translatedText}
                readOnly
                placeholder="Your translation will appear here..."
                className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 resize-none"
              />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500">
                  {translatedText.length} characters
                </div>
                {translatedText && (
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Copy to clipboard
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Language Selection and Translate Button */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 relative " ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Language
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={
                    isLanguageDropdownOpen
                      ? languageSearchTerm
                      : selectedLanguageName
                  }
                  onChange={handleSearchChange}
                  onFocus={() => setIsLanguageDropdownOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search languages..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isLanguageDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Dropdown List */}
              {isLanguageDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                          selectedLanguage === lang.code
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-900"
                        }`}
                      >
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          ({lang.code})
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No languages found for "{languageSearchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={translateText}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Translating...
                </>
              ) : (
                <>🔄 Translate</>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {translatedText && !error && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                ✅ Translation completed successfully!
              </p>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                📚 Translation History ({translationHistory.length})
              </h2>
              {translationHistory.length > 0 && (
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>
                    Most used:{" "}
                    {(() => {
                      const languageCounts = translationHistory.reduce(
                        (acc, item) => {
                          acc[item.targetLanguageName] =
                            (acc[item.targetLanguageName] || 0) + 1;
                          return acc;
                        },
                        {}
                      );
                      const mostUsed = Object.entries(languageCounts).reduce(
                        (a, b) => (a[1] > b[1] ? a : b)
                      );
                      return `${mostUsed[0]} (${mostUsed[1]})`;
                    })()}
                  </span>
                  <span>•</span>
                  <span>
                    Total characters:{" "}
                    {translationHistory
                      .reduce(
                        (acc, item) =>
                          acc +
                          item.inputText.length +
                          item.translatedText.length,
                        0
                      )
                      .toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {translationHistory.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {translationHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>
                No translations yet. Start translating to see your history here!
              </p>
            </div>
          ) : (
            <>
              {/* History Items */}
              <div className="space-y-4 mb-6">
                {currentHistoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => reuseTranslation(item)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {item.targetLanguageName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">
                            Click to reuse
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Original:
                            </p>
                            <p className="text-gray-600 bg-gray-50 p-2 rounded text-sm">
                              {item.inputText}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Translation:
                            </p>
                            <p className="text-gray-600 bg-gray-50 p-2 rounded text-sm">
                              {item.translatedText}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                        className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete this translation"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, translationHistory.length)} of{" "}
                    {translationHistory.length} translations
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 text-sm rounded transition-colors ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      {totalPages > 5 && (
                        <>
                          <span className="text-gray-500">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              currentPage === totalPages
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with React + Tailwind CSS • Powered by{" "}
            <a
              href="https://rapidapi.com/openl-translate/api/openl-translate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              OpenL Translate API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
