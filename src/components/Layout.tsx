import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/alunos")}
            className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            <GraduationCap className="h-6 w-6 text-primary" />
            Sistema Escolar
          </button>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
