import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import NotesClient from './Notes.client'
import {fetchNotes} from '../../lib/api'
async function App() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, ''],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: undefined,
        perPage: 12,
      }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
  );
}
export default App;