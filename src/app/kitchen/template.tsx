// Remounts on every page change within this portal, giving each page a soft entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
