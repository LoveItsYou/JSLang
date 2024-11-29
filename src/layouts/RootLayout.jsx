import { CodeEditor } from "../components/component";

const RootLayout = () => {
  return (
    <div className="  min-h-screen p-3 flex justify-center items-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <CodeEditor />
    </div>
  );
};

export default RootLayout;
