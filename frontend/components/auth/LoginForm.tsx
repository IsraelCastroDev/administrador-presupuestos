"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";

export default function LoginForm() {
  return (
    <>
      <form className="mt-5 space-y-3" noValidate>
        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
          />
        </div>

        <div className="relative h-7">
          <Link href={"/auth/forgot-password"} className="absolute right-2">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button text="Iniciar sesión" />

        <Link href={"/auth/register"} className="block text-center">
          ¿No tienes cuenta? Regístrate aquí
        </Link>
      </form>
    </>
  );
}
