/** Static texture plates: film grain + vignette, painted over everything. */
export function Grain() {
  return (
    <>
      <div className="grain-plate" aria-hidden />
      <div className="vignette-plate" aria-hidden />
    </>
  );
}
