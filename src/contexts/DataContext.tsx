import {createContext, useContext} from "react";
import {ExamSlot, FileType} from "@/types/types";

interface DataContextProps {
    examSlots: ExamSlot[],
    fileTypes: FileType[]
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