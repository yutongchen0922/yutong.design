import Script from "next/script";

export function PixelPet() {
  return (
    <>
      <Script src="/pixel-pet.js" strategy="afterInteractive" />
      <div className="fixed bottom-4 right-4 z-40">
        <pixel-pet style={{ width: 180, height: 180 }} />
      </div>
    </>
  );
}
