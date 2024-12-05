import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-black text-5xl">¿Olvidaste tu contraseña?</h1>
      <p className="text-2xl font-bold">
        ingresa tu <span className="text-amber-600">correo electrónico</span>
      </p>
      <ForgotPasswordForm />
    </>
  );
}
