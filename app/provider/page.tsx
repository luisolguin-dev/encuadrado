import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { claimOrder, updateStatus } from "@/app/actions/provider";
import { logout } from "@/app/actions/auth";

export default async function ProviderPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const role = cookieStore.get("userRole")?.value;

  if (!userId || role !== "PROVIDER") redirect("/");

  const availableOrders = await db.order.findMany({
    where: { status: "CREATED" },
    orderBy: { createdAt: "asc" },
    include: { solicitor: true },
  });

  const myOrders = await db.order.findMany({
    where: {
      providerId: userId,
      status: { not: "COMPLETED" },
    },
    orderBy: { updatedAt: "desc" },
    include: { solicitor: true },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-yellow-400">
          ⚡ Panel de Repartidor
        </h1>
        <form action={logout}>
          <button className="text-sm text-gray-400 hover:text-white">
            Cerrar Sesión
          </button>
        </form>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            Disponibles{" "}
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
              {availableOrders.length}
            </span>
          </h2>

          <div className="space-y-4">
            {availableOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-yellow-500 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg">
                    {order.type === "CAFE" ? "☕ Café" : "🍵 Té"}
                  </span>
                  <span className="text-xs text-gray-400">Hace un momento</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">"{order.comment}"</p>
                <p className="text-xs text-gray-500 mb-4">
                  Solicitado por: {order.solicitor.email}
                </p>

                <form action={claimOrder}>
                  <input type="hidden" name="orderId" value={order.id} />
                  <button className="w-full bg-yellow-500 text-black font-bold py-2 rounded hover:bg-yellow-400 transition">
                    ✋ Tomar Pedido
                  </button>
                </form>
              </div>
            ))}
            {availableOrders.length === 0 && (
              <p className="text-gray-500 italic">No hay pedidos pendientes.</p>
            )}
          </div>
        </section>

        {/* COLUMNA 2: MIS ENTREGAS */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎒 En mi Mochila{" "}
            <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
              {myOrders.length}
            </span>
          </h2>

          <div className="space-y-4">
            {myOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-800 p-4 rounded-lg border border-blue-500 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-blue-600 text-xs px-2 py-1 text-white font-bold">
                  {order.status}
                </div>

                <div className="mt-2 mb-4">
                  <h3 className="font-bold text-xl">
                    {order.type === "CAFE" ? "☕" : "🍵"} Para{" "}
                    {order.solicitor.name || "Cliente"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    "{order.comment}"
                  </p>
                </div>

                {/* BOTONES DE ESTADO */}
                <div className="flex gap-2">
                  {order.status === "ASSIGNED" && (
                    <form action={updateStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="status" value="IN_PROGRESS" />
                      <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold text-sm">
                        🛵 En Camino
                      </button>
                    </form>
                  )}

                  {order.status === "IN_PROGRESS" && (
                    <form action={updateStatus} className="flex-1">
                      <input type="hidden" name="orderId" value={order.id} />
                      <input type="hidden" name="status" value="COMPLETED" />
                      <button className="w-full bg-green-600 hover:bg-green-500 py-2 rounded font-bold text-sm">
                        ✅ Entregado
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
            {myOrders.length === 0 && (
              <p className="text-gray-500 italic">
                No tienes entregas activas.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
