import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface Row {
  edad: string;
  hombres: number;
  mujeres: number;
}

const YEARS = [2020, 2026, 2050] as const;
type Year = (typeof YEARS)[number];

export default function PiramidePoblacional() {
  const [rawData, setRawData] = useState<Record<Year, Row[]>>({
    2020: [],
    2026: [],
    2050: [],
  });
  const [selectedYear, setSelectedYear] = useState<Year>(2026);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      YEARS.map((year) =>
        fetch(`/data/piramide_poblacional_${year}.csv`)
          .then((r) => r.text())
          .then((csv) => {
            const lines = csv.trim().split("\n");
            const rows: Row[] = lines.slice(1).map((line) => {
              const [edad, h, m] = line.split(",");
              return {
                edad: edad.toString(),
                hombres: Number(h) || 0,
                mujeres: Number(m) || 0,
              };
            });
            return { year, rows };
          })
      )
    ).then((results) => {
      const data = {} as Record<Year, Row[]>;
      results.forEach(({ year, rows }) => {
        data[year] = rows;
      });
      setRawData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-500">Cargando piramide poblacional...</div>
      </div>
    );
  }

  // Group by 5-year brackets for cleaner visualization
  const groupByBracket = (rows: Row[]) => {
    const brackets: { label: string; hombres: number; mujeres: number }[] = [];
    for (let start = 0; start < 100; start += 5) {
      const end = start + 4;
      const label = start === 95 ? "95+" : `${start}-${end}`;
      let hombres = 0;
      let mujeres = 0;
      for (let age = start; age <= end && age <= 100; age++) {
        const row = rows.find((r) => r.edad === age.toString() || (age === 100 && r.edad === "100+"));
        if (row) {
          hombres += row.hombres;
          mujeres += row.mujeres;
        }
      }
      brackets.push({ label, hombres: -hombres, mujeres });
    }
    return brackets;
  };

  const chartData = groupByBracket(rawData[selectedYear]);
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(Math.abs(d.hombres), d.mujeres))
  );

  const formatK = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${Math.round(abs / 1000)}K`;
    return abs.toString();
  };

  const totalHombres = rawData[selectedYear].reduce((sum, r) => sum + r.hombres, 0);
  const totalMujeres = rawData[selectedYear].reduce((sum, r) => sum + r.mujeres, 0);
  const total = totalHombres + totalMujeres;

  return (
    <div className="my-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Grafica 3 · Interactiva
          </div>
          <h3 className="mt-1 text-xl font-bold text-neutral-900">
            Piramide poblacional de Colombia
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Observa como Colombia pasa de una piramide joven (2020) a una envejecida (2050).
            Haz click para cambiar de año.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1">
          {YEARS.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all ${
                selectedYear === year
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-neutral-50 p-3">
          <div className="text-xs text-neutral-500">Total</div>
          <div className="mt-1 text-lg font-bold text-neutral-900 font-mono">
            {(total / 1_000_000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-lg bg-cyan-50 p-3">
          <div className="text-xs text-cyan-700">Hombres</div>
          <div className="mt-1 text-lg font-bold text-cyan-900 font-mono">
            {(totalHombres / 1_000_000).toFixed(1)}M
          </div>
        </div>
        <div className="rounded-lg bg-pink-50 p-3">
          <div className="text-xs text-pink-700">Mujeres</div>
          <div className="mt-1 text-lg font-bold text-pink-900 font-mono">
            {(totalMujeres / 1_000_000).toFixed(1)}M
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          layout="vertical"
          stackOffset="sign"
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          barCategoryGap={2}
        >
          <XAxis
            type="number"
            tickFormatter={(v) => formatK(v)}
            domain={[-maxValue * 1.05, maxValue * 1.05]}
            stroke="#a3a3a3"
            tickLine={false}
            axisLine={false}
            fontSize={11}
          />
          <YAxis
            type="category"
            dataKey="label"
            stroke="#737373"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              fontSize: "13px",
            }}
            labelFormatter={(l) => `Edad: ${l} años`}
            formatter={(value: number, name: string) => {
              const abs = Math.abs(value);
              const label = name === "hombres" ? "Hombres" : "Mujeres";
              return [abs.toLocaleString("es-CO"), label];
            }}
          />
          <ReferenceLine x={0} stroke="#525252" strokeWidth={1} />
          <Bar
            dataKey="hombres"
            fill="#06b6d4"
            name="hombres"
            radius={[4, 0, 0, 4]}
          />
          <Bar
            dataKey="mujeres"
            fill="#ec4899"
            name="mujeres"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-cyan-500"></div>
            <span className="text-neutral-700 font-medium">Hombres</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-pink-500"></div>
            <span className="text-neutral-700 font-medium">Mujeres</span>
          </div>
        </div>
        <div className="text-neutral-500">
          Fuente: DANE — Proyecciones por sexo y edad
        </div>
      </div>
    </div>
  );
}
