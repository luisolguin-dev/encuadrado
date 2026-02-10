import { login } from "@/app/actions/auth";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">
          ☕ EnergyBoost
        </h1>
        <p className="text-gray-500 mb-6">Envía energía a tus amigos</p>

        <form action={login} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="user@dummymail.com"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold p-2 rounded hover:bg-blue-700 transition"
          >
            Ingresar
          </button>
        </form>

        {/* Ayuda visual para no olvidar las credenciales */}
        <div className="mt-6 text-xs text-left bg-gray-50 p-3 rounded border border-gray-200 text-gray-600">
          <p className="mb-1">
            <strong className="text-gray-800">Solicitor:</strong>
            <br />
            solicitor123@dummymail.com
            <br />
            quierounmatchalatte
          </p>
          <p>
            <strong className="text-gray-800">Proveedor:</strong>
            <br />
            proveedor456@dummymail.com
            <br />
            rayomcqueen
          </p>
        </div>
      </div>
    </div>
  );
}
