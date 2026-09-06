import { useRef, useState } from "react";
import { Upload, File, ArrowRight, ShieldCheck, Clock3 } from "lucide-react";
import Dropzone, { type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { useUploadThing } from "./lib/uploadthing";

export default function ShareItLanding() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      setImageUrl(data.ufsUrl);
    },
  });

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    toast.promise(
      async () => {
        await startUpload(acceptedFiles);
      },
      {
        loading: "Creating link...",
        success: "Link is ready to share",
        error: (error) => {
          error instanceof Error
            ? error.message
            : "Something went wrong, try again";
        },
      },
    );
  };

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    toast.error(
      `Something went wrong, ${rejectedFiles[0].file.type} is not supported. Try again.`,
    );
  };

  const accept = {
    "image/jpg": [".jpg"],
    "image/jpeg": [".jpeg"],
    "image/png": [".png"],
    "image/pdf": [".pdf"],
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-white">
      {/* Header */}
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-white text-sm font-bold text-zinc-950">
            S
          </div>

          <span className="text-xl font-semibold tracking-tight text-white">
            share it
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center px-6 pb-16 pt-16 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
          <Clock3 className="size-4" />
          Links expire after 5 minutes
        </div>

        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-white">
          Send big files.
          <br />
          <span className="text-zinc-400">Keep it simple.</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-500">
          Share files up to 200 MB with a simple link. No email attachments, no
          complicated setup.
        </p>

        {/* Dropzone */}
        {!imageUrl && !isUploading && (
          <Dropzone
            accept={accept}
            onDropAccepted={onDropAccepted}
            onDropRejected={onDropRejected}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="mt-12 w-full max-w-2xl">
                <input ref={inputRef} {...getInputProps()} className="hidden" />

                <button
                  type="button"
                  onClick={handleBrowse}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);

                    // Placeholder:
                    // const files = Array.from(e.dataTransfer.files);
                    // uploadFiles(files);
                  }}
                  className={`
              group relative flex min-h-80 w-full cursor-pointer
              flex-col items-center justify-center rounded-3xl
              border-2 border-dashed p-8 transition-all duration-500 ease-in-out
              ${
                isDragging
                  ? "border-zinc-100 bg-zinc-950 scale-[1.01]"
                  : "border-zinc-100 bg-zinc-800 hover:border-zinc-100 hover:bg-zinc-900"
              }
            `}
                >
                  <div className="mb-6 grid size-16 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-transform ease-in-out duration-500 group-hover:-translate-y-1">
                    <Upload className="size-7 text-zinc-700" />
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    Drop your files here
                  </h2>

                  <p className="mt-2 text-sm text-zinc-500">
                    or click to browse your device
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-xs text-zinc-400">
                    <File className="size-3.5" />
                    Up to 200 MB per file
                  </div>
                </button>
              </div>
            )}
          </Dropzone>
        )}

        {isUploading && <div>loading</div>}

        {imageUrl && <div>image</div>}

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Secure transfers
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="size-4" />
            Automatically deleted
          </div>

          <div className="flex items-center gap-2">
            <ArrowRight className="size-4" />
            One simple link
          </div>
        </div>
      </section>
    </main>
  );
}
