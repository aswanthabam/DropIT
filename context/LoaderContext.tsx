import React from "react";

const LoaderContext: React.Context<{
  loader: LoaderContextType | null;
  setLoader: React.Dispatch<
    React.SetStateAction<LoaderContextType | null>
  > | null;
}> = React.createContext<{
  loader: LoaderContextType | null;
  setLoader: React.Dispatch<
    React.SetStateAction<LoaderContextType | null>
  > | null;
}>({ loader: null, setLoader: null });

const LoaderProvider = ({
  children,
  loader,
  setLoader
}: Readonly<{
  children: React.ReactNode;
    loader: LoaderContextType | null;
    setLoader: React.Dispatch<
      React.SetStateAction<LoaderContextType | null>> | null;
}>) => {
  
  return (
    <LoaderContext.Provider value={{ loader, setLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export { LoaderContext, LoaderProvider };

export type LoaderContextType = {
  text: string;
  visible: boolean;
};
