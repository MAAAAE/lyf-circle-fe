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
  IceCream,
} from "lucide-react";
import ChatComponent from "./ChatComponent";
import useUserIdStore from "../hooks/useUserInfo";
import { Button } from "@/components/ui/button";

interface Attend {
  id: string;
  attend: boolean;
}

interface Activity {
  id: string;
  name: string;
  date: {
    month: number;
    day: number;
    weekday: string;
    time: string;
  };
  icebreaker?: string;
  participants: number;
  emoji: string;
  location: string;
  description: string;
  hasNewMessages: boolean;
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
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      name: "Gardens by the Bay Yoga Session",
      date: { month: 5, day: 20, weekday: "Sat", time: "07:30" },
      icebreaker: "ice",
      participants: 3,
      emoji: "🧘",
      location: "Supertree Grove, Gardens by the Bay",
      description:
        "Start your day with a rejuvenating yoga session amidst the iconic Supertrees. Experience tranquility in the heart of Singapore's urban oasis.",
      hasNewMessages: true,
    },
    {
      id: "2",
      name: "Night Cycling at East Coast Park",
      date: { month: 5, day: 21, weekday: "Sun", time: "19:30" },
      icebreaker: "ice",
      participants: 2,
      emoji: "🚴",
      location: "East Coast Park",
      description:
        "Enjoy a refreshing evening cycle along Singapore's scenic East Coast. Feel the sea breeze as you ride under the stars.",
      hasNewMessages: false,
    },
    {
      id: "3",
      name: "Peranakan Cuisine Cooking Class",
      date: { month: 5, day: 22, weekday: "Mon", time: "11:00" },
      icebreaker: "ice",
      participants: 4,
      emoji: "🍲",
      location: "Katong Kitchen Studio",
      description:
        "Learn to cook authentic Peranakan dishes in this hands-on class. Discover the rich flavors and traditions of Singaporean Nyonya cuisine.",
      hasNewMessages: true,
    },
    {
      id: "4",
      name: "Sentosa Island Segway Tour",
      date: { month: 5, day: 27, weekday: "Sat", time: "14:00" },
      icebreaker: "ice",
      participants: 2,
      emoji: "🛴",
      location: "Sentosa Segway Tours Meeting Point",
      description:
        "Explore the beautiful Sentosa Island on a Segway. Glide past beaches, forests, and historical sites on this guided tour.",
      hasNewMessages: false,
    },
    {
      id: "5",
      name: "Batik Painting Workshop",
      date: { month: 5, day: 31, weekday: "Wed", time: "16:00" },
      icebreaker: "ice",
      participants: 5,
      emoji: "🎨",
      location: "Kampong Gelam Community Club",
      description:
        "Immerse yourself in the art of Batik painting. Learn traditional techniques and create your own unique Batik masterpiece to take home.",
      hasNewMessages: false,
    },
  ]);

  const [lyfEvent, setLyfEvent] = useState<Activity[]>([
    {
      id: "ewfoij0",
      name: "Halloween 2024",
      date: { month: 10, day: 28, weekday: "Mon", time: "10:00" },
      // icebreaker:
        // "'Two Truths and a Lie' - Each participant takes turns telling three statements about themselves; two are true and one is false. Others guess which is the lie.",
      participants: 10,
      emoji: "🎃",
      location: "lyf Funan Singapore",
      description:
        "Join us for a spooky halloween 2024! Make your own witches potions art & craft and bring your little ones to make their own pumpkin using playdough, or even get a DIY halloween mask to celebrate the occassion! Come together on the eve of halloween to try your hand at making your own unique halloween themed mocktail at our 'Potion Bar'. See you there!",
      hasNewMessages: false,
    },
    {
      id: "1sefsef",
      name: "Pay It Forward Movement",
      date: { month: 11, day: 15, weekday: "Fri", time: "14:00" },
      icebreaker:
        "'Two Truths and a Lie' - Each participant takes turns telling three statements about themselves; two are true and one is false. Others guess which is the lie.",
      participants: 50,
      emoji: "💌",
      location: "lyf Funan Singapore",
      description:
        "Write well wishes on a postcard and pass it forward to someone or a random stranger! The intention of this movement is to create the ripple effect of the kind wishes to spark lights in people's lives so that they know they are not alone. You never know who may just need that ounce of light in their life.",
      hasNewMessages: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attend, setAttend] = useState<Attend[]>([]);

  const handleJoinEvent = (id: string) => {
    setAttend((prev) => {
      return prev.map((A) => {
        if (A.id === id) {
          // DB통신을 통해 해당 이벤트의 참여자 +1을 해주는 부분
          return { ...A, attend: true }; //  attend 값을 true로 설정
        }
        return A;
      });
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // 리스트를 받아올 API
        const response = await fetch("/api/event");
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }
        const data = await response.json();
        setActivities(data);

        const attendList = [
          ...data.map((item: { id: string }) => ({
            id: item.id,
            attend: false,
          })),
          ...lyfEvent.map((event: { id: string }) => ({
            id: event.id,
            attend: false,
          })),
        ];

        setAttend(attendList);

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load activities. Please try again later." + err);

        //목업용 설정데이터
        const attendList = [
          ...activities.map((item: { id: string }) => ({
            id: item.id,
            attend: false,
          })),
          ...lyfEvent.map((event: { id: string }) => ({
            id: event.id,
            attend: false,
          })),
        ];

        setAttend(attendList);

        setIsLoading(false);
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

  const handleNewMessage = (activityId: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((a) =>
        a.id === activityId ? { ...a, hasNewMessages: true } : a
      )
    );
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
          Lyf Circle
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-600 transition-colors duration-200"
            aria-label={isDarkMode ? "ligth mode" : "dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
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
                  <div className="flex items-start flex-col text-sm">
                    <div
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {selectedActivity.date.month}/
                        {selectedActivity.date.day}
                        {selectedActivity.date.weekday}
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

              {selectedActivity.icebreaker ? (
                <div
                  className={`mb-6 ${
                    isDarkMode
                      ? "bg-[#4a3f8f] text-white"
                      : "bg-blue-100 text-blue-900"
                  } rounded-lg p-6 shadow-lg transform transition-transform duration-200`}
                >
                  <div className="flex items-center mb-4">
                    <IceCream className="w-8 h-8 mr-3" />
                    <h3 className="text-2xl font-bold">Icebreaker</h3>
                  </div>
                  <p className="text-xl leading-relaxed italic">
                    &ldquo;{selectedActivity.icebreaker}&rdquo;
                  </p>
                </div>
              ) : (
                <></>
              )}

              <div className="space-y-6 flex flex-col flex-grow">
                <div className="mt-6 flex-grow flex justify-center">
                  {attend.length > 0 &&
                  selectedActivity &&
                  attend.find((a) => a.id === selectedActivity.id)?.attend ===
                    false ? (
                    <Button
                      type="button"
                      onClick={() => handleJoinEvent(selectedActivity.id)}
                      className={`justify-center ${
                        isDarkMode
                          ? "bg-[#7a7bff] text-white hover:bg-[#7a7bff] hover:text-white active:bg-[#7a7bff] active:text-white"
                          : "bg-blue-600 text-white hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                      }`}
                    >
                      Join the Event
                    </Button>
                  ) : (
                    selectedActivity && (
                      <ChatComponent
                        isDarkMode={isDarkMode}
                        onNewMessage={() =>
                          handleNewMessage(selectedActivity.id)
                        }
                        userId={user_id}
                        initialMessages={[
                          {
                            content:
                              "Welcome, new participant! Please say hello to new friend!",
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
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold"> Activities</h2>
                <div className="relative">
                  <select
                    className={`appearance-none ${
                      isDarkMode
                        ? "bg-[#2c2c35] text-white"
                        : "bg-white text-gray-900"
                    } px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a7bff] transition-colors duration-200`}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="sorting"
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

              {isLoading ? (
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] self-center"
                  role="status"
                  aria-label="loading"
                  style={{
                    borderColor: "#7a7bff",
                    borderRightColor: "transparent",
                  }}
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"></span>
                </div>
              ) : (
                <div>
                  {/* 라이프 주최 이벤트들 */}
                  <div>
                    <h3
                      className={`
                    text-xl font-semibold mb-4 px-4 py-2 rounded-full
                    ${
                      isDarkMode
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gradient-to-r from-blue-400 to-purple-500"
                    }
                    text-white shadow-lg
                    animate-pulse
                    inline-block
                  `}
                    >
                      lyf Official
                    </h3>
                    {lyfEvent
                      .slice(0, visibleItems)
                      .map((activity: Activity, index: number) => (
                        <div
                          className={`mb-4 p-4 ${
                            isDarkMode ? "bg-[#2c2c35]" : "bg-white"
                          } rounded-lg shadow-lg border-2 border-[#7a7bff] `}
                          onClick={() => handleActivityClick(activity)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${activity.name} details`}
                          style={{
                            opacity: 0,
                            animation: `fadeIn 0.3s ease-out ${
                              index * 0.05
                            }s forwards`,
                          }}
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
                                <h3 className="text-xl font-semibold line-clamp-2">
                                  {activity.name}
                                </h3>
                                <div
                                  className={`flex items-center text-sm ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
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
                              } px-4 py-2 rounded-full flex-col`}
                            >
                              <div className="flex">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">
                                  {activity.date.month}/{activity.date.day}
                                </span>
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                } ml-1`}
                              >
                                {activity.date.weekday} {activity.date.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex  items-center mt-3 justify-between">
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {[
                                  ...Array(Math.min(3, activity.participants)),
                                ].map((_, i) => (
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
                                ))}
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
                            <div
                              className={`text-sm font-semibold ${
                                isDarkMode ? "text-[#7a7bff]" : "text-blue-600"
                              }`}
                            >
                              Sponsored by lyf
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* AI 주최 이벤트들 */}
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-4 ${
                        isDarkMode ? "text-[#7a7bff]" : "text-blue-600"
                      }`}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s ease-out ${0}s forwards`,
                      }}
                    >
                      Tailored Event
                    </h3>
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
                                <h3 className="text-xl font-semibold line-clamp-2">
                                  {activity.name}
                                </h3>
                                <div
                                  className={`flex items-center text-sm ${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-600"
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
                              } px-4 py-2 rounded-full flex-col`}
                            >
                              <div className="flex">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">
                                  {activity.date.month}/{activity.date.day}
                                </span>
                              </div>
                              <div
                                className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-600"
                                } ml-1 whitespace-nowrap`}
                              >
                                {activity.date.weekday} {activity.date.time}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center mt-3 justify-between">
                            <div className="flex items-center">
                              <div className="flex -space-x-2">
                                {[
                                  ...Array(Math.min(3, activity.participants)),
                                ].map((_, i) => (
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
                                ))}
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
                                  isDarkMode
                                    ? "text-[#7a7bff]"
                                    : "text-blue-600"
                                }`}
                              >
                                <MessageCircle className="w-5 h-5 mr-1" />
                                <span className="text-sm font-medium">new</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    {/* 닫기 */}
                  </div>
                </div>
              )}
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
