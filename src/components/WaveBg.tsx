const WaveBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 80C360 160 720 0 1080 80C1260 120 1380 100 1440 80V200H0V80Z" fill="hsl(217 82% 50% / 0.08)" />
      <path d="M0 120C240 60 480 180 720 120C960 60 1200 140 1440 100V200H0V120Z" fill="hsl(217 82% 50% / 0.05)" />
    </svg>
  </div>
);

export default WaveBg;
