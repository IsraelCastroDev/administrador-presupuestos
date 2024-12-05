interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  return (
    <input
      type="submit"
      value={text}
      className="bg-slate-700 hover:bg-slate-800 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
    />
  );
}
