import {createContext, useContext} from "react";
import {ISlot, IFileType} from "@/types/types";

interface DataContextProps {
    slots: ISlot[],
    fileTypes: IFileType[]
}

const DataContext = createContext<DataContextProps>({
    slots: [],
    fileTypes: [],
});

export const DataProvider = DataContext.Provider;

export default function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};