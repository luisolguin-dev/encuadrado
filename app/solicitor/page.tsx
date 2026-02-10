import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createOrder,
  repeatOrder,
  cancelOrder,
  logout,
} from "@/app/actions/solicitor";

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
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <header className="max-w-md mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">☕ EnergyBoost</h1>
          <p className="text-sm text-gray-500">Envía energía a tus amigos</p>
        </div>
        <form action={logout}>
          <button className="text-xs text-red-500 font-medium hover:underline bg-red-50 px-3 py-1 rounded-full">
            Cerrar Sesión
          </button>
        </form>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            ✨ Nuevo Envío
          </h2>

          <form action={createOrder} className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="CAFE"
                  className="peer sr-only"
                  defaultChecked
                />
                <div className="p-4 rounded-xl border-2 border-gray-100 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition group-hover:border-gray-300 text-center">
                  <div className="text-2xl mb-1">☕</div>
                  <div className="font-bold text-gray-800">Café</div>
                  <div className="text-xs font-medium text-blue-600 bg-blue-100 inline-block px-2 py-0.5 rounded-full mt-1">
                    $2.500
                  </div>
                </div>
              </label>

              <label className="cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  value="TE"
                  className="peer sr-only"
                />
                <div className="p-4 rounded-xl border-2 border-gray-100 peer-checked:border-green-500 peer-checked:bg-green-50 transition group-hover:border-gray-300 text-center">
                  <div className="text-2xl mb-1">🍵</div>
                  <div className="font-bold text-gray-800">Té</div>
                  <div className="text-xs font-medium text-green-600 bg-green-100 inline-block px-2 py-0.5 rounded-full mt-1">
                    $2.000
                  </div>
                </div>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  ¿Para quién es?
                </label>
                <input
                  type="text"
                  name="recipientName"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ej: Javiera Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Ej: Av. Providencia 1234, Of. 301"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Mensaje
                </label>
                <textarea
                  name="comment"
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="¡Mucho ánimo con la entrega!"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 active:scale-95 transition shadow-lg shadow-gray-200"
            >
              Enviar Energía 🚀
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 px-2">
            📜 Historial de Envíos
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400">Aún no has enviado nada.</p>
              <p className="text-sm text-gray-300">
                ¡Sé el héroe de alguien hoy!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                        ${order.type === "CAFE" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                      >
                        {order.type === "CAFE" ? "☕" : "🍵"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-tight">
                          Para {order.recipientName || "Amigo"}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider
                          ${
                            order.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${order.price}
                    </span>
                  </div>

                  <div className="ml-13 pl-1 space-y-1 mb-4 border-l-2 border-gray-100">
                    <p className="text-xs text-gray-500 flex gap-1">
                      📍{" "}
                      <span className="line-clamp-1">
                        {order.address || "Sin dirección"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      "{order.comment}"
                    </p>

                    {order.status !== "CANCELLED" &&
                      order.status !== "COMPLETED" && (
                        <p className="text-xs font-semibold text-blue-600 mt-1">
                          ⏱ Llegada estimada: {order.eta} mins
                        </p>
                      )}
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-gray-50">
                    {order.status === "CREATED" && (
                      <form action={cancelOrder} className="flex-1">
                        <input type="hidden" name="orderId" value={order.id} />
                        <button
                          type="submit"
                          className="w-full text-red-500 text-xs font-bold hover:bg-red-50 py-2.5 rounded-lg transition border border-transparent hover:border-red-100"
                        >
                          Cancelar
                        </button>
                      </form>
                    )}

                    <form action={repeatOrder} className="flex-1">
                      <input type="hidden" name="orderId" value={order.id} />
                      <button
                        type="submit"
                        className="w-full bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 py-2.5 rounded-lg transition flex justify-center items-center gap-1"
                      >
                        <span>↻</span> Repetir Pedido
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
