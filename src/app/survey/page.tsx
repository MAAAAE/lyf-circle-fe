"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Moon,
  Sun,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type QuestionType =
  | "credentials"
  | "text"
  | "multipleChoice"
  | "timeSelection"
  | "languageSelection";

interface Question {
  type: QuestionType;
  question: string;
  options?: string[];
}

const questions: Question[] = [
  { type: "credentials", question: "아이디와 비밀번호를 입력해주세요." },
  { type: "text", question: "닉네임을 입력해주세요." },
  {
    type: "languageSelection",
    question: "구사할 수 있는 언어를 입력해주세요.",
  },
  { type: "text", question: "국적을 입력해주세요." },
  {
    type: "multipleChoice",
    question: "관심 있는 활동을 선택해주세요.",
    options: ["reading", "gaming", "coding", "work out", "music", "art"],
  },
  {
    type: "timeSelection",
    question: "참여 가능한 시간을 선택해주세요.",
    options: Array.from(
      { length: 18 },
      (_, i) => `${(i + 7).toString().padStart(2, "0")}:00`
    ),
  },
  {
    type: "multipleChoice",
    question: "자신의 특징을 선택해주세요.",
    options: [
      "introvert",
      "extrovert",
      "detail-oriented",
      "big-picture thinker",
      "team-player",
      "independent worker",
    ],
  },
];

export default function Component() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    langs: [] as string[],
    country: "",
    hobbies: [] as string[],
    times: [] as string[],
    characteristics: [] as string[],
  });
  const [languageInput, setLanguageInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log(JSON.stringify(formData, null, 2)); // Log the final JSON result
      router.push("/list");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultipleChoice = (
    option: string,
    field: "hobbies" | "characteristics"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(option)
        ? prev[field].filter((item) => item !== option)
        : [...prev[field], option],
    }));
  };

  const handleTimeSelection = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter((t) => t !== time)
        : [...prev.times, time],
    }));
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        langs: [...prev.langs, languageInput.trim()],
      }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      langs: prev.langs.filter((l) => l !== lang),
    }));
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case "credentials":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-lg font-semibold">
                아이디
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full mt-1 ${
                  isDarkMode
                    ? "bg-[#3c3c45] text-white"
                    : "bg-white text-gray-900"
                }`}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-lg font-semibold">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full mt-1 pr-10 ${
                    isDarkMode
                      ? "bg-[#3c3c45] text-white"
                      : "bg-white text-gray-900"
                  }`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      case "text":
        const fieldName = currentQuestion === 1 ? "nickname" : "country";
        return (
          <div className="space-y-4">
            <Label htmlFor={fieldName} className="text-lg font-semibold">
              {question.question}
            </Label>
            <Input
              type="text"
              id={fieldName}
              name={fieldName}
              value={formData[fieldName as keyof typeof formData] as string}
              onChange={handleInputChange}
              className={`w-full ${
                isDarkMode
                  ? "bg-[#3c3c45] text-white"
                  : "bg-white text-gray-900"
              }`}
            />
          </div>
        );
      case "multipleChoice":
        const choiceField =
          currentQuestion === 4 ? "hobbies" : "characteristics";
        return (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{question.question}</Label>
            <div className="grid grid-cols-2 gap-2">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    formData[choiceField].includes(option)
                      ? "default"
                      : "outline"
                  }
                  className={`justify-center ${
                    isDarkMode
                      ? formData[choiceField].includes(option)
                        ? "bg-[#7a7bff] text-white"
                        : "bg-[#3c3c45] text-white"
                      : formData[choiceField].includes(option)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  onClick={() => handleMultipleChoice(option, choiceField)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );
      case "timeSelection":
        return (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{question.question}</Label>
            <div className="grid grid-cols-3 gap-2">
              {question.options?.map((time, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    formData.times.includes(time) ? "default" : "outline"
                  }
                  className={`${
                    isDarkMode
                      ? formData.times.includes(time)
                        ? "bg-[#7a7bff] text-white"
                        : "bg-[#3c3c45] text-white"
                      : formData.times.includes(time)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                  }`}
                  onClick={() => handleTimeSelection(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        );
      case "languageSelection":
        return (
          <div className="space-y-4">
            <Label className="text-lg font-semibold">{question.question}</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                placeholder="언어를 입력하세요"
                className={`flex-grow ${
                  isDarkMode
                    ? "bg-[#3c3c45] text-white"
                    : "bg-white text-gray-900"
                }`}
              />
              <Button
                onClick={addLanguage}
                className={
                  isDarkMode
                    ? "bg-[#7a7bff] text-white"
                    : "bg-blue-600 text-white"
                }
              >
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.langs.map((lang, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full flex items-center ${
                    isDarkMode
                      ? "bg-[#3c3c45] text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {lang}
                  <button
                    onClick={() => removeLanguage(lang)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-[#1c1c23] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`flex justify-between items-center p-4 ${
          isDarkMode ? "bg-[#2c2c35]" : "bg-white"
        } shadow-md`}
      >
        <h1
          className={`text-2xl font-bold ${
            isDarkMode ? "text-[#7a7bff]" : "text-blue-600"
          }`}
        >
          Registration Form
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-600 transition-colors duration-200"
            aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex justify-center p-4">
          <div
            className={`w-full flex flex-col justify-between max-w-md ${
              isDarkMode ? "bg-[#2c2c35]" : "bg-white"
            } rounded-lg shadow-lg p-6`}
          >
            <Progress
              value={(currentQuestion / (questions.length - 1)) * 100}
              className="w-full [&>*]:bg-blue-400"
            />
            {renderQuestion()}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
                className={
                  isDarkMode
                    ? "bg-[#3c3c45] text-white"
                    : "bg-white text-gray-900"
                }
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> 이전
              </Button>
              <Button
                onClick={handleNext}
                className={
                  isDarkMode
                    ? "bg-[#7a7bff] text-white"
                    : "bg-blue-600 text-white"
                }
              >
                {currentQuestion === questions.length - 1 ? "제출" : "다음"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
