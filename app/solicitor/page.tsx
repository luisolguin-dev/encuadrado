import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createOrder, repeatOrder, logout } from "../actions/solicitor";
export default async function SolicitorPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const role = cookieStore.get("userRole")?.value;

  if (!userId || role !== "SOLICITOR") {
    redirect("/");
  }

  const orders = await db.order.findMany({
    where: { solicitorId: userId },
    orderBy: { createdAt: "desc" },
    take: 20, // Límite para el MVP
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">☕ Hola, Solicitor</h1>
        <form action={logout}>
          <button className="text-sm text-red-500 hover:underline">
            Cerrar Sesión
          </button>
        </form>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        {/* SECCIÓN 1: NUEVO PEDIDO */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">✨ Nuevo Envío</h2>
          <form action={createOrder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="CAFE"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 text-center hover:bg-gray-50 transition">
                  ☕ Café
                </div>
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="TE"
                  className="peer sr-only"
                />
                <div className="p-4 rounded-lg border-2 border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 text-center hover:bg-gray-50 transition">
                  🍵 Té
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mensaje para tu amigo
              </label>
              <textarea
                name="comment"
                rows={2}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="¡Ánimo con el estudio!"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Enviar Energía 🚀
            </button>
          </form>
        </section>

        {/* SECCIÓN 2: HISTORIAL Y RETENCIÓN */}
        <section>
          <h2 className="text-lg font-semibold mb-4">📜 Historial</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center italic">
              Aún no has enviado nada.
            </p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">
                        {order.type === "CAFE" ? "☕" : "🍵"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium
                        ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      "{order.comment}"
                    </p>
                  </div>

                  {/* FEATURE DE RETENCIÓN: BOTÓN REPETIR */}
                  <form action={repeatOrder}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <button
                      type="submit"
                      className="text-blue-600 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded transition"
                    >
                      ↻ Repetir
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
