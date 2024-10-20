type Props = {
  children: React.ReactNode;
  open: boolean;
};

const HiddenDropDownAnimated = ({ children, open }: Props) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default HiddenDropDownAnimated;
