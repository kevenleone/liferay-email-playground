import {
    createRootRoute,
    Link,
    Outlet,
    useLocation,
} from '@tanstack/react-router';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react/jsx-runtime';
import useScrollUnlocked from '@/hooks/use-scroll-unlock';

const RootLayout = () => {
    useScrollUnlocked();

    const { pathname } = useLocation();

    const paths = pathname.split('/').filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {!!paths.length && (
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {paths.map((path, index) => (
                                    <Fragment key={index}>
                                        <BreadcrumbItem>
                                            <BreadcrumbLink
                                                asChild
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Link to="/">
                                                    {' '}
                                                    {path === '/'
                                                        ? 'Home'
                                                        : path}
                                                </Link>
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>

                                        {index + 1 !== paths.length && (
                                            <BreadcrumbSeparator />
                                        )}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                )}

                <Outlet />
            </div>
        </div>
    );
};

export const Route = createRootRoute({ component: RootLayout });
