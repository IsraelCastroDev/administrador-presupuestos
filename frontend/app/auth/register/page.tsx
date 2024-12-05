import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PlanificaYa - crear cuenta",
  description: "Regístrate en PlanificaYa",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="font-black text-5xl">Crear una cuenta</h1>
      <p className="text-2xl font-bold">
        y Controla tus <span className="text-amber-600">finanzas</span>
      </p>

      <RegisterForm />

      <Link href={"/auth/login"} className="block text-center mt-2">
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </>
  );
}
