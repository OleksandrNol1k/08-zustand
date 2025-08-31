import NotesClient from "./Notes.client";
import { fetchNotes } from "../../../../lib/api";

interface NotesPageProps {
    params: Promise<{ slug: string[] }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
    const { slug } = await params;
    const initialPage = 1;
    const initialQuery = '';
    const initialTag = slug[0] === "All" ? undefined : slug[0];
    const initialData = await fetchNotes(initialPage, initialQuery, initialTag);
    return <NotesClient initialData={initialData} initialTag={initialTag} />;
}