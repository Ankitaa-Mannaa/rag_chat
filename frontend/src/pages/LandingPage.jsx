// src/pages/LandingPage.jsx
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import botAnimation from "../assets/Cloud robotics abstract.json";
import { Link } from "react-router-dom";

const sentences = [
  "Welcome to ReasonBot",
  "Your AI assistant for better answers",
  "Ask. Engage. Learn. Grow.",
  "No card required, Free forever plan.",
];

export default function LandingPage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % sentences.length);
    }, 3000); // change sentence every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700/70 via-white to-pink-700/70 relative overflow-hidden">

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side Animation */}
          <div className="flex justify-center relative">
            <div className="relative">
              <Lottie 
                animationData={botAnimation} 
                loop={true} 
                className="w-80 h-80 lg:w-96 lg:h-96 drop-shadow-2xl" 
              />
              
              {/* Floating elements around animation */}
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-6 -left-6 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-500"></div>
              <div className="absolute top-1/3 -left-8 w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
              
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex flex-col items-start space-y-6 lg:ml-[-48px]">

            {/* Main Heading */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-purple-700 to-blue-800 leading-tight">
                ReasonBot
              </h1>
              
              {/* Transitioning tagline */}
              <div className="relative h-16 mb-4">
                {sentences.map((text, i) => (
                  <p
                    key={i}
                    className={`absolute transition-all duration-1000 text-2xl lg:text-3xl font-bold ${
                      i === index 
                        ? "opacity-100 transform translate-y-0" 
                        : "opacity-0 transform translate-y-4"
                    } ${
                      i === 0 ? "text-purple-800" : 
                      i === 1 ? "text-blue-700" : 
                      "text-purple-600"
                    }`}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm italic text-indigo-800 max-w-xl leading-relaxed font-bold">
              Explore how ReasonBot helps you analyze, explain, and make sense of your
              documents with AI-driven reasoning. Upload documents, ask questions, and
              get instant answers with full transparency. And yes it's FOR FREE!
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-auto">
              {[
                { icon: "📄", text: "Get Document Analysis" },
                { icon: "🤖", text: "AI-Powered Insights" },
                { icon: "⚡", text: "Instant Answers" },
                { icon: "🔍", text: "Deep Reasoning" }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm shadow-md py-2 px-4 border border-white/40 hover:bg-white/80 transition-all">
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="font-semibold text-gray-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Link to="/register" className="flex-1">
                <button className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-800 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 font-semibold text-lg">
                  Get started to explore out features
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}