interface WrapProps {
  children: React.ReactNode;
}
export default function Wrap({ children }: WrapProps) {
  return (
    <div id="coonyang" className="full-screen">
      {children}
    </div>
  );
}
