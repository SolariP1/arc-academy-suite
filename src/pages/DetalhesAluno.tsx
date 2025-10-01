import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash2, Loader2, Mail, Phone, Calendar, Hash } from "lucide-react";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  data_nascimento: string;
  email?: string;
  telefone?: string;
  turma?: string;
  created_at: string;
}

const DetalhesAluno = () => {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchAluno();
  }, [id]);

  const fetchAluno = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setAluno(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar aluno",
        description: error.message,
      });
      navigate("/alunos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const { error } = await supabase
        .from("alunos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Aluno excluído",
        description: "Aluno removido com sucesso",
      });
      navigate("/alunos");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir aluno",
        description: error.message,
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!aluno) {
    return null;
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/alunos")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/alunos/${id}/editar`)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{aluno.nome}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Cadastrado em {formatDate(aluno.created_at)}
                  </p>
                </div>
                {aluno.turma && (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {aluno.turma}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Matrícula</p>
                    <p className="font-medium">{aluno.matricula}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{formatDate(aluno.data_nascimento)}</p>
                  </div>
                </div>

                {aluno.email && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium">{aluno.email}</p>
                    </div>
                  </div>
                )}

                {aluno.telefone && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{aluno.telefone}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o aluno <strong>{aluno.nome}</strong>?
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : (
                  "Excluir"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Layout>
    </ProtectedRoute>
  );
};

export default DetalhesAluno;
