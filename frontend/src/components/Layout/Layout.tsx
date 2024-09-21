import Navbar from "../Navbar/Navbar";

export default function Layout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className="mb-4 block flex-grow bg-[#F5FCFF] h-full">{children}</div>
    </>
  );
}
