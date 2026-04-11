import { useEffect, useState } from "react";
import ChartFrame from "./ChartFrame";
import { COLORS, formatFull } from "./shared";

interface Segment {
  label: string;
  value: number;
  color: string;
  description: string;
}

export default function ComposicionPoblacion() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    total: number;
    menores15: number;
    pet: number;
    ocupados: number;
    desocupados: number;
    pei: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/poblacion_colombia_2018_2070.csv").then((r) => r.text()),
      fetch("/data/geih_total_nacional_mensual_2001_2026.csv").then((r) => r.text()),
    ]).then(([popCsv, geihCsv]) => {
      // Total 2026
      const popLines = popCsv.trim().split("\n");
      const pop2026 = popLines.find((l) => l.startsWith("2026,"));
      const total = pop2026 ? Number(pop2026.split(",")[1]) : 53399171;

      // Ultimo mes de GEIH disponible (feb 2026)
      const geihLines = geihCsv.trim().split("\n");
      const lastMonth = geihLines[geihLines.length - 1].split(",");
      // Columnas: fecha, %PET, TGP, TO, TD, TS, Pob total, PET, FT, Ocupados, Desocupados, PEI, Subocupados
      const pet = Number(lastMonth[7]) * 1000;
      const ocupados = Number(lastMonth[9]) * 1000;
      const desocupados = Number(lastMonth[10]) * 1000;
      const pei = Number(lastMonth[11]) * 1000;
      const menores15 = total - pet;

      setData({ total, menores15, pet, ocupados, desocupados, pei });
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
        <div className="text-sm text-neutral-500">Cargando...</div>
      </div>
    );
  }

  const level1: Segment[] = [
    {
      label: "Menores de 15 años",
      value: data.menores15,
      color: COLORS.slate,
      description: "No entran en estadisticas laborales",
    },
    {
      label: "Poblacion en Edad de Trabajar (PET)",
      value: data.pet,
      color: COLORS.indigo,
      description: "Personas de 15 años o mas",
    },
  ];

  const level2: Segment[] = [
    {
      label: "Ocupados",
      value: data.ocupados,
      color: COLORS.emerald,
      description: "Trabajaron al menos 1 hora en la semana de referencia",
    },
    {
      label: "Desocupados",
      value: data.desocupados,
      color: COLORS.rose,
      description: "No trabajaron pero buscaron activamente",
    },
    {
      label: "Poblacion Inactiva (PEI)",
      value: data.pei,
      color: COLORS.violet,
      description: "Ni trabajan ni buscan trabajo",
    },
  ];

  const pctLevel1 = (seg: Segment) => (seg.value / data.total) * 100;
  const pctLevel2 = (seg: Segment) => (seg.value / data.pet) * 100;

  return (
    <ChartFrame
      number="Grafica 1 · Interactiva"
      title={`Como se divide la poblacion de Colombia (${formatFull(data.total / 1_000_000).substring(0, 4)}M)`}
      description="Todas las personas se clasifican en una sola categoria. Datos a febrero 2026."
      source="DANE — GEIH Febrero 2026 + Proyecciones de poblacion"
    >
      {/* Nivel 1: Total → Menores + PET */}
      <div className="mb-8">
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Paso 1: Todos los colombianos
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Total: {formatFull(data.total)}
          </div>
        </div>
        <div className="flex h-16 w-full overflow-hidden rounded-xl border border-neutral-200">
          {level1.map((seg) => (
            <div
              key={seg.label}
              className="group relative flex flex-col justify-center px-4 transition-all hover:brightness-110"
              style={{
                width: `${pctLevel1(seg)}%`,
                backgroundColor: seg.color,
              }}
            >
              <div className="text-xs font-bold text-white truncate">
                {seg.label}
              </div>
              <div className="text-[10px] text-white/90 font-mono">
                {formatFull(seg.value)} ({pctLevel1(seg).toFixed(1)}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nivel 2: PET → Ocupados + Desocupados + PEI */}
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Paso 2: De los que tienen 15+ años (PET)
          </div>
          <div className="text-xs font-mono text-neutral-500">
            PET: {formatFull(data.pet)}
          </div>
        </div>
        <div className="flex h-20 w-full overflow-hidden rounded-xl border border-neutral-200">
          {level2.map((seg) => (
            <div
              key={seg.label}
              className="group relative flex flex-col justify-center px-4 transition-all hover:brightness-110"
              style={{
                width: `${pctLevel2(seg)}%`,
                backgroundColor: seg.color,
              }}
            >
              <div className="text-xs font-bold text-white truncate">
                {seg.label}
              </div>
              <div className="text-[11px] text-white/90 font-mono">
                {formatFull(seg.value)}
              </div>
              <div className="text-[10px] text-white/80">
                {pctLevel2(seg).toFixed(1)}% de la PET
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explicaciones */}
      <div className="grid gap-2">
        {level2.map((seg) => (
          <div
            key={seg.label}
            className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3"
          >
            <div
              className="mt-1 h-3 w-3 flex-shrink-0 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-neutral-900">
                {seg.label}{" "}
                <span className="font-mono text-neutral-500">
                  · {formatFull(seg.value)}
                </span>
              </div>
              <div className="mt-0.5 text-xs text-neutral-600">
                {seg.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartFrame>
  );
}
