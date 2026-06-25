import { CssReset, CssVariables } from '@dhis2/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { SyncUrlWithGlobalShell } from '@/utils/SyncUrlWithGlobalShell'
import { TrackerPage } from '@/pages/tracker/TrackerPage'

const queryClient = new QueryClient()

const router = createHashRouter([
    {
        element: <SyncUrlWithGlobalShell />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        element: (
                            <PageWrapper>
                                <Outlet />
                            </PageWrapper>
                        ),
                        children: [
                            {
                                path: '/',
                                element: <TrackerPage />,
                            },
                            {
                                path: '/tracker',
                                element: <TrackerPage />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
])

const App = () => (
    <QueryClientProvider client={queryClient}>
        <CssReset />
        <CssVariables theme spacers colors elevations />
        <RouterProvider router={router} />
    </QueryClientProvider>
)

export default App
