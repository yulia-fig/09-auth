'use client'; 
import "modern-normalize";
import css from "./Notes.client.module.css";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import SearchBox from "../../components/SearchBox/SearchBox";
import Loader from "../../components/Loader/Loader";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Modal from "../../components/Modal/Modal";

import { fetchNotes } from "../../lib/api";
import { Toaster } from "react-hot-toast";
import { notifyNoNotes } from "../../lib/toast";
import Pagination from "../../components/Pagination/Pagination";
import { useDebouncedCallback } from 'use-debounce';
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm"
export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);

const { data, isLoading, isError, isSuccess, isFetching } = useQuery({
    queryKey: ["notes", page, searchQuery],
    queryFn: () =>
      fetchNotes({
        page,
        search: searchQuery || undefined,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });
 const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 500);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const results = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  useEffect(() => {
    if (data?.notes && data.notes.length === 0) {
      notifyNoNotes();
    }
  }, [data]);
   
  return (
    <div className={css.app}>
      
	<header className={css.toolbar}>
		<SearchBox
        value={input}
          onChange={(val) => {
            setPage(1);
            setInput(val);
            debouncedSetQuery(val);
          }}
      />
      {isSuccess && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
      <button onClick={openModal} className={css.button}>Create note +</button>

  </header>
{(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      
      
      {!isLoading && !isError && results.length > 0 && (
        <NoteList
          notes={data?.notes || []}
          
        />
      )}
      
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
