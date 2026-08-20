import { GaneshaMark } from "@/components/brand/ganesha-mark";

export interface CertificateView {
  studioName: string;
  tagline: string;
  recipientName: string;
  courseTitle: string;
  durationLabel: string;
  completedAt: Date | string;
  issuedAt: Date | string;
  serialNumber: string;
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MandalaWatermark() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="#c9a227" strokeWidth="1.2">
        <circle cx="200" cy="200" r="46" />
        <circle cx="200" cy="200" r="78" />
        <circle cx="200" cy="200" r="118" />
        <circle cx="200" cy="200" r="158" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * Math.PI) / 8;
          const x1 = 200 + Math.cos(a) * 52;
          const y1 = 200 + Math.sin(a) * 52;
          const x2 = 200 + Math.cos(a) * 156;
          const y2 = 200 + Math.sin(a) * 156;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4 - Math.PI / 8;
          const cx = 200 + Math.cos(a) * 98;
          const cy = 200 + Math.sin(a) * 98;
          return (
            <ellipse
              key={`p-${i}`}
              cx={cx}
              cy={cy}
              rx="18"
              ry="32"
              transform={`rotate(${(a * 180) / Math.PI} ${cx} ${cy})`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function PaisleyCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden fill="none">
      <path
        d="M12 128V42C12 22 28 8 48 8h86"
        stroke="#5c1a1b"
        strokeWidth="3.2"
      />
      <path
        d="M22 128V48C22 32 35 18 52 18h66"
        stroke="#c9a227"
        strokeWidth="1.6"
      />
      <path
        d="M38 52c18-28 52-22 52 8 0 22-18 32-32 32-8 0-14-4-14-10 0-8 10-10 16-6"
        stroke="#c9a227"
        strokeWidth="1.8"
      />
      <path
        d="M54 58c8-12 22-10 22 4 0 10-8 14-14 14"
        stroke="#5c1a1b"
        strokeWidth="1.2"
      />
      <circle cx="48" cy="48" r="3.2" fill="#c9a227" />
      <circle cx="72" cy="28" r="2.2" fill="#b04a2f" />
      <path d="M28 88c10-6 18-4 22 4" stroke="#c9a227" strokeWidth="1.2" />
      <path d="M88 28c6 10 4 18-4 22" stroke="#c9a227" strokeWidth="1.2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={36 + i * 10} cy={24} r="1.3" fill="#c9a227" />
      ))}
    </svg>
  );
}

function VineEdge({ vertical }: { vertical?: boolean }) {
  return (
    <svg
      viewBox={vertical ? "0 0 24 400" : "0 0 400 24"}
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="none"
    >
      <g fill="none" stroke="#c9a227" strokeWidth="1.4">
        {Array.from({ length: 9 }).map((_, i) => {
          const p = 28 + i * 42;
          return vertical ? (
            <g key={i}>
              <path d={`M12 ${p}c6 8 6 16 0 24`} />
              <circle cx="12" cy={p + 12} r="1.6" fill="#c9a227" stroke="none" />
            </g>
          ) : (
            <g key={i}>
              <path d={`M${p} 12c8-6 16-6 24 0`} />
              <circle cx={p + 12} cy="12" r="1.6" fill="#c9a227" stroke="none" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function GoldSeal({ serial }: { serial: string }) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="sealGold" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#f3e0a6" />
            <stop offset="55%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#8a6b12" />
          </radialGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#sealGold)" />
        <circle cx="60" cy="60" r="50" fill="none" stroke="#5c1a1b" strokeWidth="1.4" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="#5c1a1b" strokeWidth="0.7" strokeDasharray="2 3" />
      </svg>
      <div className="relative z-10 flex flex-col items-center text-[#5c1a1b]">
        <GaneshaMark className="h-8 w-8 sm:h-9 sm:w-9" />
        <p className="mt-0.5 max-w-[4.5rem] truncate px-1 text-center font-mono text-[0.45rem] font-semibold tracking-wider sm:text-[0.5rem]">
          {serial}
        </p>
      </div>
    </div>
  );
}

export function CourseCertificate({ certificate }: { certificate: CertificateView }) {
  return (
    <article
      id="course-certificate"
      className="relative aspect-[1.414/1] w-full overflow-hidden text-[#5c1a1b] shadow-[0_25px_80px_rgba(92,26,27,0.28)] print:shadow-none"
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, #fffdf6 0%, #f6ead3 52%, #ead7b4 100%)",
      }}
    >
      <div className="pointer-events-none absolute left-1/2 top-[46%] h-[78%] w-[55%] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]">
        <MandalaWatermark />
      </div>

      <div className="absolute inset-[10px] border-[3px] border-[#5c1a1b]" />
      <div className="absolute inset-[16px] border border-[#c9a227]" />
      <div className="absolute inset-[21px] border-[6px] border-[#5c1a1b]/90" />
      <div className="absolute inset-[29px] border border-[#c9a227]/80" />

      <div className="absolute inset-x-16 top-9 h-5 opacity-80 sm:inset-x-20">
        <VineEdge />
      </div>
      <div className="absolute inset-x-16 bottom-9 h-5 opacity-80 sm:inset-x-20">
        <VineEdge />
      </div>
      <div className="absolute inset-y-16 left-9 w-5 opacity-80 sm:inset-y-20">
        <VineEdge vertical />
      </div>
      <div className="absolute inset-y-16 right-9 w-5 opacity-80 sm:inset-y-20">
        <VineEdge vertical />
      </div>

      <PaisleyCorner className="absolute left-8 top-8 h-[4.5rem] w-[4.5rem] sm:h-24 sm:w-24" />
      <PaisleyCorner className="absolute right-8 top-8 h-[4.5rem] w-[4.5rem] rotate-90 sm:h-24 sm:w-24" />
      <PaisleyCorner className="absolute bottom-8 left-8 h-[4.5rem] w-[4.5rem] -rotate-90 sm:h-24 sm:w-24" />
      <PaisleyCorner className="absolute bottom-8 right-8 h-[4.5rem] w-[4.5rem] rotate-180 sm:h-24 sm:w-24" />

      <div className="absolute inset-0 flex flex-col items-center px-[8%] py-[7%] text-center sm:px-[11%]">
        <GaneshaMark className="h-12 w-12 text-[#5c1a1b] sm:h-14 sm:w-14" />
        <p className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.42em] text-[#b04a2f] sm:text-[0.72rem]">
          {certificate.studioName}
        </p>

        <div className="relative mt-3 flex w-full max-w-xl items-center justify-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a227]" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#c9a227]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c9a227]" />
        </div>

        <h1 className="mt-2 font-heading text-[1.65rem] font-semibold leading-none tracking-wide text-[#5c1a1b] sm:text-5xl">
          Certificate of Completion
        </h1>
        <p className="mt-1.5 text-[0.62rem] uppercase tracking-[0.38em] text-[#8a6b12] sm:text-xs">
          Awarded with distinction
        </p>

        <p className="mt-4 text-[0.68rem] uppercase tracking-[0.32em] text-[#7a6455] sm:mt-5 sm:text-xs">
          This is to certify that
        </p>
        <p className="mt-1 font-heading text-[1.85rem] font-semibold italic leading-tight text-[#b04a2f] sm:text-5xl">
          {certificate.recipientName}
        </p>
        <div className="mt-1 h-[2px] w-48 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent sm:w-72" />

        <p className="mt-3 max-w-lg text-[0.8rem] leading-relaxed text-[#5c1a1b]/85 sm:text-[0.95rem]">
          has successfully completed the professional henna artistry programme
        </p>
        <div className="mt-2 rounded-sm border border-[#c9a227]/70 bg-[#fffaf0]/70 px-5 py-2 shadow-[inset_0_0_0_1px_rgba(92,26,27,0.08)]">
          <p className="font-heading text-xl font-semibold text-[#5c1a1b] sm:text-3xl">
            {certificate.courseTitle}
          </p>
          <p className="mt-0.5 text-xs tracking-wide text-[#7a6455] sm:text-sm">
            {certificate.durationLabel}
          </p>
        </div>

        <p className="mt-3 max-w-md text-[0.7rem] italic leading-relaxed text-[#7a6455] sm:text-sm">
          {certificate.tagline}
        </p>

        <div className="mt-auto grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-end gap-3 pb-1 pt-4 sm:gap-6">
          <div>
            <p className="font-heading text-sm font-semibold sm:text-lg">
              {formatDate(certificate.completedAt)}
            </p>
            <div className="mx-auto mt-1 h-px w-24 bg-[#5c1a1b]/35" />
            <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-[#7a6455] sm:text-[0.65rem]">
              Date of completion
            </p>
          </div>

          <GoldSeal serial={certificate.serialNumber} />

          <div>
            <p className="font-heading text-sm font-semibold sm:text-base">
              {certificate.studioName}
            </p>
            <div className="mx-auto mt-1 h-px w-28 bg-[#5c1a1b]/35" />
            <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-[#7a6455] sm:text-[0.65rem]">
              Authorized signature
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
