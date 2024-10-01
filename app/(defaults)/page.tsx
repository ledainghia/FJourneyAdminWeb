import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sales Admin',
};

const Sales = () => {
    return <ComponentsDashboardSales />;
};

export default Sales;
