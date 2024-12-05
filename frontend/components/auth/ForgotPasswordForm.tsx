"use client";

import Button from "@/components/ui/Button";

export default function ForgotPasswordForm() {
  return (
    <form className="mt-5 space-y-3" noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-bold text-2xl">Email</label>

        <input
          type="email"
          placeholder="Email de Registro"
          className="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
        />
      </div>

      <Button text="Enviar Instrucciones" />
    </form>
  );
}
