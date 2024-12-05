import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "PlanificaYa - Inicia sesión",
  description: "Inicia sesión en PlanificaYa",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="font-black text-5xl">Inicia sesión</h1>
      <p className="text-2xl font-bold">
        ingresa tus <span className="text-amber-600">credenciales</span>
      </p>

      <LoginForm />
    </>
  );
}
