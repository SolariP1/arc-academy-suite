import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { alunoSchema, AlunoFormData } from "@/lib/validations/aluno";

const EditarAluno = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
  });

  useEffect(() => {
    fetchAluno();
  }, [id]);

  const fetchAluno = async () => {
    try {
      setLoadingData(true);
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      reset({
        nome: data.nome,
        matricula: data.matricula,
        data_nascimento: data.data_nascimento,
        email: data.email || "",
        telefone: data.telefone || "",
        turma: data.turma || "",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar aluno",
        description: error.message,
      });
      navigate("/alunos");
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: AlunoFormData) => {
    try {
      setLoading(true);

      const updateData = {
        nome: data.nome,
        matricula: data.matricula,
        data_nascimento: data.data_nascimento,
        email: data.email || null,
        telefone: data.telefone || null,
        turma: data.turma || null,
      };

      const { error } = await supabase
        .from("alunos")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Aluno atualizado",
        description: "Dados atualizados com sucesso!",
      });
      navigate(`/alunos/${id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar aluno",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/alunos/${id}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Editar Aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    {...register("nome")}
                    disabled={loading}
                  />
                  {errors.nome && (
                    <p className="text-sm text-destructive">{errors.nome.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input
                    id="matricula"
                    {...register("matricula")}
                    disabled={loading}
                  />
                  {errors.matricula && (
                    <p className="text-sm text-destructive">{errors.matricula.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    {...register("data_nascimento")}
                    disabled={loading}
                  />
                  {errors.data_nascimento && (
                    <p className="text-sm text-destructive">{errors.data_nascimento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    {...register("telefone")}
                    disabled={loading}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-destructive">{errors.telefone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turma">Turma</Label>
                  <Input
                    id="turma"
                    {...register("turma")}
                    disabled={loading}
                  />
                  {errors.turma && (
                    <p className="text-sm text-destructive">{errors.turma.message}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/alunos/${id}`)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditarAluno;
