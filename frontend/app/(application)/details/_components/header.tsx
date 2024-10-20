import { tmdbImageUrl } from "@/lib/constants";

type Props = {
  backdropPath?: string;
  children: React.ReactNode;
};

const Header = ({ backdropPath, children }: Props) => {
  const bgImage = `url(${tmdbImageUrl}/${backdropPath})`;

  return (
    <div className="w-full min-h-[50svh] rounded-xl relative">
      {/* Blurred background image for low quality */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bgImage,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      ></div>

      {/* Main background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: bgImage,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          zIndex: 1,
        }}
      >
        <div className="absolute inset-0 bg-black rounded-xl bg-opacity-60"></div>
      </div>

      {/* Children content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default Header;
