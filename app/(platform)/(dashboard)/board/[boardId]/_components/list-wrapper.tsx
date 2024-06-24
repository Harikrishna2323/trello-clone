interface ListWrapperProps {
  children: React.ReactNode;
}

export const ListWrapper = ({ children }: ListWrapperProps) => {
  return <li className="shrink-0 h-ful w-[272px] select-none">{children}</li>;
};
