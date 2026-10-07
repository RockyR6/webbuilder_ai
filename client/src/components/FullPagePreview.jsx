import { useState } from "react";
import { detectDependencies } from "../utils/sandpackUtils";
import { SandpackPreview } from "@codesandbox/sandpack-react";

const FullPagePreview = ({ files }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true);

  // convert liveFiles to Sandpack format (leading slashes required)
  const sandpackFiles = useMemo(() => {
    if (!files || !Object.keys(files).length) return {};

    const spFiles = {};
    const active = activeFile ? withSlash(activeFile) : null;
    for (const [path, content] of Object.entries(files)) {
      const pathWithSlash = withSlash(path);
      spFiles[pathWithSlash] = { code: content };
    }
    return spFiles;
  }, [files]);

  // pick a template based on the file layout so Sandpack has an entry point
  const template = useMemo(() => {
    const keys = Object.keys(sandpackFiles);
    const isVite =
      keys.some(
        (k) =>
          k === "/src/main.jsx" ||
          k === "/src/main.js" ||
          k === "/src/main.tsx",
      ) || keys.includes("/vite.config.js");
    return isVite ? "vite-react" : "react";
  }, [sandpackFiles]);

  const dependencies = useMemo(() => {
    if (!files) return {};
    return detectDependencies(files);
  }, [files]);

  // avoid initializing Sandpack with no files
  if (!Object.keys(sandpackFiles).length) return null;

  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <SandpackProvider
        template={template}
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          logLevel: 0,
        }}
        className="h-full w-full"
        
      >
    

        <SandpackLayout
          className="h-full w-full border-none! bg-transparent! "
        >
          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              className="h-full w-full"
            />
          )}
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            showOpenInStackBlitz={false}
            showSandpackErrorOverlay={showErrorOverlay}
            className="h-full w-full"
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default FullPagePreview;
