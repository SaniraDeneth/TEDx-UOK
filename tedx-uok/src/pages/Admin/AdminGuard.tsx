import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
