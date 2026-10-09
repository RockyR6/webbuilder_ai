import { useMemo, useState } from "react";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { detectDependencies } from "../utils/sandpackUtils";

const withSlash = (path) => (path.startsWith("/") ? path : `/${path}`);

const FullPagePreview = ({ files }) => {

  const [showErrorOverlay] = useState(true);

  const sandpackFiles = useMemo(() => {
    if (!files || !Object.keys(files).length) return {};

    const result = {};
    for (const [path, content] of Object.entries(files)) {
      result[withSlash(path)] = {
        code: typeof content === "string" ? content : content?.content ?? content?.code ?? "",
      };
    }
    return result;
  }, [files]);

  const template = useMemo(() => {
    const keys = Object.keys(sandpackFiles);

    const isVite =
      keys.some((path) =>
        [
          "/src/main.jsx",
          "/src/main.js",
          "/src/main.tsx",
          "/src/main.ts",
        ].includes(path)
      ) || keys.includes("/vite.config.js");

    return isVite ? "vite-react" : "react";
  }, [sandpackFiles]);

  const dependencies = useMemo(
    () => (files ? detectDependencies(files) : {}),
    [files]
  );

  if (!Object.keys(sandpackFiles).length) {
    return (
      <div className="h-screen flex items-center justify-center">
        No project files found.
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
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
      >
        <SandpackLayout
          style={{
            height: "100%",
            width: "100%",
            border: "none",
            borderRadius: 0,
          }}
        >
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            showOpenInCodeSandbox={false}
            showOpenInStackBlitz={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{ height: "100%", width: "100%" }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default FullPagePreview;
