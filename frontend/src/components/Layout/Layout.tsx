import Navbar from "../Navbar/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className="mx-4 mb-4 block flex-grow bg-black h-full">
        {children}
      </div>
    </>
  );
}
