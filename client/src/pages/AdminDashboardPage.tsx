import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface DashboardStats {
  message: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalUsers: number;
  };
}

const AdminDashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data: res } = await api.get('/admin/dashboard');
      return res.data as DashboardStats;
    },
  });

  if (isLoading) {
    return <div className="text-charcoal/60">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load dashboard: {error.message}
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: data?.stats.totalOrders ?? 0 },
    { label: 'Revenue (INR)', value: data?.stats.totalRevenue ?? 0 },
    { label: 'Products', value: data?.stats.totalProducts ?? 0 },
    { label: 'Users', value: data?.stats.totalUsers ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-1 text-charcoal/60">Store overview and management</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-charcoal/60">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-charcoal">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-charcoal">Quick Actions</h2>
        <p className="mt-2 text-sm text-charcoal/60">
          Product, order, and user management will be available in Phase 5.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;