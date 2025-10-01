import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, Search, Eye, Loader2 } from "lucide-react";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  data_nascimento: string;
  email?: string;
  telefone?: string;
  turma?: string;
}

const Alunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchAlunos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("alunos")
        .select("*")
        .order("nome");

      if (searchQuery) {
        query = query.or(`nome.ilike.%${searchQuery}%,matricula.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAlunos(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar alunos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Alunos</h1>
              <p className="text-muted-foreground">
                Gerencie os alunos cadastrados
              </p>
            </div>
            <Button onClick={() => navigate("/alunos/novo")} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Aluno
            </Button>
          </div>

          <Card className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : alunos.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Nenhum aluno encontrado"
                  : "Nenhum aluno cadastrado ainda"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alunos.map((aluno) => (
                <Card
                  key={aluno.id}
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/alunos/${aluno.id}`)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{aluno.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          Matrícula: {aluno.matricula}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Nascimento: {formatDate(aluno.data_nascimento)}
                      </p>
                      {aluno.turma && (
                        <Badge variant="secondary">{aluno.turma}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Alunos;
