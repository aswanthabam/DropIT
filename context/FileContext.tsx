import React from "react";

const FileContext: React.Context<{
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>> | null;
}> = React.createContext<{
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>> | null;
}>({ file: null, setFile: null });

const FileProvider = ({
  children,
  file,
  setFile,
}: Readonly<{
  children: React.ReactNode;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>> | null;
}>) => {
  return (
    <FileContext.Provider value={{ file, setFile }}>
      {children}
    </FileContext.Provider>
  );
};

export { FileContext, FileProvider };
