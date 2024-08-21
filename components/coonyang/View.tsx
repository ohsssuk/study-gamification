interface ViewProps {
  children?: React.ReactNode;
  viewType?: number;
}
export default function View({ children, viewType = 1 }: ViewProps) {
  return (
    <div id="coonyang_view" className={`type-${viewType}`}>
      {children}
    </div>
  );
}
