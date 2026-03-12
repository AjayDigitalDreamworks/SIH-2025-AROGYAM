import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";

const MODEL_URL = "https://mental-health-prediction-v5frnpcco7zfmdgwriqddi.streamlit.app/";

export default function StudentMlModel() {
  return (
    <div className="min-h-full bg-gradient-to-br from-amber-50 via-white to-rose-50 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                <Sparkles className="h-3.5 w-3.5" />
                ML Prediction Model
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">Mental Health Prediction</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Use the trained model to assess mental wellness indicators. Results are for support and awareness,
                not clinical diagnosis.
              </p>
            </div>

            <a
              href={MODEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100"
            >
              Open in New Tab
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            This tool offers informational predictions only. If you feel unsafe, reach out to professional support.
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
            <span>Embedded model</span>
            <span>Secure external app</span>
          </div>
          <div className="h-[78vh] w-full">
            <iframe
              src={MODEL_URL}
              title="Mental Health Prediction Model"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
