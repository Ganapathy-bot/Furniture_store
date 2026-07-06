import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <Link to="/" className="mb-8 font-display text-3xl font-bold text-charcoal">
        Furni<span className="text-terracotta">Store</span>
      </Link>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;