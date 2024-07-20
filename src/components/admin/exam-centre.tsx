import React, {useEffect, useState} from 'react';
import {IExamCentre, Region, SortOrder} from "@/types/types";
import {fetchExamCentresByRegion} from "@/app/admin/actions";


const ExamCentre = ({region}: {
    region: Region
}) => {

    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(0)
    const [sortBy, setSortBy] = useState<string>("code")
    const [sortOrder, setSortOrder] = useState<SortOrder>("ASC")

    useEffect(() => {
        const updateExamCentresOnUi = async () => {
            const resExamCentres = await fetchExamCentresByRegion(pageNumber, region.id, sortBy, sortOrder);
            setExamCentres(resExamCentres);
        }
        updateExamCentresOnUi()

    }, [])

    useEffect(() => {
        const updateExamCentresOnUi = async () => {
            const resExamCentres = await fetchExamCentresByRegion(pageNumber, region.id, sortBy, sortOrder);
            setExamCentres(resExamCentres);
        }
        updateExamCentresOnUi()

    }, [region])


    return (
        <div className='grid justify-center items-center'>
            <div>
                <table className="table-auto">
                    <thead>
                    <tr>
                        <th>Exam Centre Code</th>
                        <th>Exam Centre Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        examCentres.map(examCentre => (
                            <tr key={examCentre.id}>
                                <td>{examCentre.code}</td>
                                <td>{examCentre.name}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default ExamCentre;