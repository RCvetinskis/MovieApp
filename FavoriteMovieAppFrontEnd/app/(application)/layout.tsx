import NavBar from "@/components/navigation/nav-bar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as ToaserSooner } from "@/components/ui/sonner";
import UnauthorizedDialog from "@/components/unauthorized-dialog";
import { airingTodaySchedule } from "@/actions/schedules/scheduler";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // await airingTodaySchedule();
  // TODO: on filter functionality add multiple keyword choices , up to 5
  // TODO: Search and sort favorites
  // TODO: Create notifications with api airing today on the air when user logins or access website he will get notiifcation of tv show if it is on favorites, create notification toggle to get latest movies/tv shows notifications
  // TODO: Create other user page
  // display something in profile route, make it public so everyone can access it
  // TODO:Change sidebar to this: https://ui.aceternity.com/components/sidebar

  return (
    <div>
      <NavBar />
      <div className="md:container mx-auto pt-20">{children}</div>
      <Toaster />
      <ToaserSooner />
      <UnauthorizedDialog />
    </div>
  );
};

export default Layout;