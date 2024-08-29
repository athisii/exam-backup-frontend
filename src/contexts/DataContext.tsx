import {createContext, useContext} from "react";
import {ISlot, IFileType} from "@/types/types";

interface DataContextProps {
    examSlots: ISlot[],
    fileTypes: IFileType[]
}

const DataContext = createContext<DataContextProps>({
    examSlots: [],
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