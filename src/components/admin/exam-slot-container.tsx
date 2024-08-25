'use client'

import React, {useEffect, useState} from 'react';
import {IExamSlot} from "@/types/types";
import ExamSlot from "@/components/admin/exam-slot";
import {fetchExamSlotsByPage} from "@/app/admin/exam-slot/actions";
import {Pagination} from "@nextui-org/pagination";
import Modal from "@/components/admin/DeleteModal";

const ExamSlotContainer = () => {
    const [editExamSlotId, setEditExamSlotId] = useState<number>(0);
    const [examSlots, setExamSlots] = useState<IExamSlot[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1)

    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [showEditSaveModal, setShowEditSaveModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    useEffect(() => {
        // fetch exam slots from api
        fetchExamSlots(0)
    }, []);

    const fetchExamSlots = async (page: number) => {
        const apiResponsePage = await fetchExamSlotsByPage(page);
        setExamSlots(apiResponsePage.items)
        setTotalPages(apiResponsePage.totalPages)
    }

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        SN
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Code
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Created Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Modified Date
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    examSlots.map((examSlot, index) => {
                        return (
                            <ExamSlot key={examSlot.id}
                                      examSlot={examSlot}
                                      index={index}
                                      changeEditExamSlotId={setEditExamSlotId}
                                      editExamSlotId={editExamSlotId}
                                      setShowEditSaveModal={setShowEditSaveModal}
                                      setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody>
            </table>
            <div className="flex justify-end p-2">
                <button
                    disabled={editExamSlotId !== 0}
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => setShowAddModal(true)}
                >Add Exam Slot
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    examSlots.length && !showAddModal && !showEditSaveModal && !showDeleteModal &&
                    <Pagination key={new Date().toString()}
                                showControls
                                color="success"
                                total={totalPages}
                                initialPage={1}
                                onChange={page => {
                                    fetchExamSlots(page - 1)
                                }
                                }/>
                }
            </div>

            {showEditSaveModal && <Modal
                showModal={showEditSaveModal}
                setShowModal={setShowEditSaveModal}
                message="Exam Slot Updated"
            />
            }

            {showDeleteModal && <Modal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                message="Exam Slot Deleted"
            />
            }
            {showAddModal && <Modal
                showModal={showAddModal}
                setShowModal={setShowAddModal}
                message="Create a form in the modal and save new Exam Slot"
            />
            }
        </div>
    )
}

export default ExamSlotContainer;