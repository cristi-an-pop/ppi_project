import useAuth from "../hooks/useAuth";

const RequireRole = ({ role, children }: { role: string; children: any }) => {
  const { auth } = useAuth() as any;
  return auth.role === role ? children : null;
};

export default RequireRole;
