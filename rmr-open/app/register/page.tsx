import Countdown from "@/components/Countdown";
import RegisterFlow from "@/components/RegisterFlow";

export default function RegisterPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 text-center">
      <div className="flex items-center gap-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-steel-dark" />
        <h1 className="font-display text-3xl font-bold tracking-[0.15em] text-steel-bright uppercase">
          Register
        </h1>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-steel-dark" />
      </div>
      <p className="mt-3 text-xs tracking-[0.3em] text-muted uppercase">
        Next RMR Open
      </p>

      <div className="mt-10">
        <RegisterFlow />
      </div>

      <div className="mx-auto mt-12 w-full max-w-md">
        <Countdown />
      </div>
    </main>
  );
}
