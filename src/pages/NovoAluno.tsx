import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const NovoAluno = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
  });

  const onSubmit = async (data: AlunoFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Usuário não autenticado",
        });
        return;
      }

      const insertData = {
        nome: data.nome,
        matricula: data.matricula,
        data_nascimento: data.data_nascimento,
        email: data.email || null,
        telefone: data.telefone || null,
        turma: data.turma || null,
        user_id: user.id,
      };

      const { error } = await supabase.from("alunos").insert(insertData);

      if (error) throw error;

      toast({
        title: "Aluno criado",
        description: "Aluno cadastrado com sucesso!",
      });
      navigate("/alunos");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar aluno",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/alunos")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>Novo Aluno</CardTitle>
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
                    onClick={() => navigate("/alunos")}
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
                      "Salvar"
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

export default NovoAluno;
