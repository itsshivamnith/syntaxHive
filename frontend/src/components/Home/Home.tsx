import DotGrid from "@/components/DotGrid";
import { useUser } from "@/api/useUser";
import { useSignOut } from "@/api/auth";
import Navbar from "./Navbar";
import HomeContent from "./HomeContent";

const Home = () => {
  const { data, isLoading } = useUser();
  const signOutMutation = useSignOut();

  return (
    <div className="w-full h-screen relative">
      <div className="absolute z-0 inset-0 overflow-hidden">
        <DotGrid
          dotSize={3}
          gap={20}
          baseColor="#ffffff10"
          activeColor="#00bfff"
          proximity={150}
          shockRadius={200}
          shockStrength={3}
          resistance={800}
          returnDuration={2}
        />
      </div>
      <div className="relative z-1 pt-8 px-4 w-full max-w-7xl mx-auto flex flex-col min-h-screen">
        <Navbar
          data={data}
          signOutMutation={signOutMutation}
          isLoading={isLoading}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <HomeContent data={data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
