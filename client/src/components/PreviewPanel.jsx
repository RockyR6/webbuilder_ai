import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { detectDependencies } from '../utils/sandpackUtils'
import { useAppContext } from '../context/AppContext';

const withSlash = (p) => (p.startsWith("/") ? p : "/" + p);

// Watches file edits inside Sandpack and saves changes to DB & live state
function SandpackfileWatcher({ onLiveFilesChange, usesSlash }) {
  const { sandpack } = useSandpack()
  const { files } = sandpack;
  const { activeProject, updateProjectFiles } = useAppContext()

  const activeProjectRef = useRef(activeProject)
  useEffect(() => {
    activeProjectRef.current = activeProject;
  }, [activeProject])

  useEffect(() => {
    const project = activeProjectRef.current;
    if (!project) return;

    const updatedFiles = {}
    let hasChanges = false;

    for (const [path, fileObj] of Object.entries(files)) {
      const fileCode = fileObj.code;
      // convert back to the key style used by the project/DB
      const key = usesSlash ? path : path.replace(/^\//, "");
      updatedFiles[key] = fileCode;

      const orig = project.files[key];
      const originalContent = typeof orig === "string" ? orig : orig?.content;
      if (originalContent !== undefined && originalContent !== fileCode) {
        hasChanges = true;
      }
    }

    onLiveFilesChange(updatedFiles)
    if (hasChanges) {
      updateProjectFiles(updatedFiles)
    }
  }, [files, usesSlash, onLiveFilesChange, updateProjectFiles])

  return null
}

const PreviewPanel = ({ project, activeFile, showCode }) => {
  const [showErrorOverlay, setShowErrorOverlay] = useState(true)
  const [liveFiles, setLiveFiles] = useState(project.files)

  useEffect(() => {
    setLiveFiles(project.files)
  }, [project._id, project.version, project.files])

  const handleLiveFilesChange = useCallback((newFiles) => {
    setLiveFiles((prev) => {
      const prevKeys = Object.keys(prev);
      const newKeys = Object.keys(newFiles);
      let changed = prevKeys.length !== newKeys.length;
      if (!changed) {
        for (const [p, code] of Object.entries(newFiles)) {
          const prevVal = typeof prev[p] === "string" ? prev[p] : prev[p]?.content;
          if (prevVal !== code) { changed = true; break }
        }
      }
      return changed ? newFiles : prev
    })
  }, [])

  const usesSlash = useMemo(
    () => Object.keys(liveFiles).some((k) => k.startsWith("/")),
    [liveFiles]
  )

  // convert liveFiles to Sandpack format (leading slashes required)
  const sandpackFiles = useMemo(() => {
    const spFiles = {}
    const active = activeFile ? withSlash(activeFile) : null;
    for (const [path, content] of Object.entries(liveFiles)) {
      const p = withSlash(path);
      const fileCode = typeof content === "string" ? content : content?.content || "";
      spFiles[p] = { code: fileCode, active: p === active }
    }
    return spFiles
  }, [liveFiles, activeFile])

  // pick a template based on the file layout so Sandpack has an entry point
  const template = useMemo(() => {
    const keys = Object.keys(sandpackFiles);
    const isVite =
      keys.some((k) => k === "/src/main.jsx" || k === "/src/main.js" || k === "/src/main.tsx") ||
      keys.includes("/vite.config.js");
    return isVite ? "vite-react" : "react";
  }, [sandpackFiles])

  const dependencies = useMemo(() => detectDependencies(liveFiles), [liveFiles])

  // avoid initializing Sandpack with no files
  if (!Object.keys(sandpackFiles).length) return null;

  return (
    <div className='h-full w-full'>
      <SandpackProvider
        key={`${project._id}-${template}`}
        template={template}
        files={sandpackFiles}
        customSetup={{ dependencies }}
        options={{
          externalResources: [
            "https://cdn.tailwindcss.com",
            "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
          ],
          classes: {
            "sp-wrapper": "sp-wrapper",
            "sp-layout": "sp-layout",
            "sp-preview": "sp-preview",
          },
          logLevel: 0,
        }}
        theme={{
          colors: {
            surface1: "#ffffff",
            surface2: "#f4f4f5",
            surface3: "#e4e4e7",
            clickable: "#71717a",
            base: "#09090b",
            disabled: "#a1a1aa",
            hover: "#18181b",
            error: "#ef4444",
            errorSurface: "#fef2f2"
          },
          font: {
            body: "'Urbanist', system-ui, -apple-system, sans-serif",
            mono: "'Geist Mono', ui-monospace, monospace",
            size: "13px",
            lineHeight: "1.6"
          }
        }}
      >
        <SandpackfileWatcher
          onLiveFilesChange={handleLiveFilesChange}
          usesSlash={usesSlash}
        />

        <SandpackLayout
          style={{
            height: "100%",
            border: "none",
            borderRadius: "0px",
            backgroundColor: "transparent",
          }}
        >
          {showCode && (
            <SandpackCodeEditor
              showTabs
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: "100%", flex: 1, minWidth: 0 }}
            />
          )}
          <SandpackPreview
            showNavigator={false}
            showSandpackErrorOverlay={showErrorOverlay}
            style={{ height: "100%", flex: showCode ? 1 : 2, minWidth: 0 }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  )
}

export default PreviewPanel