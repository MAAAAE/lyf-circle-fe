"use client";

import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  ArrowLeft,
  MessageCircle,
  Users,
  Calendar,
  ChevronUp,
} from "lucide-react";
import ChatComponent from "./ChatComponent";
import useUserIdStore from "../hooks/useUserInfo";

interface ActivityDetail {
  title: string;
  content: string;
}

interface Activity {
  id: number;
  name: string;
  date: {
    month: number;
    day: number;
    weekday: string;
    time: string;
  };
  participants: number;
  emoji: string;
  location: string;
  description: string;
  hasNewMessages: boolean;
  details: ActivityDetail[];
}

export default function Component() {
  const [visibleItems, setVisibleItems] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const { user_id } = useUserIdStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      name: "Gardens by the Bay Yoga Session",
      date: { month: 5, day: 20, weekday: "Sat", time: "07:30" },
      participants: 3,
      emoji: "🧘",
      location: "Supertree Grove, Gardens by the Bay",
      description:
        "Start your day with a rejuvenating yoga session amidst the iconic Supertrees. Experience tranquility in the heart of Singapore's urban oasis.",
      hasNewMessages: true,
      details: [
        { title: "What to bring", content: "Yoga mat, water bottle, towel" },
        { title: "Duration", content: "1 hour" },
        { title: "Difficulty", content: "All levels welcome" },
        { title: "Capacity", content: "Maximum 20 people" },
      ],
    },
    {
      id: 2,
      name: "Night Cycling at East Coast Park",
      date: { month: 5, day: 21, weekday: "Sun", time: "19:30" },
      participants: 2,
      emoji: "🚴",
      location: "East Coast Park",
      description:
        "Enjoy a refreshing evening cycle along Singapore's scenic East Coast. Feel the sea breeze as you ride under the stars.",
      hasNewMessages: false,
      details: [
        {
          title: "What to bring",
          content: "Bicycle (rentals available), helmet, water",
        },
        { title: "Duration", content: "2 hours" },
        { title: "Difficulty", content: "Beginner" },
        { title: "Capacity", content: "Maximum 12 people" },
      ],
    },
    {
      id: 3,
      name: "Peranakan Cuisine Cooking Class",
      date: { month: 5, day: 22, weekday: "Mon", time: "11:00" },
      participants: 4,
      emoji: "🍲",
      location: "Katong Kitchen Studio",
      description:
        "Learn to cook authentic Peranakan dishes in this hands-on class. Discover the rich flavors and traditions of Singaporean Nyonya cuisine.",
      hasNewMessages: true,
      details: [
        { title: "What to bring", content: "Apron (optional)" },
        { title: "Duration", content: "3 hours" },
        { title: "Difficulty", content: "Beginner to Intermediate" },
        { title: "Capacity", content: "Maximum 8 people" },
      ],
    },
    {
      id: 4,
      name: "Sentosa Island Segway Tour",
      date: { month: 5, day: 27, weekday: "Sat", time: "14:00" },
      participants: 2,
      emoji: "🛴",
      location: "Sentosa Segway Tours Meeting Point",
      description:
        "Explore the beautiful Sentosa Island on a Segway. Glide past beaches, forests, and historical sites on this guided tour.",
      hasNewMessages: false,
      details: [
        {
          title: "What to bring",
          content: "Comfortable shoes, sunscreen, sunglasses",
        },
        { title: "Duration", content: "2 hours" },
        { title: "Difficulty", content: "Beginner (training provided)" },
        { title: "Capacity", content: "Maximum 10 people" },
      ],
    },
    {
      id: 5,
      name: "Batik Painting Workshop",
      date: { month: 5, day: 31, weekday: "Wed", time: "16:00" },
      participants: 5,
      emoji: "🎨",
      location: "Kampong Gelam Community Club",
      description:
        "Immerse yourself in the art of Batik painting. Learn traditional techniques and create your own unique Batik masterpiece to take home.",
      hasNewMessages: false,
      details: [
        { title: "What to bring", content: "Old clothes or apron" },
        { title: "Duration", content: "2.5 hours" },
        { title: "Difficulty", content: "Beginner" },
        { title: "Capacity", content: "Maximum 12 people" },
      ],
    },
  ]);

  const [lyfEvent, setLyfEvent] = useState<Activity>({
    id: 0,
    name: "lyf Exclusive Rooftop Yoga",
    date: { month: 10, day: 28, weekday: "Mon", time: "10:00" },
    participants: 0,
    emoji: "🎃",
    location: "lyf Funan Singapore",
    description:
      "[RESIDENT EXCLUSIVE] Join us for a spooky halloween 2024! Make your own witches potions art & craft and bring your little ones to make their own pumpkin using playdough, or even get a DIY halloween mask to celebrate the occassion! Come together on the eve of halloween to try your hand at making your own unique halloween themed mocktail at our 'Potion Bar'. See you there!",
    hasNewMessages: false,
    details: [
      // { title: "What to bring", content: "Yoga mat (we provide if needed), comfortable clothes" },
      // { title: "Duration", content: "1 hour" },
      // { title: "Difficulty", content: "All levels welcome" },
      // { title: "Capacity", content: "Maximum 15 people" },
    ],
  });

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // 리스트를 받아올 API
        const response = await fetch("http://localhost:8080/activities");
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => (prev < activities.length ? prev + 1 : prev));
    }, 100);

    return () => clearInterval(timer);
  }, [activities.length]);

  useEffect(() => {
    const sortedActivities = [...activities].sort((a, b) => {
      if (sortBy === "date") {
        return (
          a.date.month * 100 + a.date.day - (b.date.month * 100 + b.date.day)
        );
      } else if (sortBy === "participants") {
        return b.participants - a.participants;
      }
      return 0;
    });
    setActivities(sortedActivities);
    setVisibleItems(0);
    const timer = setTimeout(() => setVisibleItems(activities.length), 100);
    return () => clearTimeout(timer);
  }, [sortBy]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleActivityClick = (activity: Activity) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedActivity(activity);
      setIsTransitioning(false);
      setActivities((prevActivities) =>
        prevActivities.map((a) =>
          a.id === activity.id ? { ...a, hasNewMessages: false } : a
        )
      );
    }, 300);
  };

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedActivity(null);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNewMessage = (activityId: number) => {
    setActivities((prevActivities) =>
      prevActivities.map((a) =>
        a.id === activityId ? { ...a, hasNewMessages: true } : a
      )
    );
  };

  const toggleDetails = () => {
    setIsDetailsExpanded(!isDetailsExpanded);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-[#1c1c23] text-white" : "bg-gray-100 text-gray-900"
      } font-sans`}
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
          AI Activity
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
          <User
            className={`w-8 h-8 ${
              isDarkMode
                ? "text-white bg-[#3c3c45]"
                : "text-gray-600 bg-gray-200"
            } rounded-full p-1`}
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isTransitioning
              ? "opacity-0 transform translate-x-full"
              : "opacity-100 transform translate-x-0"
          }`}
        >
          {selectedActivity ? (
            <div
              className={`${
                isDarkMode ? "bg-[#2c2c35]" : "bg-white"
              } rounded-lg shadow-lg p-6 flex flex-col flex-grow`}
            >
              <button
                onClick={handleBackClick}
                className={`mb-6 flex items-center ${
                  isDarkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                } transition-colors duration-200`}
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <div className="flex items-start mb-6">
                <span
                  className="text-5xl mr-6"
                  role="img"
                  aria-label={selectedActivity.name}
                >
                  {selectedActivity.emoji}
                </span>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedActivity.name}
                  </h2>
                  <div className="flex items-center text-sm space-x-4">
                    <div
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {selectedActivity.date.month}/
                        {selectedActivity.date.day}{" "}
                        {selectedActivity.date.weekday}{" "}
                        {selectedActivity.date.time}
                      </span>
                    </div>
                    <div
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{selectedActivity.location}</span>
                    </div>
                    <div
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      <span>participants: {selectedActivity.participants}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } text-lg leading-relaxed`}
              >
                {selectedActivity.description}
              </p>
              <div className="space-y-6 flex flex-col flex-grow">
                <div
                  className={`${
                    isDarkMode ? "bg-[#3c3c45]" : "bg-gray-100"
                  } rounded-lg transition-all duration-300 ease-in-out ${
                    isDetailsExpanded
                      ? "max-h-[1000px]"
                      : "max-h-[60px] overflow-hidden"
                  }`}
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
                    onClick={toggleDetails}
                    role="button"
                    aria-expanded={isDetailsExpanded}
                    aria-controls="activity-details"
                  >
                    <h3 className="text-xl font-semibold">Details</h3>
                    {isDetailsExpanded ? (
                      <ChevronUp className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-6 h-6" aria-hidden="true" />
                    )}
                  </div>
                  <div id="activity-details" className="px-4 pb-4">
                    <ul
                      className={`list-disc list-inside ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {selectedActivity.details.map(
                        (detail: ActivityDetail, index: number) => (
                          <li key={index} className="mb-2">
                            <span className="font-semibold">
                              {detail.title}:
                            </span>{" "}
                            {detail.content}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex-grow">
                  <ChatComponent
                    isDarkMode={isDarkMode}
                    onNewMessage={() => handleNewMessage(selectedActivity.id)}
                    userId={user_id}
                    initialMessages={[
                      {
                        content:
                          "안녕하세요! 이 활동에 대해 궁금한 점이 있으신가요?",
                        sender: "host",
                        senderId: "ai",
                        type: "CHAT",
                        eventId: selectedActivity.id.toString(),
                        timestamp: "NOW",
                        avatar:
                          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lyf-avatar-tyQsPYtUM3rhuC06Vl0WKayntr1KIV.webp",
                      },
                    ]}
                    eventId={selectedActivity.id.toString()}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Suggested Activities</h2>
                <div className="relative">
                  <select
                    className={`appearance-none ${
                      isDarkMode
                        ? "bg-[#2c2c35] text-white"
                        : "bg-white text-gray-900"
                    } px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a7bff] transition-colors duration-200`}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="정렬 기준"
                  >
                    <option value="date">date</option>
                    <option value="participants">participant</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div
                className={`mb-4 p-4 ${
                  isDarkMode ? "bg-[#3c3c45]" : "bg-white"
                } rounded-lg shadow-lg border-2 border-[#7a7bff] cursor-pointer`}
                onClick={() => handleActivityClick(lyfEvent)}
                role="button"
                tabIndex={0}
                aria-label={`${lyfEvent.name} 상세 정보 보기`}
                style={{
                  opacity: 0,
                  animation: `fadeIn 0.3s ease-out ${0.05}s forwards`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span
                      className="text-3xl mr-3"
                      role="img"
                      aria-label={lyfEvent.name}
                    >
                      {lyfEvent.emoji}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold">{lyfEvent.name}</h3>
                      <div
                        className={`flex items-center text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        } mt-1`}
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{lyfEvent.location}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      isDarkMode ? "bg-[#2c2c35]" : "bg-gray-200"
                    } px-3 py-1 rounded-full flex items-center`}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                      {lyfEvent.date.month}/{lyfEvent.date.day}
                    </span>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } ml-1`}
                    >
                      {lyfEvent.date.weekday} {lyfEvent.date.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mt-3 justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(3, lyfEvent.participants))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full ${
                              isDarkMode
                                ? "bg-[#2c2c35] border-[#3c3c45]"
                                : "bg-gray-300 border-white"
                            } border-2 flex items-center justify-center text-xs font-semibold`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        )
                      )}
                      {lyfEvent.participants > 3 && (
                        <div
                          className={`w-8 h-8 rounded-full ${
                            isDarkMode
                              ? "bg-[#2c2c35] border-[#3c3c45]"
                              : "bg-gray-300 border-white"
                          } border-2 flex items-center justify-center text-xs font-semibold`}
                        >
                          +{lyfEvent.participants - 3}
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } ml-3`}
                    >
                      participants : {lyfEvent.participants}
                    </span>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-[#7a7bff]" : "text-blue-600"
                    }`}
                  >
                    Sponsored by lyf
                  </div>
                </div>
              </div>

              {activities
                .slice(0, visibleItems)
                .map((activity: Activity, index: number) => (
                  <div
                    key={activity.id}
                    className={`mb-4 p-4 ${
                      isDarkMode ? "bg-[#2c2c35]" : "bg-white"
                    } rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer`}
                    style={{
                      opacity: 0,
                      animation: `fadeIn 0.3s ease-out ${
                        index * 0.05
                      }s forwards`,
                    }}
                    onClick={() => handleActivityClick(activity)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${activity.name} 상세 정보 보기`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span
                          className="text-3xl mr-3"
                          role="img"
                          aria-label={activity.name}
                        >
                          {activity.emoji}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {activity.name}
                          </h3>
                          <div
                            className={`flex items-center text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            } mt-1`}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${
                          isDarkMode ? "bg-[#3c3c45]" : "bg-gray-200"
                        } px-3 py-1 rounded-full flex items-center`}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          {activity.date.month}/{activity.date.day}
                        </span>
                        <span
                          className={`text-xs ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } ml-1`}
                        >
                          {activity.date.weekday} {activity.date.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-3 justify-between">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, activity.participants))].map(
                            (_, i) => (
                              <div
                                key={i}
                                className={`w-8 h-8 rounded-full ${
                                  isDarkMode
                                    ? "bg-[#3c3c45] border-[#2c2c35]"
                                    : "bg-gray-300 border-white"
                                } border-2 flex items-center justify-center text-xs font-semibold`}
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            )
                          )}
                          {activity.participants > 3 && (
                            <div
                              className={`w-8 h-8 rounded-full ${
                                isDarkMode
                                  ? "bg-[#3c3c45] border-[#2c2c35]"
                                  : "bg-gray-300 border-white"
                              } border-2 flex items-center justify-center text-xs font-semibold`}
                            >
                              +{activity.participants - 3}
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          } ml-3`}
                        >
                          participants : {activity.participants}
                        </span>
                      </div>
                      {activity.hasNewMessages && (
                        <div
                          className={`flex items-center ${
                            isDarkMode ? "text-[#7a7bff]" : "text-blue-600"
                          }`}
                        >
                          <MessageCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">새 메시지</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
