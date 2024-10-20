type Props = {
  children: React.ReactNode;
};

const AuthorizedLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};

export default AuthorizedLayout;
