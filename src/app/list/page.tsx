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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      name: "도심 속 힐링 요가 클래스",
      date: { month: 5, day: 20, weekday: "토", time: "15:00" },
      participants: 3,
      emoji: "🧘",
      location: "서울숲 공원",
      description:
        "도심 속 자연에서 진행되는 힐링 요가 클래스입니다. 숲의 맑은 공기를 마시며 몸과 마음의 균형을 찾아보세요.",
      hasNewMessages: true,
      details: [
        { title: "준비물", content: "편한 복장, 물, 요가 매트 (대여 가능)" },
        { title: "소요 시간", content: "약 1시간 30분" },
        { title: "난이도", content: "초급 ~ 중급" },
        { title: "인원 제한", content: "최대 10명" },
      ],
    },
    {
      id: 2,
      name: "한강 야경 자전거 투어",
      date: { month: 5, day: 21, weekday: "일", time: "19:00" },
      participants: 2,
      emoji: "🚴",
      location: "여의도 한강공원",
      description:
        "서울의 아름다운 야경을 감상하며 한강을 따라 자전거를 타는 투어입니다. 도시의 밤을 새롭게 경험해보세요.",
      hasNewMessages: false,
      details: [
        { title: "준비물", content: "자전거 (대여 가능), 헬멧, 물" },
        { title: "소요 시간", content: "약 2시간" },
        { title: "난이도", content: "초급" },
        { title: "인원 제한", content: "최대 8명" },
      ],
    },
    {
      id: 3,
      name: "비건 쿠킹 클래스",
      date: { month: 5, day: 22, weekday: "월", time: "11:00" },
      participants: 4,
      emoji: "🥗",
      location: "강남구 쿠킹 스튜디오",
      description:
        "건강하고 맛있는 비건 요리를 배우는 쿠킹 클래스입니다. 채식 위주의 식단에 관심 있는 분들께 추천합니다.",
      hasNewMessages: true,
      details: [
        { title: "준비물", content: "앞치마" },
        { title: "소요 시간", content: "약 2시간" },
        { title: "난이도", content: "초급 ~ 중급" },
        { title: "인원 제한", content: "최대 6명" },
      ],
    },
    {
      id: 4,
      name: "실내 클라이밍 체험",
      date: { month: 5, day: 27, weekday: "토", time: "14:00" },
      participants: 2,
      emoji: "🧗",
      location: "홍대 클라이밍 센터",
      description:
        "실내 암벽 등반을 체험해보는 클래스입니다. 초보자도 안전하게 즐길 수 있으며, 전신 운동 효과를 얻을 수 있습니다.",
      hasNewMessages: false,
      details: [
        { title: "준비물", content: "운동복, 실내용 운동화" },
        { title: "소요 시간", content: "약 2시간" },
        { title: "난이도", content: "초급" },
        { title: "인원 제한", content: "최대 6명" },
      ],
    },
    {
      id: 5,
      name: "전통 도예 원데이 클래스",
      date: { month: 5, day: 31, weekday: "수", time: "16:00" },
      participants: 5,
      emoji: "🏺",
      location: "인사동 전통공방",
      description:
        "한국 전통 도예를 배우는 원데이 클래스입니다. 자신만의 도자기를 만들어보는 특별한 경험을 해보세요.",
      hasNewMessages: false,
      details: [
        { title: "준비물", content: "앞치마, 필기도구" },
        { title: "소요 시간", content: "약 3시간" },
        { title: "난이도", content: "초급" },
        { title: "인원 제한", content: "최대 8명" },
      ],
    },
  ]);

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
                aria-label="뒤로 가기"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                뒤로 가기
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
                      <span>참가자 {selectedActivity.participants}명</span>
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
                    <h3 className="text-xl font-semibold">활동 세부 정보</h3>
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
                    initialMessages={[
                      {
                        text: "안녕하세요! 이 활동에 대해 궁금한 점이 있으신가요?",
                        sender: "host",
                        avatar: "/host-avatar.png",
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">추천 액티비티</h2>
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
                    <option value="date">날짜순</option>
                    <option value="participants">참가자순</option>
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
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
                          참가자 {activity.participants}명
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
