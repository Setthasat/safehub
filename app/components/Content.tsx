"use client";
import React, { useEffect, useState } from "react";
import { Search, X, Mail, Send } from "lucide-react";

// Types
interface Fact {
  id: number;
  title: string;
  image: string;
  link: string;
  tags: string[];
}

import { data } from "../data/data";

// EmailJS types
declare global {
  interface Window {
    emailjs: any;
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Email Request Component
interface EmailRequestProps {
  searchTerm: string;
  onEmailSent: () => void;
}

function EmailRequest({ searchTerm, onEmailSent }: EmailRequestProps) {
  const [email, setEmail] = useState<string>("");
  const [topic, setTopic] = useState<string>(searchTerm);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Load EmailJS script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init("_-fqU6ZNO0hlRtuXW");
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !topic) {
      setStatus("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setStatus("");

    const templateParams = {
      from_email: email,
      topic: topic,
      search: searchTerm,
      message: message || "No additional message",
    };

    try {
      if (window.emailjs) {
        const result = await window.emailjs.send(
          "service_cs6p1ol",
          "template_qdk0755",
          templateParams
        );
        
        console.log("Email sent successfully:", result);
        setStatus("Request sent successfully! We'll get back to you soon.");
        setEmail("");
        setTopic("");
        setMessage("");
        setTimeout(() => {
          onEmailSent();
        }, 2000);
      } else {
        throw new Error("EmailJS not loaded");
      }
    } catch (error) {
      console.error("Email send error:", error);
      let errorMessage = "Unknown error";
      if (typeof error === "object" && error !== null) {
        if ("text" in error && typeof (error as any).text === "string") {
          errorMessage = (error as any).text;
        } else if ("message" in error && typeof (error as any).message === "string") {
          errorMessage = (error as any).message;
        }
      }
      setStatus(`Failed to send request: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#EFFFFB] border-2 border-dashed border-[#50D890] rounded-xl p-6 text-center">
      <Mail className="w-12 h-12 mx-auto mb-4 text-[#50D890]" />
      <h3 className="text-lg font-bold text-black mb-2">
        Didn't find what you're looking for?
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Tell us what topic you'd like to see, and we'll consider adding it!
      </p>
      
      <form onSubmit={sendEmail} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address *"
            className="w-full p-3 border-2 border-[#50D890] rounded-lg focus:outline-none focus:border-black text-black"
            required
          />
        </div>
        
        <div>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What topic would you like to see? *"
            className="w-full p-3 border-2 border-[#50D890] rounded-lg focus:outline-none focus:border-black text-black"
            required
          />
        </div>
        
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Additional details (optional)"
            rows={3}
            className="w-full p-3 border-2 border-[#50D890] rounded-lg focus:outline-none focus:border-black text-black resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#50D890] hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Request
            </>
          )}
        </button>
        
        {status && (
          <p className={`text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Fact[]>([]);
  const [showEmailForm, setShowEmailForm] = useState<boolean>(false);
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 100);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setSearchResults([]);
      setShowEmailForm(false);
      return;
    }

    const filtered = data.filter((fact: Fact) => {
      const titleMatch = fact.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const tagMatch = fact.tags.some((tag: string) => 
        tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      return titleMatch || tagMatch;
    });

    setSearchResults(filtered);
    setShowEmailForm(filtered.length === 0 && debouncedSearchTerm.trim() !== "");
  }, [debouncedSearchTerm]);

  const handleClose = (): void => {
    setSearchTerm("");
    setSearchResults([]);
    setShowEmailForm(false);
    onClose();
  };

  const handleEmailSent = (): void => {
    setShowEmailForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Search Facts</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#50D890] hover:text-white rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Search by name or tags..."
              className="w-full p-4 pr-12 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#50D890] text-gray-800"
              autoFocus
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {searchTerm.trim() === "" ? (
            <div className="text-center text-gray-500 py-8">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Start typing to search for facts...</p>
            </div>
          ) : showEmailForm ? (
            <div className="space-y-6">
              <div className="text-center text-gray-500 py-4">
                <p className="text-lg">No facts found matching "{searchTerm}"</p>
                <p className="text-sm mt-2">But we'd love to help you find what you're looking for!</p>
              </div>
              <EmailRequest searchTerm={searchTerm} onEmailSent={handleEmailSent} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((fact: Fact) => (
                <SearchResultCard key={fact.id} fact={fact} onClose={handleClose} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  fact: Fact;
  onClose: () => void;
}

function SearchResultCard({ fact, onClose }: SearchResultCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      {/* Image with tags */}
      <div className="relative w-full h-40">
        <img
          src={fact.image}
          alt={fact.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-wrap gap-1">
          {fact.tags?.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex justify-between items-center gap-3">
        <h3 className="text-lg font-bold text-gray-800 flex-1">{fact.title}</h3>
        <a
          href={fact.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="bg-red-500 text-white text-xs px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition whitespace-nowrap"
        >
          Visit
        </a>
      </div>
    </div>
  );
}

interface CardProps {
  fact?: Fact;
  className?: string;
}

function Card({ fact, className = "" }: CardProps) {
  if (!fact) return null;

  return (
    <div
      className={`bg-[#EFFFFB] rounded-2xl flex flex-col shadow-md hover:shadow-xl transition overflow-hidden h-full relative ${className}`}
    >
      <div className="relative w-full h-48">
        <img
          src={fact.image}
          alt={fact.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-wrap gap-2">
          {fact.tags?.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2 py-1 text-xs font-semibold bg-black/70 text-white rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex justify-between gap-3 flex-grow">
        <h3 className="text-lg font-bold">{fact.title}</h3>
        <a
          href={fact.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-500 text-white text-xs px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition"
        >
          Visit
        </a>
      </div>
    </div>
  );
}

function Content() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setFacts(shuffled.slice(0, 4));
  }, []);

  return (
    <>
      <section
        id="content"
        className="relative w-full bg-[#50D890] flex flex-col items-center px-4 py-16 scroll-smooth"
      >
        {/* Search Bar */}
        <div className="absolute -top-8 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2">
          <div className="flex items-center bg-[#EFFFFB] rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              placeholder="SEARCH FORM TAGS OR NAME"
              className="flex-1 p-8 bg-transparent focus:outline-none text-black font-bold cursor-pointer"
              onClick={() => setIsSearchOpen(true)}
              readOnly
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-4 bg-transparent text-black hover:text-[#50D890] transition-colors"
            >
              <Search />
            </button>
          </div>
        </div>

        {/* Random Fact Section */}
        <div className="mt-20 w-full max-w-6xl flex flex-col gap-6">
          <h2 className="text-[#EFFFFB] font-bold text-xl sm:text-2xl flex items-center gap-2">
            RANDOM FACT FOR YOU TODAY{" "}
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          </h2>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card fact={facts[0]} className="sm:col-span-2" />
            <Card fact={facts[1]} />
            <Card fact={facts[2]} />
            <Card fact={facts[3]} className="sm:col-span-2" />
          </div>
        </div>
      </section>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}

export default Content;