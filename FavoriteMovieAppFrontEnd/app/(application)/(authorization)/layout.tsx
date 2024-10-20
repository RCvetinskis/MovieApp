type Props = {
  children: React.ReactNode;
};

const AuthorizationLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-[80svh] grid items-center justify-center ">
      {children}
    </div>
  );
};

export default AuthorizationLayout;
