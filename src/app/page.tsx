import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { ActivityCard } from "@/components/ActivityCard";
import { CommitsCard } from "@/components/CommitsCard";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { StravaCard } from "@/components/StravaCard";
import { HomelabCard } from "@/components/HomelabCard";
import { NowPlayingCard } from "@/components/NowPlayingCard";
import { LocationCard } from "@/components/LocationCard";
import { ContactCard } from "@/components/ContactCard";
import { CVCard } from "@/components/CVCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-[1200px] px-5">
      <Topbar />
      <div className="grid grid-cols-1 gap-3 py-3 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          <Hero />
          <ActivityCard />
          <CommitsCard />
          <ProjectsGrid />
        </div>
        <div className="flex flex-col gap-3">
          <StravaCard />
          <CVCard />
          <HomelabCard />
          <NowPlayingCard />
          <LocationCard />
          <ContactCard />
        </div>
      </div>
    </div>
  );
}
