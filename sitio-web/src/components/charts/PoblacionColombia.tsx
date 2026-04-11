import { useEffect, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

interface Row {
  anio: number;
  total: number;
  cabecera: number | null;
  rural: number | null;
}

export default function PoblacionColombia() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/poblacion_colombia_2018_2070.csv")
      .then((r) => r.text())
      .then((csv) => {
        const lines = csv.trim().split("\n");
        const rows: Row[] = lines.slice(1).map((line) => {
          const v = line.split(",");
          const cab = Number(v[2]);
          const rur = Number(v[3]);
          return {
            anio: Number(v[0]),
            total: Number(v[1]) || 0,
            cabecera: cab > 0 ? cab : null,
            rural: rur > 0 ? rur : null,
          };
        });
        setData(rows);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-500">Cargando datos del DANE...</div>
      </div>
    );
  }

  const formatM = (n: number) => `${(n / 1_000_000).toFixed(1)}M`;
  const formatFull = (n: number) => n.toLocaleString("es-CO");

  // Encontrar el pico (año con poblacion maxima)
  const peakRow = data.reduce((max, r) => (r.total > max.total ? r : max), data[0]);

  // Datos clave para mostrar
  const start = data[0];
  const today = data.find((r) => r.anio === 2026) || start;
  const end = data[data.length - 1];

  return (
    <div className="my-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
          Grafica 1
        </div>
        <h3 className="mt-1 text-xl font-bold text-neutral-900">
          Poblacion total de Colombia, 2018 a 2070
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Proyecciones oficiales del DANE. La poblacion alcanzara su pico cerca de
          2050 con ~55.7M habitantes y luego empezara a caer.
        </p>
      </div>

      {/* Mini stats */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
          <div className="text-xs text-neutral-500">Censo 2018</div>
          <div className="mt-1 text-lg font-bold text-neutral-900 font-mono">
            {formatM(start.total)}
          </div>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-3">
          <div className="text-xs text-indigo-700">Hoy ({today.anio})</div>
          <div className="mt-1 text-lg font-bold text-indigo-900 font-mono">
            {formatM(today.total)}
          </div>
        </div>
        <div className="rounded-lg border border-pink-200 bg-pink-50/40 p-3">
          <div className="text-xs text-pink-700">Pico ({peakRow.anio})</div>
          <div className="mt-1 text-lg font-bold text-pink-900 font-mono">
            {formatM(peakRow.total)}
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
          <div className="text-xs text-neutral-500">Proyeccion {end.anio}</div>
          <div className="mt-1 text-lg font-bold text-neutral-900 font-mono">
            {formatM(end.total)}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="anio"
            stroke="#a3a3a3"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            interval={4}
          />
          <YAxis
            stroke="#a3a3a3"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={formatM}
            domain={[0, 60_000_000]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
            labelStyle={{
              fontWeight: 600,
              color: "#171717",
              marginBottom: "4px",
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                total: "Total nacional",
                cabecera: "Poblacion urbana",
                rural: "Poblacion rural",
              };
              if (value === null || value === undefined) return ["—", labels[name]];
              return [formatFull(value), labels[name] || name];
            }}
          />
          {/* Area de poblacion total */}
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2.5}
            fill="url(#totalGrad)"
            name="total"
          />
          {/* Linea de poblacion urbana (datos solo hasta 2050) */}
          <Line
            type="monotone"
            dataKey="cabecera"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="cabecera"
            connectNulls={false}
          />
          {/* Linea de poblacion rural (datos solo hasta 2050) */}
          <Line
            type="monotone"
            dataKey="rural"
            stroke="#ec4899"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            name="rural"
            connectNulls={false}
          />
          {/* Marca del pico */}
          <ReferenceDot
            x={peakRow.anio}
            y={peakRow.total}
            r={6}
            fill="#ec4899"
            stroke="white"
            strokeWidth={2}
            label={{
              value: `Pico ${peakRow.anio}: ${formatM(peakRow.total)}`,
              position: "top",
              fill: "#ec4899",
              fontSize: 11,
              fontWeight: 700,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-indigo-500"></div>
          <span className="text-neutral-700 font-medium">Poblacion total</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-cyan-500"></div>
          <span className="text-neutral-700 font-medium">
            Urbana <span className="text-neutral-400">(hasta 2050)</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-4 border-t-2 border-dashed border-pink-500"></div>
          <span className="text-neutral-700 font-medium">
            Rural <span className="text-neutral-400">(hasta 2050)</span>
          </span>
        </div>
        <div className="ml-auto text-neutral-500">
          Fuente: DANE — Proyecciones de poblacion nacional 2018-2070
        </div>
      </div>
    </div>
  );
}
