"use client"

import css from "./NotesPage.module.css"
import { useState } from "react"
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebouncedCallback } from "use-debounce"
import { fetchNotes } from "../../../../lib/api"
import Modal from "../../../../components/Modal/Modal"
import NoteForm from "../../../../components/NoteForm/NoteForm"
import NoteList from "../../../../components/NoteList/NoteList"
import Pagination from "../../../../components/Pagination/Pagination"
import SearchBox from "../../../../components/SearchBox/SearchBox"
import { FetchNoteList } from "@/types/note"

type NotesClientProps = {
    initialData: FetchNoteList;
    initialTag?: string;
};

export default function NotesClient({ initialData, initialTag }: NotesClientProps) { 
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const updateSearchQuery = useDebouncedCallback((value: string) => {
        setQuery(value);
        setPage(1);
    }, 300);
    
    const [inputValue, setInputValue] = useState("");
    const handleSearchChange = (value: string) => {
        setInputValue(value);
        updateSearchQuery(value);
    }
    
    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["notes", page, query, initialTag],
        queryFn: () => fetchNotes(page, query, initialTag),
        placeholderData: keepPreviousData, initialData,
    })

    const totalPages = data?.totalPages ?? 0;

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={inputValue} onSearch={handleSearchChange} />
                <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
            </header>
            {isLoading && <strong className={css.loading}>Loading notes, please wait...</strong>}
            {isError && <strong className={css.error}>There was an error, please try again...</strong>}
            {isSuccess && <NoteList notes={data.notes} />}
            {totalPages > 1 && <Pagination total={totalPages} page={page} onChange={setPage} />}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <NoteForm onCloseModal={() => setIsModalOpen(false)} />
                </Modal>
            )}
        </div>
    );
}