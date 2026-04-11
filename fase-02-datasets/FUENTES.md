# Fase 2 - Datasets: Inventario y Fuentes

Este documento lista TODOS los archivos descargados en la Fase 2, su origen, contenido y como citarlos.

Fecha de descarga inicial: **10 de abril de 2026**
Ultima actualizacion de datos: **10 de abril de 2026** (actualizacion con anexos DANE feb 2026 y GEIHEISS nov 2025-ene 2026)

---

## Estructura

```
fase-02-datasets/
├── FUENTES.md                 <-- este archivo
├── raw/                       <-- archivos originales descargados (PDF, Excel, HTML)
│   ├── dane_anexos_excel/     <-- anexos estadisticos Excel del DANE
│   ├── dane_boletines_pdf/    <-- boletines tecnicos PDF del DANE
│   ├── dane_demografia/       <-- proyecciones de poblacion y estadisticas vitales
│   ├── ugpp_pila/             <-- informes de cotizantes PILA
│   └── banrep/                <-- (reservado para series Banco de la Republica)
└── processed/                 <-- datasets limpios en CSV
```

---

## DATASETS PROCESADOS (CSV listos para analisis)

Todos los archivos CSV estan en `processed/` y usan codificacion UTF-8 con separador coma.

### 1. Demografia

#### `poblacion_colombia_2018_2070.csv`
- **Contenido**: Poblacion total proyectada de Colombia por anio, desagregada en cabecera (urbana) vs centros poblados y rural disperso
- **Periodo**: 2018-2070 (53 anios)
- **Columnas**: `anio, poblacion_total, poblacion_cabecera, poblacion_centros_poblados_rural`
- **Fuente primaria**: DANE - Proyecciones de Poblacion con ajuste post-COVID-19
- **Archivo origen**: `raw/dane_demografia/PPED-AreaNac-2018-2070.xlsx`
- **URL oficial**: https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaNac-2018-2070.xlsx
- **Como citar**: DANE (2024). Proyecciones y Retroproyecciones de Poblacion Nacional por area (1950-2070). Actualizacion post-COVID-19.
- **Observaciones**: Los valores despues de 2050 solo tienen total nacional. El pico de poblacion se proyecta en ~2050 con 55.65 millones.

#### `piramide_poblacional_2026.csv` (y 2020, 2023, 2030, 2050)
- **Contenido**: Poblacion por edad (0 a 100+ anos), desagregada por sexo
- **Columnas**: `edad, hombres, mujeres, total`
- **Fuente primaria**: DANE - Proyecciones de Poblacion por sexo y edad
- **Archivo origen**: `raw/dane_demografia/PPED-AreaSexoEdadNac-2018-2070.xlsx`
- **URL oficial**: https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx
- **Como citar**: DANE (2024). Proyecciones de Poblacion por Sexo y Edad - Nacional 2018-2070.

#### `piramide_poblacional_consolidada.csv`
- **Contenido**: Una sola tabla con las piramides de 2020, 2023, 2026, 2030 y 2050 lado a lado
- **Columnas**: `edad, h_2020, m_2020, h_2023, m_2023, h_2026, m_2026, h_2030, m_2030, h_2050, m_2050`
- **Uso previsto**: Graficas comparativas de envejecimiento poblacional

#### `nacimientos_defunciones_2015_2024.csv`
- **Contenido**: Serie anual de nacimientos y defunciones no fetales en Colombia
- **Periodo**: 2015-2024 (+ enero-julio 2025 preliminar)
- **Columnas**: `anio, nacimientos, defunciones_no_fetales, nac_ene_jul`
- **Fuente primaria**: DANE - Estadisticas Vitales (EEVV)
- **Como citar**: DANE (2025). Estadisticas Vitales - Nacimientos y defunciones no fetales 2024 y ano corrido 2025pr. Boletin tecnico del 25 de septiembre de 2025.
- **URL boletin**: https://www.dane.gov.co/files/operaciones/EEVV/2025/25-sep-2025/bol-EEVV-Isem2025pr.pdf
- **Observaciones**: Las cifras fueron extraidas del boletin tecnico. Los anexos estadisticos oficiales son `anex-EEVV-Nacimientos-2024-definitivas.xlsx` y `anex-EEVV-Defunciones-2024-definitivas.xlsx` disponibles en `raw/dane_demografia/`. Estos traen detalles por municipio, edad de la madre, sexo del recien nacido, causa de defuncion, etc.

### 2. Mercado laboral - Serie mensual

#### `geih_total_nacional_mensual_2001_2026.csv` (archivo estrella)
- **Contenido**: Serie mensual completa de indicadores de mercado laboral total nacional
- **Periodo**: enero 2001 - enero 2026 (296 meses, 25 anios)
- **Columnas**:
  - `fecha` (formato YYYY-MM)
  - `% PET` - porcentaje de poblacion en edad de trabajar
  - `TGP` - Tasa Global de Participacion
  - `TO` - Tasa de Ocupacion
  - `TD` - Tasa de Desocupacion (desempleo)
  - `TS` - Tasa de Subocupacion (subempleo)
  - `Poblacion total (miles)`
  - `PET (miles)` - poblacion 15+ anios
  - `Fuerza de trabajo (miles)` - PEA
  - `Ocupados (miles)`
  - `Desocupados (miles)`
  - `PEI fuera fuerza trabajo (miles)` - poblacion economicamente inactiva
  - `Subocupados (miles)`
- **Fuente primaria**: DANE - Gran Encuesta Integrada de Hogares (GEIH)
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIH-ene2026.xlsx`, hoja "Total nacional"
- **URL oficial**: https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-ene2026.xlsx
- **Como citar**: DANE (2026). Gran Encuesta Integrada de Hogares - Anexo estadistico - Boletin Enero 2026. Publicado el 27 de febrero de 2026.
- **Observaciones criticas**:
  - Desde enero 2022, la serie usa el marco muestral CNPV 2018 (nueva metodologia)
  - Los datos anteriores fueron retroproyectados para mantener comparabilidad
  - La definicion de PET cambio: antes era 12+ anios urbano / 10+ rural; ahora es 15+ universal

#### `geih_13_ciudades_mensual_2001_2026.csv`
- **Contenido**: Mismos indicadores pero para el agregado de las 13 ciudades principales
- **Periodo**: 2001-2026 (296 meses)
- **Fuente**: DANE - GEIH, hoja "Total 13 ciudades A.M."
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIH-ene2026.xlsx`
- **13 ciudades**: Bogota, Medellin A.M., Cali A.M., Barranquilla A.M., Bucaramanga A.M., Manizales A.M., Pereira A.M., Cucuta A.M., Pasto, Ibague, Monteria, Cartagena, Villavicencio

#### `ocupados_por_rama_nacional_2015_2026.csv`
- **Contenido**: Ocupados por rama de actividad economica (sector), total nacional
- **Periodo**: enero 2015 - enero 2026 (133 meses)
- **Ramas incluidas** (15): Poblacion ocupada Total, No informa, Agricultura, Electricidad/gas/agua/mineria, Industrias manufactureras, Construccion, Comercio, Alojamiento y comida, Transporte, Informacion/comunicaciones, Finanzas/seguros, Inmobiliarias, Profesionales/tecnicas, Gobierno/educacion/salud, Artes/entretenimiento
- **Clasificacion**: CIIU Rev. 4 A.C. (2022)
- **Fuente**: DANE - GEIH, hoja "Ocupados TN_T13_rama"
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIH-ene2026.xlsx`

#### `ocupados_por_posicion_nacional_2010_2026.csv`
- **Contenido**: Ocupados por posicion ocupacional (tipo de trabajador)
- **Periodo**: enero 2010 - enero 2026 (193 meses)
- **Categorias** (8): Total, Obrero particular, Obrero gobierno, Empleado domestico, Cuenta propia, Patron/empleador, Familiar sin pago, Jornalero/peon, Otro
- **Fuente**: DANE - GEIH, hoja "Ocupados TN_posición"
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIH-ene2026.xlsx`

#### `pei_desagregada_nacional_2010_2026.csv`
- **Contenido**: Poblacion fuera de la fuerza de trabajo (PEI) desagregada
- **Periodo**: enero 2010 - enero 2026 (193 meses)
- **Columnas**: `fecha, PEI_total, Estudiando, Oficios_del_hogar, Otros`
- **Fuente**: DANE - GEIH, hoja "Pob_fuera_fuerza_trabajo_TN"
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIH-ene2026.xlsx`
- **Nota**: La categoria "Otros" incluye pensionados, jubilados, rentistas, incapacitados permanentes, y desalentados (personas que no les llama la atencion o creen que no vale la pena trabajar)

### 3. Informalidad - Trimestral movil

#### `informalidad_por_ciudad_trimestre_movil_2021_2025.csv`
- **Contenido**: Proporcion de informalidad (%) por ciudad y dominio
- **Periodo**: 57 trimestres moviles desde enero-marzo 2021 hasta septiembre-noviembre 2025
- **Dominios** (26): Total nacional, 13 ciudades A.M., 23 ciudades A.M., y 23 ciudades individuales (Bogota, Medellin, Cali, Barranquilla, Bucaramanga, Manizales, Pasto, Pereira, Cucuta, Ibague, Monteria, Cartagena, Villavicencio, Tunja, Florencia, Popayan, Valledupar, Quibdo, Neiva, Riohacha, Santa Marta, Armenia, Sincelejo)
- **Fuente**: DANE - GEIH Boletin Ocupacion Informal
- **Archivo origen**: `raw/dane_anexos_excel/anexo-GEIHEISS-sep-nov2025.xlsx`, hoja "Prop informalidad"
- **URL oficial**: https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-sep-nov2025.xlsx
- **Como citar**: DANE (2026). Gran Encuesta Integrada de Hogares - Ocupacion Informal - Trimestre movil septiembre-noviembre 2025. Publicado el 16 de enero de 2026.
- **Metodologia**: 17a CIET OIT 2003 (nueva metodologia desde enero 2022)

#### `informalidad_por_sexo_trimestre_movil_2021_2025.csv`
- **Contenido**: Ocupados formales e informales por sexo (cifras absolutas en miles)
- **Periodo**: 57 trimestres moviles 2021-2025
- **Columnas**: Ocupados_TN, Formales_TN, Informales_TN, Hombres_total, Hombres_formales, Hombres_informales, Mujeres_total, Mujeres_formales, Mujeres_informales
- **Fuente**: DANE - GEIH, hoja "Sexo"

#### `informalidad_por_tamano_empresa_2021_2025.csv`
- **Contenido**: Ocupados formales e informales por tamano de empresa
- **Periodo**: 57 trimestres moviles 2021-2025
- **Categorias**: Microempresa (hasta 10), pequena (11-50), mediana (51-200), grande (mas de 200)
- **Fuente**: DANE - GEIH, hoja "Tamaño de empresa"

---

## ARCHIVOS RAW (originales)

### DANE - Anexos Estadisticos Excel (`raw/dane_anexos_excel/`)

| Archivo | Contenido | URL |
|---------|-----------|-----|
| `anexo-GEIH-feb2026.xlsx` | Serie mensual empleo/desempleo hasta **febrero 2026** (ultimo dato) | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-feb2026.xlsx |
| `anexo-GEIH-ene2026.xlsx` | Serie mensual empleo/desempleo hasta enero 2026 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-ene2026.xlsx |
| `anexo-GEIH-dic2025.xlsx` | Serie mensual hasta diciembre 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-dic2025.xlsx |
| `anexo-GEIH-nov2025.xlsx` | Hasta noviembre 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-nov2025.xlsx |
| `anexo-GEIH-oct2025.xlsx` | Hasta octubre 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-oct2025.xlsx |
| `anexo-GEIH-sep2025.xlsx` | Hasta septiembre 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-sep2025.xlsx |
| `anexo-GEIH-ago2025.xlsx` | Hasta agosto 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-ago2025.xlsx |
| `anexo-GEIH-jul2025.xlsx` | Hasta julio 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-jul2025.xlsx |
| `anexo-GEIH-jun2025.xlsx` | Hasta junio 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-jun2025.xlsx |
| `anexo-GEIH-may2025.xlsx` | Hasta mayo 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-may2025.xlsx |
| `anexo-GEIH-abr2025.xlsx` | Hasta abril 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-abr2025.xlsx |
| `anexo-GEIH-mar2025.xlsx` | Hasta marzo 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-mar2025.xlsx |
| `anexo-GEIH-feb2025.xlsx` | Hasta febrero 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-feb2025.xlsx |
| `anexo-GEIH-ene2025.xlsx` | Hasta enero 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-ene2025.xlsx |
| `anexo-GEIH-dic2024.xlsx` | Hasta diciembre 2024 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIH-dic2024.xlsx |
| `anexo-GEIHEISS-nov2025-ene2026.xlsx` | Informalidad trimestre **nov 2025 - ene 2026** (ultimo disponible) | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-nov2025-ene2026.xlsx |
| `anexo-GEIHEISS-oct-dic2025.xlsx` | Informalidad trimestre oct-dic 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-oct-dic2025.xlsx |
| `anexo-GEIHEISS-sep-nov2025.xlsx` | Informalidad trimestre sep-nov 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-sep-nov2025.xlsx |
| `anexo-GEIHEISS-ago-oct2025.xlsx` | Informalidad ago-oct 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-ago-oct2025.xlsx |
| `anexo-GEIHEISS-jul-sep2025.xlsx` | Informalidad jul-sep 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-jul-sep2025.xlsx |
| `anexo-GEIHEISS-jun-ago2025.xlsx` | Informalidad jun-ago 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-jun-ago2025.xlsx |
| `anexo-GEIHEISS-may-jul2025.xlsx` | Informalidad may-jul 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-may-jul2025.xlsx |
| `anexo-GEIHEISS-abr-jun2025.xlsx` | Informalidad abr-jun 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-abr-jun2025.xlsx |
| `anexo-GEIHEISS-mar-may2025.xlsx` | Informalidad mar-may 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-mar-may2025.xlsx |
| `anexo-GEIHEISS-feb-abr2025.xlsx` | Informalidad feb-abr 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-feb-abr2025.xlsx |
| `anexo-GEIHEISS-ene-mar2025.xlsx` | Informalidad ene-mar 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-ene-mar2025.xlsx |
| `anexo-GEIHEISS-dic2024-feb2025.xlsx` | Informalidad dic 2024-feb 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-dic2024-feb2025.xlsx |
| `anexo-GEIHEISS-nov2024-ene2025.xlsx` | Informalidad nov 2024-ene 2025 | https://www.dane.gov.co/files/operaciones/GEIH/anex-GEIHEISS-nov2024-ene2025.xlsx |

Total: **25 archivos Excel** (~71 MB combinados)

### DANE - Boletines Tecnicos PDF (`raw/dane_boletines_pdf/`)

14 boletines mensuales GEIH (enero 2026 hasta diciembre 2024), 11 boletines trimestrales de informalidad (GEIHEISS), y 2 boletines de Estadisticas Vitales (EEVV 2024 definitivas y I semestre 2025 preliminares).

Patron URL: `https://www.dane.gov.co/files/operaciones/GEIH/bol-GEIH-{mes}.pdf`
y `https://www.dane.gov.co/files/operaciones/GEIH/bol-GEIHEISS-{trimestre}.pdf`

### DANE - Demografia (`raw/dane_demografia/`)

| Archivo | Contenido |
|---------|-----------|
| `PPED-AreaNac-2018-2070.xlsx` | Proyecciones poblacion nacional por area (cabecera, rural, total) 2018-2070 |
| `PPED-AreaSexoEdadNac-2018-2070.xlsx` | Proyecciones por sexo y edad simple (0-100 anos) 2018-2070 |
| `PPED-AreaNac-1950-2017.xlsx` | Retroproyecciones poblacion 1950-2017 |
| `PPED-AreaDep-2018-2050_VP.xlsx` | Proyecciones departamentales 2018-2050 |
| `anex-EEVV-Nacimientos-2024-definitivas.xlsx` | Nacimientos 2024 definitivos (16 hojas de desagregaciones) |
| `anex-EEVV-Defunciones-2024-definitivas.xlsx` | Defunciones no fetales 2024 definitivas |

### UGPP - PILA (`raw/ugpp_pila/`)

| Archivo | Contenido | URL |
|---------|-----------|-----|
| `ugpp-Mayo25.html` | Informe mensual de cotizantes mayo 2025 | https://www.ugpp.gov.co/wp-content/uploads/2025/07/Mayo25.html |
| `ugpp-cotizantes-nov2020.pdf` | Boletin cotizantes noviembre 2020 | https://www.ugpp.gov.co/sites/default/files/Nuestra-entidad/05-Cotizantes_noviembre_2020.pdf |
| `ugpp-cotizaciones-jun2021.pdf` | Boletin mensual junio 2021 | https://www.ugpp.gov.co/sites/default/files/Nuestra-entidad/Cotizaciones_Sistema_Proteccion_Social_Junio_2021_0.pdf |
| `ugpp-presentacion-nov2023.html` | Informe noviembre 2023 | https://www.ugpp.gov.co/sites/default/files/Parafiscales/Presentacion_NOV_2023.html |
| `ugpp-presentacion-dic2023.html` | Informe diciembre 2023 | https://www.ugpp.gov.co/sites/default/files/Parafiscales/Presentacion_DIC_2023.html |
| `ugpp-informe-gestion-2025.pdf` | Informe de Gestion 2025 UGPP (publicado enero 2026) | https://www.ugpp.gov.co/wp-content/uploads/2026/01/Informe-de-Gestion-2025_Consolidado.pdf |

### Banco de la Republica (`raw/banrep/`)

| Archivo | Contenido | URL |
|---------|-----------|-----|
| `bie-6-abr-2026.pdf` | Boletin de Indicadores Economicos del 6 de abril 2026. Confirma TD feb 2026 = 9.23%, inflacion 5.29%, PIB 2025 +2.6% | https://www.banrep.gov.co/economia/pli/bie.pdf |

---

## COMO USAR LOS CSV PROCESADOS

### Con Python
```python
import pandas as pd
df = pd.read_csv('processed/geih_total_nacional_mensual_2001_2026.csv')
df['fecha'] = pd.to_datetime(df['fecha'])
df.plot(x='fecha', y='TD', title='Tasa de Desempleo Colombia 2001-2026')
```

### Con R
```r
df <- read.csv('processed/geih_total_nacional_mensual_2001_2026.csv')
df$fecha <- as.Date(paste0(df$fecha, '-01'))
plot(df$fecha, df$TD, type='l', main='Tasa de Desempleo Colombia')
```

### Con Excel / Google Sheets
Abrir directamente los archivos CSV. Ya estan listos para graficar.

---

## QUE FALTA POR DESCARGAR (si se necesita profundizar)

1. **Microdatos GEIH** (para analisis de microdatos persona a persona): requiere registro en https://microdatos.dane.gov.co
2. **PILA datos mensuales 2024-2026** de la UGPP: hay que explorar el tablero de control https://www.ugpp.gov.co/Evolucion-cotizaciones-Sistema-Proteccion-Social
3. **Series del Banco de la Republica**: https://www.banrep.gov.co/es/estadisticas - requiere navegar su portal
4. **Datos PAEF/UGPP sobre Empleos para la Vida**: https://paef.ugpp.gov.co/empleos-para-la-vida/
5. **Encuesta Pulso de la Migracion**: https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/encuesta-pulso-de-la-migracion-epm

---

## TOTAL DESCARGADO

- **16 archivos CSV procesados** en `processed/` (listos para analisis)
- **63 archivos raw** (25 Excel DANE + 27 PDF boletines + 6 Excel demografia + 5 archivos UGPP)
- **Cobertura temporal**:
  - Serie mensual de empleo: 2001-2026 (25 anios)
  - Serie trimestral de informalidad: 2021-2025 (5 anios)
  - Nacimientos y defunciones: 2015-2024 (+ 2025 preliminar)
  - Proyecciones de poblacion: 2018-2070
- **Peso total aprox**: ~100 MB
