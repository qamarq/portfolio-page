import { Suspense } from "react";
import { Topbar } from "@/components/Topbar";
import { Hero } from "@/components/Hero";
import { ActivityCard, ActivityCardSkeleton } from "@/components/ActivityCard";
import { CommitsCard, CommitsCardSkeleton } from "@/components/CommitsCard";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { StravaCard, StravaCardSkeleton } from "@/components/StravaCard";
import { HomelabCard, HomelabCardSkeleton } from "@/components/HomelabCard";
import {
  NowPlayingCard,
  NowPlayingCardSkeleton,
} from "@/components/NowPlayingCard";
import { LocationCard } from "@/components/LocationCard";
import { ContactCard } from "@/components/ContactCard";
import { CVCard } from "@/components/CVCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-300 px-5">
      <Topbar />
      <div className="grid grid-cols-1 gap-3 py-3 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-3">
          <Hero />
          <Suspense fallback={<ActivityCardSkeleton />}>
            <ActivityCard />
          </Suspense>
          <ProjectsGrid>
            <Suspense fallback={<CommitsCardSkeleton />}>
              <CommitsCard />
            </Suspense>
          </ProjectsGrid>
        </div>
        <div className="flex flex-col gap-3">
          <Suspense fallback={<StravaCardSkeleton />}>
            <StravaCard />
          </Suspense>
          <CVCard />
          <Suspense fallback={<HomelabCardSkeleton />}>
            <HomelabCard />
          </Suspense>
          <Suspense fallback={<NowPlayingCardSkeleton />}>
            <NowPlayingCard />
          </Suspense>
          <LocationCard />
          <ContactCard />
        </div>
      </div>
    </div>
  );
}
