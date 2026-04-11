import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import ChartFrame, { LegendItem } from "./ChartFrame";
import { COLORS, tooltipStyle, tooltipLabelStyle, formatNumber } from "./shared";

// PILA: cotizantes totales verificados oficialmente (fuente: UGPP + reportes Infobae/El Colombiano
// del 31 de marzo de 2026, con datos citados por Bruce Mac Master de la ANDI)
const pilaData: { fecha: string; cotizantes: number }[] = [
  { fecha: "2023-02", cotizantes: 12881 },
  { fecha: "2023-11", cotizantes: 13604 },
  { fecha: "2024-02", cotizantes: 12844 },
  { fecha: "2024-09", cotizantes: 13819 }, // PICO HISTORICO
  { fecha: "2025-02", cotizantes: 12972 },
  { fecha: "2025-04", cotizantes: 13271 },
  { fecha: "2025-05", cotizantes: 13143 },
  { fecha: "2025-12", cotizantes: 13352 },
];

// Dato ANDI marzo 2026: ~11.3M privados formales (NO comparable directamente con los
// cotizantes totales arriba, porque excluye sector publico e independientes)
const andiClaim = {
  fecha: "2026-03",
  privadosFormales: 11300,
  label: "ANDI: 11.3M privados formales",
};

export default function GEIHvsPILA() {
  const [geihData, setGeihData] = useState<{ fecha: string; formalesGEIH: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/informalidad_por_sexo_trimestre_movil_2021_2025.csv")
      .then((r) => r.text())
      .then((csv) => {
        const lines = csv.trim().split("\n");
        const rows = lines.slice(1).map((line) => {
          const v = line.split(",");
          const trim = v[0];
          const formal = Number(v[2]);
          const yearMatch = trim.match(/(\d{4})/);
          const monthMap: Record<string, string> = {
            "Ene - mar": "02",
            "Feb - abr": "03",
            "Mar - may": "04",
            "Abr - jun": "05",
            "May - jul": "06",
            "Jun - ago": "07",
            "Jul - sep": "08",
            "Ago - oct": "09",
            "Sep - nov": "10",
            "Oct - dic": "11",
            "Nov 25 - ene 26": "12",
            "Nov - ene": "12",
            "Dic - feb": "01",
          };
          let year = yearMatch ? yearMatch[1] : "2025";
          let month = "06";
          // Handle cross-year trimesters
          if (trim.includes("Nov 25 - ene 26") || trim.includes("nov 25") || trim.includes("ene 26")) {
            year = "2025";
            month = "12";
          } else if (trim.includes("Dic 25 - feb 26") || trim.includes("dic 25") || trim.includes("feb 26")) {
            year = "2026";
            month = "01";
          } else {
            for (const [k, val] of Object.entries(monthMap)) {
              if (trim.includes(k)) {
                month = val;
                break;
              }
            }
          }
          return {
            fecha: `${year}-${month}`,
            formalesGEIH: Math.round(formal),
          };
        });
        // Filter from 2023 onwards and dedupe
        const filtered = rows.filter((r) => r.fecha >= "2023-01" && !isNaN(r.formalesGEIH));
        setGeihData(filtered);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-500">Cargando...</div>
      </div>
    );
  }

  // Merge all data points
  const allDates = [
    ...new Set([
      ...geihData.map((d) => d.fecha),
      ...pilaData.map((d) => d.fecha),
      "2026-03", // para mostrar marca de controversia
    ]),
  ].sort();

  const merged = allDates.map((fecha) => {
    const g = geihData.find((d) => d.fecha === fecha);
    const p = pilaData.find((d) => d.fecha === fecha);
    return {
      fecha,
      formalesGEIH: g?.formalesGEIH,
      cotizantesPILA: p?.cotizantes,
    };
  });

  return (
    <ChartFrame
      number="Grafica 2 · La controversia"
      title="Dos fuentes oficiales, dos numeros diferentes"
      description="La GEIH del DANE mide 'formales' preguntando a las personas. PILA mide cotizantes reales al sistema. Ambas son oficiales. El pico historico de PILA fue en septiembre 2024 (13.82M). La controversia estallo el 31 de marzo de 2026."
      source="DANE GEIH (extension feb 2026) + UGPP PILA (datos oficiales verificados)"
      legend={
        <>
          <LegendItem color={COLORS.indigo} label="GEIH: Formales (autorreporte)" shape="line" />
          <LegendItem color={COLORS.amber} label="PILA: Cotizantes (registro real)" shape="line" />
        </>
      }
    >
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={merged} margin={{ top: 15, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="fecha"
            stroke="#a3a3a3"
            tickLine={false}
            axisLine={false}
            fontSize={10}
            angle={-35}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#a3a3a3"
            tickLine={false}
            axisLine={false}
            fontSize={11}
            tickFormatter={(v) => formatNumber(v * 1000)}
            domain={[10000, 15000]}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={tooltipLabelStyle}
            formatter={(v: number, name: string) => {
              const labels: Record<string, string> = {
                formalesGEIH: "GEIH: Formales",
                cotizantesPILA: "PILA: Cotizantes",
              };
              if (v === null || v === undefined) return ["-", labels[name]];
              return [`${Math.round(v).toLocaleString("es-CO")} mil`, labels[name] || name];
            }}
          />
          <Line
            type="monotone"
            dataKey="formalesGEIH"
            stroke={COLORS.indigo}
            strokeWidth={3}
            dot={{ r: 4, fill: COLORS.indigo }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="cotizantesPILA"
            stroke={COLORS.amber}
            strokeWidth={3}
            dot={{ r: 4, fill: COLORS.amber }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <ReferenceDot
            x="2024-09"
            y={13819}
            r={8}
            fill="none"
            stroke={COLORS.rose}
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: "Pico PILA: 13.82M",
              position: "top",
              fill: COLORS.rose,
              fontSize: 10,
              fontWeight: 700,
            }}
          />
          <ReferenceLine
            x="2026-03"
            stroke={COLORS.rose}
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{
              value: "Controversia 31/mar",
              position: "insideTopRight",
              fill: COLORS.rose,
              fontSize: 10,
              fontWeight: 700,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
        <strong>Nota sobre la cifra de marzo 2026:</strong> La ANDI citó una caída a ~11.3 millones
        en marzo 2026, pero ese dato se refiere <em>solo a trabajadores privados formales</em>
        (excluye sector público e independientes). No es directamente comparable con los
        ~13M de cotizantes totales que muestra la serie PILA completa. Es parte de por qué
        la controversia es tan enredada: los dos lados usan cifras distintas del mismo
        universo.
      </div>
    </ChartFrame>
  );
}
