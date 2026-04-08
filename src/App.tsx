/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import QRious from 'qrious';

export default function App() {
  const [isTh, setIsTh] = useState(true);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (qrCanvasRef.current) {
      new QRious({
        element: qrCanvasRef.current,
        value: 'https://doi.org/10.5281/zenodo.18212854',
        size: 160,
        foreground: '#0f172a'
      });
    }
  }, []);

  const toggleLang = () => {
    setIsTh(!isTh);
    window.speechSynthesis.cancel();
    resetAudioUI();
  };

  const resetAudioUI = () => {
    setIsSpeaking(false);
  };

  const speakFullReport = () => {
    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      resetAudioUI();
      return;
    }

    const textParts = isTh ? [
        'รายงานความสมบูรณ์ของระบบ ดีเอสจี วัน สำหรับกระบวนการเสนอขายกิจการ',
        'เป้าหมายเชิงกลยุทธ์ คือการเสนอขายหุ้น 80 เปอร์เซ็นต์ โดยผู้ก่อตั้งยังคงถือครอง 20 เปอร์เซ็นต์เพื่อมูลค่าในอนาคต',
        'สถาปัตยกรรมของระบบเป็นแบบ ฟอร์มัล คอนโทรล เพลน ซึ่งผ่านการพิสูจน์ทางคณิตศาสตร์ด้วย แซดทรี โซลเวอร์ ว่ามีความปลอดภัยสูงสุดในระดับ แซททิสไฟเอเบิล',
        'ผลการทดสอบเชิงประจักษ์ ล่าสุด พบว่าผ่านการทดสอบ 85 จาก 86 รายการ คิดเป็น 98.8 เปอร์เซ็นต์',
        'โดยข้อที่พลาดเพียง 1 รายการนั้น เกิดจากปัญหาเครือข่ายภายนอกในการดาวน์โหลดไฟล์ เพลย์ไรท์ ไม่ได้เกิดจากความผิดพลาดของแอปพลิเคชัน',
        'ในส่วนของกลไกการควบคุม มัคแปด อาบิเตอร์ ได้ใช้หลักการ เอทโฟล พาธ เช่น ไรท์ วิว และ ไรท์ เอฟฟอร์ต เพื่อรับประกันว่าทุกการประมวลผลจะมีความถูกต้องแม่นยำ',
        'ระบบยังมีเอนจินป้องกันความเสี่ยงอัตโนมัติ โดยมีการตั้งเกณฑ์ความเสี่ยงสูงสุดไว้ที่ 0.8 และมีระบบตรวจจับความผันผวนหากค่าความต่างเกิน 0.35 ระบบจะเข้าสู่โหมดรักษาเสถียรภาพทันที',
        'ด้านเชิงพาณิชย์ ระบบรองรับการคิดเงินตามการใช้งานจริงผ่าน สไตรป์ และ อัปสแตช โดยแบ่งเป็น 4 ระดับ ตั้งแต่ ไทรอัล จนถึง เอนเตอร์ไพรส์',
        'ข้อมูลทั้งหมดนี้สามารถตรวจสอบได้ผ่าน คาร์โนนิคอล แฮช และเลข อ้างอิง เซโนโด ที่ระบุไว้ในเอกสารครับ'
    ] : [
        'System integrity report for DSG ONE acquisition process.',
        'Strategic objective: 80 percent direct acquisition with 20 percent retained equity for future upside.',
        'Architecture: Formal Control Plane verified by Z3 Solver as Satisfiable for maximum security.',
        'Empirical evidence: 85 out of 86 test cases passed, a 98.8 percent success rate.',
        'The single failure was an external network issue during Playwright binary download, not an application bug.',
        'The Makk8 Arbiter enforces Eightfold Path principles, including Right View and Right Effort, to ensure verifiable outcomes.',
        'Risk gating is set at a 0.8 threshold with oscillation detection. If variance exceeds 0.35, the system stabilizes automatically.',
        'Commercial ready: Real-time billing via Stripe and Upstash across four tiers, from Trial to Enterprise.',
        'All data is anchored by Canonical SHA-256 hashes and Zenodo reference DOIs as shown in the report.'
    ];

    let currentPart = 0;
    function speakNextPart() {
        if (currentPart >= textParts.length) {
            resetAudioUI();
            return;
        }
        const utterance = new SpeechSynthesisUtterance(textParts[currentPart]);
        utterance.lang = isTh ? 'th-TH' : 'en-US';
        utterance.rate = 1.0;
        utterance.onend = () => {
            currentPart++;
            speakNextPart();
        };
        utterance.onerror = () => resetAudioUI();
        synth.speak(utterance);
    }

    setIsSpeaking(true);
    speakNextPart();
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans antialiased ${isTh ? 'lang-th' : 'lang-en'}`}>
      <nav className="sticky top-0 z-50 bg-slate-900 shadow-xl border-b border-teal-500">
        <div className="max-w-6xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <span className="text-teal-400 text-2xl">◈</span>
                <span className="text-white font-black tracking-tighter text-xl">DSG ONE <span className="text-teal-500 text-sm font-normal">EVIDENCE</span></span>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={speakFullReport} id="audioBtn" className={`flex items-center space-x-3 text-white px-4 py-2 rounded-full transition-all shadow-lg shadow-teal-900/20 ${isSpeaking ? 'bg-rose-600' : 'bg-teal-600 hover:bg-teal-500'}`}>
                    <span id="audioIcon" className="text-lg">{isSpeaking ? '■' : '▶'}</span>
                    <div id="waveContainer" className={`audio-wave ${isSpeaking ? '' : 'hidden'}`}>
                        <div className="wave-1"></div><div class="wave-2"></div><div class="wave-3"></div>
                    </div>
                    <div className="text-left leading-tight">
                        <div className="text-[10px] opacity-80 uppercase font-bold">Full Report Audio</div>
                        <div className="text-xs font-bold">{isTh ? 'ฟังรายงาน 10 นาที' : '10m Audio Briefing'}</div>
                    </div>
                </button>
                <button onClick={toggleLang} className="bg-slate-800 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-700">
                    {isTh ? 'ENGLISH' : 'ภาษาไทย'}
                </button>
            </div>
        </div>
      </nav>
      <header className="bg-slate-900 text-white pt-16 pb-20 border-b-8 border-indigo-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
            <h1 className="text-[12rem] font-black leading-none">MAKK8</h1>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 px-4 py-1 rounded text-xs font-mono">
                    COMMIT: 7F1594AD | DATE: 2026-04-04
                </div>
                <div className="flex space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-500 text-slate-900">80% Acquisition Ready</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white">20% Retained Equity</span>
                </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                {isTh ? (
                    <>รายงานการพิสูจน์ <br/><span className="text-teal-400">เพื่อเสนอขายกิจการ</span></>
                ) : (
                    <>Acquisition Prospectus <br/><span className="text-teal-400">& Evidence Report</span></>
                )}
            </h1>
            <div className={`max-w-3xl text-slate-400 text-lg leading-relaxed space-y-4 ${isTh ? '' : 'hidden'}`}>
                <p>DSG ONE คือระบบ Agent Orchestration ที่มีรากฐานเป็นระบบควบคุมทางคณิตศาสตร์ (Formal Control Plane) ข้อมูลทั้งหมดในรายงานฉบับนี้เป็นข้อเท็จจริงที่ตรวจสอบได้จาก Codebase จริง ปราศจากการคาดเดา</p>
            </div>
            <div className={`max-w-3xl text-slate-400 text-lg leading-relaxed ${isTh ? 'hidden' : ''}`}>
                <p>DSG ONE is an Agent Orchestration platform built on a Formal Control Plane. Every piece of data in this report is verifiable truth extracted from the actual codebase, with zero fabrication.</p>
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold border-l-4 border-teal-500 pl-4">
                    {isTh ? 'รากฐานเทคนิคและหลักฐานความสมบูรณ์' : 'Technical Foundation & Integrity Proofs'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Core Spec SHA-256</div>
                        <code className="text-[11px] font-mono font-bold text-indigo-700 break-all leading-tight">8d73cf93de5aa71c1cb1b9d93d15fc5124977dc0781cf0c1698216412ba623af</code>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-2">Arbiter SHA-256</div>
                        <code className="text-[11px] font-mono font-bold text-teal-700 break-all leading-tight">e46190a79879ee3ca7ef00db6601998439fb71166b90c9612bf33b9fb4190bef</code>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
                        <div className="text-2xl font-black text-teal-400">98.8%</div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Test Pass Rate</div>
                    </div>
                    <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
                        <div className="text-2xl font-black text-indigo-400">SAT</div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Z3 Formal Proof</div>
                    </div>
                    <div className="bg-slate-900 text-white p-4 rounded-2xl text-center">
                        <div className="text-2xl font-black text-rose-400">0.8</div>
                        <div className="text-[9px] uppercase font-bold opacity-60">Risk Threshold</div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-center text-center">
                <canvas ref={qrCanvasRef} className="mb-4"></canvas>
                <div className="space-y-1">
                    <div className="text-xs font-black uppercase text-slate-800 tracking-widest">DOI Verified</div>
                    <div className="text-[10px] font-mono text-slate-500">10.5281/ZENODO.18212854</div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 w-full">
                    <a href="https://tdealer01-crypto-dsg-control-plane.vercel.app/enterprise-proof/report" target="_blank" className="text-indigo-600 text-[10px] font-bold underline">VIEW LIVE EVIDENCE REPORT</a>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

