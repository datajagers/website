import { ArrowCta } from "@/components/ArrowCta";

export default function NotFound() {
  return (
    <main id="hoofdinhoud" className="band-dark nietgevonden">
      <span className="mono eyebrow">Fout 404</span>
      <h1>Deze pagina bestaat niet.</h1>
      <p>
        De link klopt niet meer, of de pagina is verplaatst. Ga terug naar de
        homepage of stuur ons een bericht, dan zoeken we het samen uit.
      </p>
      <div className="acties">
        <ArrowCta href="/" label="Naar de homepage" />
        <ArrowCta href="/contact" label="Neem contact op" />
      </div>
    </main>
  );
}
