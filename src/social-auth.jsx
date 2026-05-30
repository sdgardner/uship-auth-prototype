/* uShip social-auth overlay.

   This is an ORIGINAL uShip-styled OAuth consent flow — it does NOT
   replicate Google / Apple / Facebook's real chooser or consent
   screens. The provider is referenced only by its glyph + display
   name in a uShip card. Stages:

     1. account-chooser   — pick a mocked account from the provider
     2. permissions       — uShip's consent panel ("we'll receive…")
     3. connecting        — short spinner
     4. (close + bubble up the chosen profile to the host)
*/

const { useState: useStateSA, useEffect: useEffectSA } = React;

const PROVIDER_META = {
  google: {
    name: "Google",
    glyph: () => <GoogleG />,
    badgeBg: "var(--gray-0)",
    badgeBorder: "1px solid var(--gray-300)",
    badgeColor: "var(--gray-800)",
    accounts: [
      { id: "g1", first: "Dale",  last: "Kovac",   email: "dale.kovac@gmail.com",     initials: "DK", color: "#0F9D58" },
      { id: "g2", first: "D.",    last: "Kovac",   email: "dales.hauling.co@gmail.com", initials: "DH", color: "#4285F4" },
    ],
  },
  apple: {
    name: "Apple",
    glyph: () => (
      <span style={{ display: "inline-grid", placeItems: "center", width: 28, height: 28, background: "#000", borderRadius: 6 }}>
        <AppleGlyph />
      </span>
    ),
    badgeBg: "#000",
    badgeBorder: "1px solid #000",
    badgeColor: "#fff",
    accounts: [
      { id: "a1", first: "Dale", last: "Kovac", email: "dale.kovac@icloud.com", initials: "DK", color: "#333" },
      { id: "a2", first: "Dale", last: "Kovac", email: "_____@privaterelay.appleid.com", relay: true, initials: "DK", color: "#666" },
    ],
  },
  facebook: {
    name: "Facebook",
    glyph: () => (
      <span style={{ display: "inline-grid", placeItems: "center", width: 28, height: 28, background: "rgb(24,119,242)", borderRadius: 6 }}>
        <FacebookGlyph />
      </span>
    ),
    badgeBg: "rgb(24,119,242)",
    badgeBorder: "1px solid rgb(24,119,242)",
    badgeColor: "#fff",
    accounts: [
      { id: "f1", first: "Dale", last: "Kovac", email: "dale.kovac@outlook.com", initials: "DK", color: "#1877F2" },
    ],
  },
};

// What uShip "asks for" — matches what the prototype's create-account
// forms actually use, so the consent feels honest.
const PERMISSIONS = [
  { icon: "envelope", title: "Your name and email address",
    sub: "So we can create your uShip account and send shipment notifications." },
  { icon: "id",       title: "Your basic profile",
    sub: "Profile photo and locale to personalize your dashboard." },
];

function PermIcon({ kind }) {
  if (kind === "envelope") return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <polyline points="3 7 12 13 21 7"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 21a8 8 0 0 1 16 0"/>
    </svg>
  );
}

function CloseX(p) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// =================================================================
// SOCIAL AUTH OVERLAY
// =================================================================
function SocialAuthOverlay({ provider, onCancel, onComplete }) {
  const meta = PROVIDER_META[provider];
  const [stage, setStage] = useStateSA("chooser"); // chooser → perms → connecting
  const [chosen, setChosen] = useStateSA(null);

  // Auto-advance the "connecting" stage to onComplete after ~1.6s
  useEffectSA(() => {
    if (stage !== "connecting") return;
    const t = setTimeout(() => {
      onComplete({ provider, account: chosen });
    }, 1600);
    return () => clearTimeout(t);
  }, [stage]);

  if (!meta) return null;

  return (
    <div className="sa-overlay" role="dialog" aria-modal="true" aria-label={`Continue with ${meta.name}`}>
      <div className="sa-backdrop" onClick={onCancel} />

      <div className="sa-modal" key={stage}>
        {/* Header — provider chip + close */}
        <div className="sa-modal__head">
          <div className="sa-modal__provider">
            <span className="sa-modal__providerBadge" style={{ background: meta.badgeBg, border: meta.badgeBorder, color: meta.badgeColor }}>
              <meta.glyph />
            </span>
            <div className="sa-modal__providerText">
              <div className="sa-modal__providerName">Continue with {meta.name}</div>
              <div className="sa-modal__providerHost">uship.com wants to use your {meta.name} account</div>
            </div>
          </div>
          <button type="button" className="sa-modal__close" aria-label="Cancel" onClick={onCancel}>
            <CloseX />
          </button>
        </div>

        {/* Stage 1: account chooser */}
        {stage === "chooser" && (
          <div className="sa-stage">
            <div className="sa-stage__title">Choose an account</div>
            <div className="sa-stage__sub">to continue to uShip</div>

            <ul className="sa-accounts">
              {meta.accounts.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="sa-account"
                    onClick={() => { setChosen(a); setStage("perms"); }}
                  >
                    <span className="sa-account__avatar" style={{ background: a.color }}>{a.initials}</span>
                    <span className="sa-account__id">
                      <span className="sa-account__name">{a.first} {a.last}{a.relay ? " (Hide My Email)" : ""}</span>
                      <span className="sa-account__email">{a.email}</span>
                    </span>
                    <svg className="sa-account__chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </li>
              ))}
              <li>
                <button type="button" className="sa-account sa-account--alt" onClick={() => { setChosen(meta.accounts[0]); setStage("perms"); }}>
                  <span className="sa-account__avatar sa-account__avatar--plus">+</span>
                  <span className="sa-account__id">
                    <span className="sa-account__name">Use a different account</span>
                  </span>
                </button>
              </li>
            </ul>

            <p className="sa-fineprint">
              To continue, {meta.name} will share your name, email address, language preference, and profile picture with uShip. Before using this app, you can review uShip's <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> and <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>.
            </p>
          </div>
        )}

        {/* Stage 2: permissions */}
        {stage === "perms" && chosen && (
          <div className="sa-stage">
            <div className="sa-perms__who">
              <span className="sa-account__avatar" style={{ background: chosen.color }}>{chosen.initials}</span>
              <div>
                <div className="sa-perms__whoName">{chosen.first} {chosen.last}</div>
                <div className="sa-perms__whoMail">{chosen.email}</div>
              </div>
              <button type="button" className="sa-perms__switch" onClick={() => setStage("chooser")}>Not you?</button>
            </div>

            <div className="sa-stage__title sa-stage__title--lg">uShip would like to:</div>

            <ul className="sa-perms">
              {PERMISSIONS.map((p) => (
                <li key={p.title} className="sa-perm">
                  <span className="sa-perm__icon"><PermIcon kind={p.icon} /></span>
                  <div>
                    <div className="sa-perm__title">{p.title}</div>
                    <div className="sa-perm__sub">{p.sub}</div>
                  </div>
                </li>
              ))}
            </ul>

            <p className="sa-fineprint">
              You can revoke uShip's access at any time in your {meta.name} account settings. Granting access doesn't create your uShip account yet — you'll finish setup on the next screen.
            </p>

            <div className="sa-actions">
              <button type="button" className="skid-btn skid-btn--tertiary skid-btn--lg" onClick={onCancel}>Cancel</button>
              <button type="button" className="skid-btn skid-btn--primary skid-btn--lg" onClick={() => setStage("connecting")}>Allow &amp; continue</button>
            </div>
          </div>
        )}

        {/* Stage 3: connecting */}
        {stage === "connecting" && chosen && (
          <div className="sa-stage sa-stage--connect">
            <div className="sa-connect">
              <span className="sa-connect__dot sa-connect__dot--prov" style={{ background: meta.badgeBg, border: meta.badgeBorder, color: meta.badgeColor }}>
                <meta.glyph />
              </span>
              <span className="sa-connect__line" aria-hidden="true">
                <span className="sa-connect__pulse" />
              </span>
              <span className="sa-connect__dot sa-connect__dot--ship">
                <UShipLogo height={20} />
              </span>
            </div>
            <div className="sa-stage__title sa-stage__title--lg">Connecting your {meta.name} account…</div>
            <div className="sa-stage__sub">Securely linking {chosen.email} to uShip.</div>
            <div className="sa-connect__bar"><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SocialAuthOverlay, PROVIDER_META });
