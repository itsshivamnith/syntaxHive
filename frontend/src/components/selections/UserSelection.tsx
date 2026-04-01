import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  CodeXml,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Home/Navbar";
import { useUser } from "@/api/useUser";
import { useSignOut } from "@/api/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import Loader from "../ui/loader";
import { createRoom, joinRoom } from "@/api/room";
import toast from "react-hot-toast";

const languages = [
  { name: "JavaScript", logo: "/logos/js.png" },
  { name: "Python", logo: "/logos/python.webp" },
  { name: "C++", logo: "/logos/cpp.png" },
  { name: "Java", logo: "/logos/java.svg" },
  { name: "TypeScript", logo: "/logos/ts.webp" },
  { name: "HTML/CSS/JS", logo: "/logos/web.png" },
  { name: "C#", logo: "/logos/csharp.avif" },
  { name: "PHP", logo: "/logos/php.png" },
];

const UserSelection = () => {
  const [step, setStep] = useState<"mode" | "language" | "room">("mode");
  const [selectedMode, setSelectedMode] = useState<"solo" | "friends" | null>(
    null
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [roomId, setRoomId] = useState("");

  const { data, isLoading } = useUser();
  const signOutMutation = useSignOut();

  const navigate = useNavigate();
  const newRoomId = nanoid(12);

  const { mutate: createRoomMutate } = createRoom();
  const { mutate: joinRoomMutate } = joinRoom();

  if (isLoading)
    return (
      <div>
        <Loader className="fill-[var(--hive-purple)] mt-96 size-20" />
      </div>
    );
  if (!data) return <Navigate to="/" replace />;

  const handleCreateRoom = () => {
    setRoomId(newRoomId);
    setStep("language");
  };

  const getUrlLanguage = (language: string) => {
    const map: Record<string, string> = {
      "HTML/CSS/JS": "html",
      "C++": "cpp",
      "C#": "csharp",
    };

    if (map[language]) return map[language];

    return language
      .toLowerCase()
      .replace(/\+/g, "p")
      .replace(/\#/g, "sharp")
      .replace(/\//g, "-")
      .replace(/\s/g, "-");
  };

  const handleStartCoding = () => {
    const params = new URLSearchParams();

    if (!selectedLanguage) return;

    let languageForUrl = getUrlLanguage(selectedLanguage);

    if (selectedLanguage) {
      params.append("language", languageForUrl.toLowerCase().replace("/", "-"));
    }

    if (selectedMode) {
      params.append("mode", selectedMode);
    }

    if (selectedMode === "friends" && roomId) {
      params.append("roomid", roomId);
    }

    if (selectedMode === "friends") {
      createRoomMutate({
        language: languageForUrl,
        roomId: roomId,
      });
    } else {
      toast.success("Your coding session is ready.");
    }

    navigate(`/editor?${params.toString()}`);
  };

  const handleJoinRoom = () => {
    joinRoomMutate(
      {
        roomId,
      },
      {
        onSuccess: (roomData) => {
          const language = roomData.result.language;
          navigate(
            `/editor?language=${language}&mode=friends&roomid=${roomId}`
          );
        },
        onError: (error) => {
          console.error("Failed to join room:", error);
          toast.error("Failed to join room. Please check the Room ID.");
        },
      }
    );
  };

  return (
    <div className="pt-10 px-6">
      <Navbar
        data={data}
        signOutMutation={signOutMutation}
        isLoading={isLoading}
      />
      <div className="flex flex-col items-center">
        {step === "mode" && (
          <div className="flex flex-col items-center justify-center py-12 mt-12 w-full max-w-5xl">
            <h1 className="text-4xl font-bold mb-10">
              How Would You Like to Code?
            </h1>
            <div className="grid md:grid-cols-2 gap-8 w-full">
              {["solo", "friends"].map((mode) => {
                const isSelected = selectedMode === mode;
                return (
                  <Card
                    key={mode}
                    className={`group relative glass-panel border ${
                      isSelected ? "border-primary shadow-xl shadow-[var(--hive-purple)]/20" : "border-white/10"
                    } hover:border-primary hover:shadow-xl hover:shadow-[var(--hive-purple)]/20 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden hover-scale`}
                    onClick={() => setSelectedMode(mode as "solo" | "friends")}
                  >
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                      <img
                        src={
                          mode === "solo"
                            ? "/code-solo.png"
                            : "/code-with-friends.png"
                        }
                        alt={mode}
                        className="w-96 h-40 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                      <h2 className="text-2xl font-semibold text-white">
                        {mode === "solo" ? "Code Solo" : "Code with Friends"}
                      </h2>
                      <p className="text-gray-400">
                        {mode === "solo"
                          ? "Focus on your own code in a distraction-free editor."
                          : "Collaborate in real-time with teammates or friends."}
                      </p>
                    </CardContent>
                    {isSelected && (
                      <CheckCircle className="absolute top-4 right-4 w-10 h-10 text-primary" />
                    )}
                  </Card>
                );
              })}
            </div>

            <Button
              className={`mt-10 bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] hover-scale ${
                selectedMode ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!selectedMode}
              onClick={() => {
                if (selectedMode === "friends") setStep("room");
                else setStep("language");
              }}
            >
              Next
              <ArrowRight />
            </Button>
          </div>
        )}

        {step === "room" && selectedMode === "friends" && (
          <div className="flex flex-col items-center justify-center py-12 w-full max-w-5xl mt-12">
            <h1 className="text-4xl font-bold mb-10 text-center">
              Collaborate with Friends
            </h1>
            <div className="grid md:grid-cols-2 gap-8 w-full">
              {/* Create Room Card */}
              <Card className="group glass-panel border border-white/10 hover:border-primary hover:shadow-xl hover:shadow-[var(--hive-purple)]/20 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center text-center space-y-6 pt-14 hover-scale">
                <h2 className="text-2xl font-semibold text-white">
                  Create a New Room
                </h2>
                <p className="text-gray-400">
                  Start a fresh coding session and invite your friends to
                  collaborate in real-time.
                </p>
                <Button
                  className="bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] px-6 mt-4 cursor-pointer hover-scale"
                  onClick={handleCreateRoom}
                >
                  <PlusCircle />
                  Create Room
                </Button>
              </Card>

              {/* Join Room Card */}
              <Card className="group glass-panel border border-white/10 hover:border-primary hover:shadow-xl hover:shadow-[var(--hive-purple)]/20 transition-all duration-300 rounded-2xl p-8 flex flex-col items-center text-center space-y-6 hover-scale">
                <h2 className="text-2xl font-semibold text-white">
                  Join an Existing Room
                </h2>
                <p className="text-gray-400">
                  Already have a room ID? Enter it below to join your friends’
                  session.
                </p>
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  className="mt-4 w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:border-primary"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  className={`bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] px-6 mt-4 hover-scale ${
                    roomId ? "cursor-pointer" : ""
                  }`}
                  onClick={handleJoinRoom}
                  disabled={!roomId}
                >
                  <LogIn />
                  Join Room
                </Button>
              </Card>
            </div>

            <Button
              className="mt-10 px-6 py-2 bg-transparent border border-white/20 rounded-md font-semibold flex items-center gap-2"
              onClick={() => setStep("mode")}
            >
              <ArrowLeft /> Previous
            </Button>
          </div>
        )}

        {step === "language" && (
          <div className="flex flex-col items-center justify-center py-6 mt-6 w-full max-w-5xl">
            <h1 className="text-4xl font-bold mb-10">Select Your Language</h1>
            <div className="grid max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1 grid-cols-4 gap-8 w-full">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <Card
                    key={lang.name}
                    className={`group relative glass-panel border ${
                      isSelected ? "border-primary shadow-xl shadow-[var(--hive-purple)]/20" : "border-white/10"
                    } hover:border-primary hover:shadow-xl hover:shadow-[var(--hive-purple)]/20 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden hover-scale`}
                    onClick={() => setSelectedLanguage(lang.name)}
                  >
                    <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                      <img
                        src={lang.logo}
                        alt={lang.name}
                        className="w-60 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                      <h2 className="text-2xl font-semibold text-white">
                        {lang.name}
                      </h2>
                    </CardContent>
                    {isSelected && (
                      <CheckCircle className="absolute top-4 right-4 w-10 h-10 text-primary" />
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center items-center gap-10">
              <Button
                className={`mt-10 font-semibold px-6 cursor-pointer bg-transparent hover:bg-gray-800 border-white/20 border`}
                onClick={() => setStep("mode")}
              >
                <ArrowLeft />
                Previous
              </Button>
              <Button
                className={`mt-10 bg-primary text-white font-semibold hover:bg-[var(--accent-hover)] px-6 hover-scale ${
                  selectedLanguage ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                disabled={!selectedLanguage}
                onClick={handleStartCoding}
              >
                <CodeXml />
                Start Coding
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelection;
