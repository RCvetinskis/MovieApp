"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CastCrewNav = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace, back } = useRouter();
  const handleCast = () => {
    const params = new URLSearchParams(searchParams);
    params.set("display", "cast");
    if (params.has("page")) {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const handlewCrew = () => {
    const params = new URLSearchParams(searchParams);
    params.set("display", "crew");
    if (params.has("page")) {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  };
  const displayView = searchParams.get("display") || "cast";

  return (
    <nav className="space-x-2">
      <Button onClick={() => back()} variant={"outline"}>
        Back
      </Button>
      <Button
        onClick={handleCast}
        variant={displayView === "cast" ? "shimmer" : "outline"}
      >
        Cast
      </Button>
      <Button
        onClick={handlewCrew}
        variant={displayView === "crew" ? "shimmer" : "outline"}
      >
        Crew
      </Button>
    </nav>
  );
};

export default CastCrewNav;
