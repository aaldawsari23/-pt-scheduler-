import React from "react";

type Props = { open: boolean; onClose: () => void; };

// Helper to combine class names, similar to clsx
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

const btnBase =
  "inline-flex items-center justify-center px-4 py-2 rounded-lg border text-sm font-medium transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2";

const primary = "border-slate-300 bg-white hover:bg-slate-50 focus:ring-slate-400";

const itemBtn =
  "flex-grow md:flex-grow-0 px-5 py-3 rounded-xl border shadow-sm hover:shadow transition text-sm font-semibold";

// primary path = PDF; fallback = HTML
const PATHS = {
  NECK: { pdf: "/education/neck-pain.pdf", page: "/education/index.html?type=neck-pain" },
  LBP: { pdf: "/education/lbp.pdf", page: "/education/index.html?type=lbp" },
  KNEE: { pdf: "/education/knee-oa.pdf", page: "/education/index.html?type=knee-oa" },
  BELLS: { pdf: "/education/bells-palsy.pdf", page: "/education/index.html?type=bells-palsy" },
};

function openEducation(primaryUrl: string, fallbackUrl: string) {
  const w = window.open(primaryUrl, "_blank", "noopener");
  // if blocked or 404 later, user can hit fallback button inside new tab
  if (!w) {
      window.open(fallbackUrl, "_blank", "noopener");
  }
}

export default function HomeExercisesModal({ open, onClose }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 printable-modal-container">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-[92vw] max-w-2xl rounded-2xl border bg-white text-slate-800 shadow-2xl",
          "p-5 md:p-6",
          "animate-slideInTop",
          "printable-modal-content"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hep-modal-title"
      >
        <div className="flex items-center justify-between gap-3 mb-4 no-print">
          <h2 id="hep-modal-title" className="text-lg md:text-xl font-bold">التمارين المنزلية — Home Exercises</h2>
          <button className={cn(btnBase, primary)} onClick={onClose} aria-label="Close">إغلاق</button>
        </div>

        <div className="print-container">
          <div className="content-section">
            <p className="text-sm text-slate-500 mb-6 no-print">
              اختر الحالة، سيتم فتح ملف PDF جاهز للطباعة.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <button
                className={cn(itemBtn, "border-red-200 bg-red-50 hover:bg-red-100 text-red-800")}
                onClick={() => openEducation(PATHS.NECK.pdf, PATHS.NECK.page)}
              >
                Neck-Pain
              </button>
              <button
                className={cn(itemBtn, "border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800")}
                onClick={() => openEducation(PATHS.LBP.pdf, PATHS.LBP.page)}
              >
                LBP
              </button>
              <button
                className={cn(itemBtn, "border-green-200 bg-green-50 hover:bg-green-100 text-green-800")}
                onClick={() => openEducation(PATHS.KNEE.pdf, PATHS.KNEE.page)}
              >
                KNEE-OA
              </button>
              <button
                className={cn(itemBtn, "border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800")}
                onClick={() => openEducation(PATHS.BELLS.pdf, PATHS.BELLS.page)}
              >
                العصب السابع (Bells Palsy)
              </button>
            </div>
          </div>

          {/* This section is only visible during print */}
          <div className="hidden active-print">
            {/* Print content will be dynamically injected here if needed */}
            <p>Please print from the opened PDF file.</p>
          </div>
        </div>
      </div>
    </div>
  );
}