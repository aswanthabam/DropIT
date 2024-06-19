import React from "react";

const PopupContext: React.Context<{
  popup: PopupContextType | null;
  setPopup: React.Dispatch<
    React.SetStateAction<PopupContextType | null>
  > | null;
}> = React.createContext<{
  popup: PopupContextType | null;
  setPopup: React.Dispatch<
    React.SetStateAction<PopupContextType | null>
  > | null;
}>({ popup: null, setPopup: null });

const PopupProvider = ({
  children,
  popup,
  setPopup,
}: Readonly<{
  children: React.ReactNode;
  popup: PopupContextType | null;
  setPopup: React.Dispatch<
    React.SetStateAction<PopupContextType | null>
  > | null;
}>) => {
  return (
    <PopupContext.Provider value={{ popup, setPopup }}>
      {children}
    </PopupContext.Provider>
  );
};

export { PopupContext, PopupProvider };
export const showPopup = (
  setPopup: React.Dispatch<React.SetStateAction<PopupContextType | null>>,
  message: string,
  icon: string = "bi bi-info",
  time: number = 2000
) => {
  console.log("Showing popup");
  setPopup!({ text: message, icon: icon, visible: true });
  setTimeout(() => {
    setPopup!({ text: "", icon: "", visible: false });
  }, time);
};
export type PopupContextType = {
  text: string;
  icon: string;
  visible: boolean;
};
