"use client";
import { Button } from "@/components/ui/button";
import { SwitchProfileSettingsView } from "@/store/store";

const SwitchSettings = () => {
  const { view, setView } = SwitchProfileSettingsView();
  return (
    <div className="space-x-2">
      <Button
        onClick={() => setView("image")}
        variant={view === "image" ? "shimmer" : "secondary"}
      >
        Image
      </Button>
      <Button
        onClick={() => setView("security")}
        variant={view === "security" ? "shimmer" : "destructive"}
      >
        Security
      </Button>
    </div>
  );
};

export default SwitchSettings;
