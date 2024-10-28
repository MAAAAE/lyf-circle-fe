"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useUserIdStore from "../hooks/useUserInfo";

type QuestionType =
  | "intro"
  | "credentials"
  | "text"
  | "multipleChoice"
  | "timeSelection"
  | "languageSelection"
  | "characteristicsPairs";

interface Question {
  type: QuestionType;
  question: string;
  options?: string[] | { left: string; right: string }[];
  description?: string;
}

const questions: Question[] = [
  {
    type: "intro",
    question: "Personal information consent",
    description:
      "We'd love to recommend activities tailored just for you. To do that, we kindly ask you to complete a short survey. By participating, you agree to share your preferences with us so our AI can suggest the best experiences during your stay.",
  },
  { type: "credentials", question: "Please enter your Id and Password" },
  { type: "text", question: "Please enter your NickName" },
  {
    type: "languageSelection",
    question: "Please enter the languages you can speak",
  },
  { type: "text", question: "Please enter your nationality" },
  {
    type: "multipleChoice",
    question:
      "Please select the activities you're interested in or would like to participate in. (you can choose multiple).",
    options: [
      "Reading",
      "Gaming",
      "Coding",
      "Language Exchange",
      "Cooking",
      "Weight lifting",
      "Yoga",
      "Music",
      "Party",
    ],
  },
  {
    type: "timeSelection",
    question:
      "Please select the available time slots for participation (you can choose multiple).",
    options: Array.from({ length: 34 }, (_, i) => {
      const hours = Math.floor(i / 2) + 7;
      const minutes = (i % 2) * 30;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    }),
  },
  {
    type: "characteristicsPairs",
    question: "Please select your characteristics",
    options: [
      { left: "Introverted", right: "Extroverted" },
      { left: "Detail-oriented", right: "Big-picture thinker" },
      { left: "Planner", right: "Spontaneous" },
      { left: "Analytical", right: "Creative" },
      { left: "Team player", right: "Independent worker" },
      { left: "Risk-taker", right: "Cautious" },
    ],
  },
];

interface FormData {
  username: string;
  password: string;
  nickname: string;
  langs: string[];
  country: string;
  hobbies: string[];
  times: string[];
  characteristics: string[];
}

interface MascotDialogueProps {
  message: string;
  isDarkMode: boolean;
}

// 마스코트 이미지 및 말풍선
function MascotDialogue({ message, isDarkMode }: MascotDialogueProps) {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lyf-avatar-tyQsPYtUM3rhuC06Vl0WKayntr1KIV.webp"
        alt="Mascot"
        width={80}
        height={80}
        className="w-20 h-20 object-contain rounded-lg"
      />
      <div
        className={`flex-1 rounded-lg p-3 ${
          isDarkMode ? "bg-[#3c3c45]" : "bg-blue-100"
        }`}
      >
        <p className={`text-sm ${isDarkMode ? "text-white" : "text-blue-800"}`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default function Component() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    nickname: "",
    langs: [],
    country: "",
    hobbies: [],
    times: [],
    characteristics: [],
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const { setUser_id } = useUserIdStore();

  const [countries, setCountries] = useState<{ code: string; name: string }[]>(
    []
  );
  const [languages, setLanguages] = useState<{ code: string; name: string }[]>(
    []
  );

  useEffect(() => {
    // Fetch countries and languages data
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,languages")
      .then((response) => response.json())
      .then((data) => {
        const sortedCountries = data
          .map((country: any) => ({
            code: country.cca2,
            name: country.name.common,
          }))
          .sort((a: { name: string }, b: { name: string }) =>
            a.name.localeCompare(b.name)
          );
        setCountries(sortedCountries);

        const languagesSet = new Set<string>();
        data.forEach((country: any) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang: any) => {
              languagesSet.add(lang);
            });
          }
        });
        const sortedLanguages = Array.from(languagesSet)
          .map((lang: any) => ({
            code: lang,
            name: lang,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setLanguages(sortedLanguages);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    validateCurrentQuestion();
  }, [currentQuestion, formData, agreedToTerms]);

  const validateCurrentQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case "intro":
        setIsNextDisabled(!agreedToTerms);
        break;
      case "credentials":
        setIsNextDisabled(
          formData.username.trim() === "" || formData.password.trim() === ""
        );
        break;
      case "text":
        const fieldName = currentQuestion === 2 ? "nickname" : "country";
        const fieldValue =
          formData[fieldName as keyof Pick<FormData, "nickname" | "country">];
        setIsNextDisabled(fieldValue.trim() === "");
        break;
      case "languageSelection":
        setIsNextDisabled(formData.langs.length === 0);
        break;
      case "multipleChoice":
        setIsNextDisabled(formData.hobbies.length === 0);
        break;
      case "timeSelection":
        setIsNextDisabled(formData.times.length === 0);
        break;
      case "characteristicsPairs":
        setIsNextDisabled(
          formData.characteristics.length !==
            (question.options as { left: string; right: string }[]).length
        );
        break;
      default:
        setIsNextDisabled(false);
    }
  };
  const handleLanguageChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      langs: prev.langs.includes(value)
        ? prev.langs.filter((lang) => lang !== value)
        : [...prev.langs, value],
    }));
  };

  const handleNationalityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      try {
        const response = await fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to register user");
        }

        const result = await response.json();
        // zustand에 유저 id저장
        setUser_id(result.id);
        console.log("User registered successfully:", result);
        router.push("/list");
      } catch (error) {
        console.error("Error registering user:", error);
        //테스트용 기록, 강제 전송
        console.log(formData);
        router.push("/list");
      }
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
    field: keyof Pick<FormData, "hobbies" | "characteristics">
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

  const handleCharacteristicChange = (value: string) => {
    setFormData((prev) => {
      const characteristicOptions = questions.find(
        (q) => q.type === "characteristicsPairs"
      )?.options as { left: string; right: string }[];
      const pairIndex = characteristicOptions.findIndex(
        (pair) => pair.left === value || pair.right === value
      );

      if (pairIndex === -1) return prev;

      const newCharacteristics = [...prev.characteristics];
      const oppositeValue =
        value === characteristicOptions[pairIndex].left
          ? characteristicOptions[pairIndex].right
          : characteristicOptions[pairIndex].left;

      // Remove the opposite value if it exists
      const oppositeIndex = newCharacteristics.indexOf(oppositeValue);
      if (oppositeIndex !== -1) {
        newCharacteristics.splice(oppositeIndex, 1);
      }

      // Toggle the selected value
      const valueIndex = newCharacteristics.indexOf(value);
      if (valueIndex === -1) {
        newCharacteristics.push(value);
      } else {
        newCharacteristics.splice(valueIndex, 1);
      }

      return { ...prev, characteristics: newCharacteristics };
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getMascotMessage = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case "intro":
        return "Welcome to our service! If you agree to share your personal information, we can provide you with tailored recommendations.";
      case "credentials":
        return "Please enter your ID and password. We'll keep them safe!";
      case "text":
        return currentQuestion === 2
          ? "Please enter your nickname. How about choosing a fun one?"
          : "Knowing your nationality will help us provide better service.";
      case "languageSelection":
        return "What languages do you speak? If you're multilingual, please enter all of them!";
      case "multipleChoice":
        return "Please select all the activities you're interested in. This will help us understand your preferences.";
      case "timeSelection":
        return "Please select the time slots you're available. We'll find the best times for you based on your schedule.";
      case "characteristicsPairs":
        return "Tell us about your personality. This will help us provide a better experience for you.";
      default:
        return "Thank you for answering the questions. Please continue!";
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case "intro":
        return (
          <div className="space-y-4">
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <h2 className="text-xl font-semibold">{question.question}</h2>
            <p>{question.description}</p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) =>
                  setAgreedToTerms(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to provide my personal information for the purpose of
                personalized recommendations.
              </label>
            </div>
          </div>
        );
      case "credentials":
        return (
          <div className="space-y-4">
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <div>
              <Label htmlFor="username" className="text-lg font-semibold">
                Id
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
                Password
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
      case "multipleChoice":
        return (
          <div className="space-y-4">
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <div className="grid grid-cols-2 gap-2">
              {(question.options as string[]).map((option, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    formData.hobbies.includes(option) ? "default" : "outline"
                  }
                  className={`justify-center ${
                    isDarkMode
                      ? formData.hobbies.includes(option)
                        ? "bg-[#7a7bff] text-white hover:bg-[#7a7bff] hover:text-white active:bg-[#7a7bff] active:text-white"
                        : "bg-[#3c3c45] text-white hover:bg-[#3c3c45] hover:text-white active:bg-[#3c3c45] active:text-white"
                      : formData.hobbies.includes(option)
                      ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                      : "bg-white text-gray-900 hover:bg-white hover:text-gray-900 active:bg-white active:text-gray-900"
                  }`}
                  onClick={() => handleMultipleChoice(option, "hobbies")}
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
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <div className="grid grid-cols-3 gap-2">
              {(question.options as string[]).map((time, index) => (
                <Button
                  key={index}
                  type="button"
                  variant={
                    formData.times.includes(time) ? "default" : "outline"
                  }
                  className={`${
                    isDarkMode
                      ? formData.times.includes(time)
                        ? "bg-[#7a7bff] text-white hover:bg-[#7a7bff] hover:text-white active:bg-[#7a7bff] active:text-white"
                        : "bg-[#3c3c45] text-white hover:bg-[#3c3c45] hover:text-white active:bg-[#3c3c45] active:text-white"
                      : formData.times.includes(time)
                      ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                      : "bg-white text-gray-900 hover:bg-white hover:text-gray-900 active:bg-white active:text-gray-900"
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
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <Select onValueChange={handleLanguageChange}>
              <SelectTrigger
                className={`w-full ${
                  isDarkMode
                    ? "bg-[#3c3c45] text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <SelectValue placeholder="Select languages" />
              </SelectTrigger>
              <SelectContent
                className={
                  isDarkMode
                    ? "bg-[#3c3c45] text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-200"
                }
              >
                {languages.map((lang) => (
                  <SelectItem
                    key={lang.code}
                    value={lang.code}
                    className={
                      isDarkMode
                        ? "focus:bg-[#4c4c55] focus:text-white"
                        : "focus:bg-gray-100 focus:text-gray-900"
                    }
                  >
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  {languages.find((l) => l.code === lang)?.name || lang}
                  <button
                    onClick={() => handleLanguageChange(lang)}
                    className="ml-2 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );
      case "text":
        if (currentQuestion === 4) {
          // Nationality question
          return (
            <div className="space-y-4">
              <MascotDialogue
                message={getMascotMessage()}
                isDarkMode={isDarkMode}
              />
              <Select onValueChange={handleNationalityChange}>
                <SelectTrigger
                  className={`w-full ${
                    isDarkMode
                      ? "bg-[#3c3c45] text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent
                  className={
                    isDarkMode
                      ? "bg-[#3c3c45] text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  }
                >
                  {countries.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className={
                        isDarkMode
                          ? "focus:bg-[#4c4c55] focus:text-white"
                          : "focus:bg-gray-100 focus:text-gray-900"
                      }
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }
        // Add a default return for other text questions
        return (
          <div className="space-y-4">
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            <Input
              type="text"
              id={currentQuestion === 2 ? "nickname" : "country"}
              name={currentQuestion === 2 ? "nickname" : "country"}
              value={formData[currentQuestion === 2 ? "nickname" : "country"]}
              onChange={handleInputChange}
              className={`w-full ${
                isDarkMode
                  ? "bg-[#3c3c45] text-white"
                  : "bg-white text-gray-900"
              }`}
            />
          </div>
        );
      case "characteristicsPairs":
        return (
          <div className="space-y-6">
            <MascotDialogue
              message={getMascotMessage()}
              isDarkMode={isDarkMode}
            />
            {(question.options as { left: string; right: string }[]).map(
              (pair, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">{`${pair.left} - ${pair.right}`}</Label>
                  <div className="flex justify-between gap-4">
                    <Button
                      type="button"
                      onClick={() => handleCharacteristicChange(pair.left)}
                      variant={
                        formData.characteristics.includes(pair.left)
                          ? "default"
                          : "outline"
                      }
                      className={`flex-1 ${
                        isDarkMode
                          ? formData.characteristics.includes(pair.left)
                            ? "bg-[#7a7bff] text-white hover:bg-[#7a7bff] hover:text-white active:bg-[#7a7bff] active:text-white"
                            : "bg-[#3c3c45] text-white hover:bg-[#3c3c45] hover:text-white active:bg-[#3c3c45] active:text-white"
                          : formData.characteristics.includes(pair.left)
                          ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                          : "bg-white text-gray-900 hover:bg-white hover:text-gray-900 active:bg-white active:text-gray-900"
                      }`}
                    >
                      {pair.left}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleCharacteristicChange(pair.right)}
                      variant={
                        formData.characteristics.includes(pair.right)
                          ? "default"
                          : "outline"
                      }
                      className={`flex-1 ${
                        isDarkMode
                          ? formData.characteristics.includes(pair.right)
                            ? "bg-[#7a7bff] text-white hover:bg-[#7a7bff] hover:text-white active:bg-[#7a7bff] active:text-white"
                            : "bg-[#3c3c45] text-white hover:bg-[#3c3c45] hover:text-white active:bg-[#3c3c45] active:text-white"
                          : formData.characteristics.includes(pair.right)
                          ? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                          : "bg-white text-gray-900 hover:bg-white hover:text-gray-900 active:bg-white active:text-gray-900"
                      }`}
                    >
                      {pair.right}
                    </Button>
                  </div>
                </div>
              )
            )}
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
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
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
            {currentQuestion === 0 ? (
              <Button
                onClick={handleNext}
                disabled={!agreedToTerms}
                className="w-full bg-[#7a7bff]"
              >
                Start survey
              </Button>
            ) : (
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className={
                    isDarkMode
                      ? "bg-[#3c3c45] text-white"
                      : "bg-white text-gray-900"
                  }
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className={`${
                    isDarkMode ? "bg-[#7a7bff]" : "bg-blue-600"
                  } text-white ${
                    isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {currentQuestion === questions.length - 1 ? "Submit" : "Next"}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
