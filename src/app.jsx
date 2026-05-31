/* uShip login / sign-up prototype — top-level router + tweaks panel.
   Visual template comes from the Figma file "login.fig" mounted in /. */

const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "screen": "welcome",
  "showStepper": true
}/*EDITMODE-END*/;

// All screens in the prototype. The Tweaks "screen" select is wired
// straight to this list so a designer can jump anywhere instantly.
const SCREENS = [
  { id: "welcome",         label: "01 · Welcome / Sign-up hub",   group: "Entry" },
  { id: "login",           label: "02 · Login",                   group: "Entry" },
  { id: "shipper-form",    label: "03 · Shipper sign-up form",    group: "Shipper" },
  { id: "carrier-1",       label: "04 · Carrier · Contact info",  group: "Carrier" },
  { id: "carrier-2",       label: "05 · Carrier · MC/DOT",        group: "Carrier" },
  { id: "carrier-3",       label: "06 · Carrier · Company",       group: "Carrier" },
  { id: "carrier-4",       label: "07 · Carrier · Trustd",        group: "Carrier" },
  { id: "success-login",   label: "08 · Logged in",               group: "Done" },
  { id: "success-shipper", label: "09 · Shipper account created", group: "Done" },
  { id: "success-carrier", label: "10 · Carrier account ready",   group: "Done" },
  { id: "loadboard",       label: "11 · Find Shipments board",    group: "Done" },
];

// =================================================================
// LEFT BLUE PANEL CONTENT — what shows next to each screen.
// In the Figma, only Welcome (with hero+peek) and Trustd
// (carrier-4) carry illustrated content; other steps leave the
// panel as a calm solid surface.
// =================================================================
function LeftPanelContent({ screen, data }) {
  if (screen === "welcome") {
    return data.role === "shipper" ? <ShipperHero /> : <CarrierHero />;
  }
  if (screen === "login") {
    return <ShipperHero />;
  }
  if (screen === "shipper-form") {
    return <ShipperHero />;
  }
  if (screen === "carrier-4") {
    return (
      <div className="trustdHero">
        <h2 className="trustdHero__title">Verify your carrier account</h2>
        <p className="trustdHero__body">
          To operate on uShip, carriers complete a one-time verification to confirm identity and business details.
        </p>
        <p className="trustdHero__body">
          We partner with Trustd, an independent carrier verification service, to help prevent fraud and protect legitimate carriers.
        </p>
        <div className="trustdHero__art" aria-hidden="true">
          <div className="trustdHero__shield"><Icon.Shield /></div>
          <div className="trustdHero__truck">
            <div className="trustdHero__truckBody">
              <span>Trustd</span>
            </div>
            <div className="trustdHero__truckCab" />
            <div className="trustdHero__truckWheels">
              <span /><span />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // carrier 1, 2, 3, 5 — empty solid blue (matches Figma)
  if (screen.startsWith("carrier")) {
    return null;
  }
  // Success screens use the matching hero
  if (screen === "success-shipper" || screen === "success-login") return <ShipperHero />;
  if (screen === "success-carrier") return <CarrierHero />;
  return null;
}

// =================================================================
// APP — top-level state machine + tweaks panel host
// =================================================================
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useStateApp(tweaks.screen || "welcome");

  // Shared form state across the wizard — so jumping between
  // screens via Tweaks preserves what's already been typed.
  const [data, setDataRaw] = useStateApp({
    role: "carrier",
    acctType: "personal",
    first: "", last: "", email: "", pw: "", phone: "",
    marketing: false, terms: false, remember: true,
    dot: "", dotValidated: false, verifyMethod: "email",
    company: "", street: "", city: "", state: "", zip: "", country: "United States",
    bizType: "", yearsInBiz: "", fleet: "", teammates: [],
    license: "", vin: "",
    username: "",
  });
  const setData = (patch) => setDataRaw((d) => ({ ...d, ...patch }));

  // History stack so the Back button truly goes back along the path
  // the user took (Carrier-1 → Carrier-2 → Back lands on Carrier-1).
  const [history, setHistory] = useStateApp([screen]);

  // Social-auth overlay state. `socialProvider` = 'google'|'apple'|'facebook'|null.
  // `connected` carries the result for the banner shown on the form screen.
  const [socialProvider, setSocialProvider] = useStateApp(null);
  const [connected, setConnected] = useStateApp(null);

  // Where to send the user after social auth completes — depends on role.
  const handleSocialComplete = ({ provider, account }) => {
    // Pre-fill what the provider would return
    setData({
      first: account.first,
      last: account.last,
      email: account.email,
    });
    setConnected({ provider, account });
    setSocialProvider(null);
    // Drop the user on the appropriate "finish creating account" screen
    goto(data.role === "carrier" ? "carrier-1" : "shipper-form");
  };

  const goto = (next) => {
    setScreen(next);
    setHistory((h) => [...h, next]);
    setTweak("screen", next);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      const target = next[next.length - 1];
      setScreen(target);
      setTweak("screen", target);
      return next;
    });
  };

  // Tweaks → screen sync (when designer picks from the dropdown)
  useEffectApp(() => {
    if (tweaks.screen && tweaks.screen !== screen) {
      setScreen(tweaks.screen);
      setHistory([tweaks.screen]);
    }
    // eslint-disable-next-line
  }, [tweaks.screen]);

  // Match the Figma's account chip label to the chosen role
  const accountName =
    screen.startsWith("carrier") || data.role === "carrier" ? "Transporter" : "Shipper Name";

  const onProvider = (p) => setSocialProvider(p);

  const isLoadboard = screen === "loadboard";

  const renderScreen = () => {
    const common = { data, setData, goto, back, onProvider, connected, clearConnected: () => setConnected(null) };
    if (screen === "welcome")        return <WelcomeScreen {...common} />;
    if (screen === "login")          return <LoginScreen {...common} />;
    if (screen === "shipper-form")   return <ShipperFormScreen {...common} />;
    if (screen === "carrier-1")      return <CarrierContact {...common} />;
    if (screen === "carrier-2")      return <CarrierAuthority {...common} />;
    if (screen === "carrier-3")      return <CarrierCompany {...common} />;
    if (screen === "carrier-4")      return <CarrierTrustd {...common} />;
    if (screen === "loadboard")      return <FindShipments goto={goto} />;
    if (screen.startsWith("success")) return <SuccessScreen kind={screen} goto={goto} />;
    return <WelcomeScreen {...common} />;
  };

  // For carrier flow, switch the role hint shown in the header
  const isCarrierFlow = screen.startsWith("carrier") || (screen === "success-carrier");

  return (
    <div className="app" data-screen={screen}>
      {isLoadboard && <BankVerifyBanner />}
      <AppHeader
        accountName={data.username || "Transporter"}
        onLogo={() => goto(isLoadboard ? "welcome" : "welcome")}
        loggedIn={isLoadboard}
        activeNav={isLoadboard ? "shipments" : null}
      />
      {isLoadboard ? (
        <div className="app__board" data-screen-label={screen}>
          {renderScreen()}
        </div>
      ) : (
        <div className="app__body app__body--centered">
          <main className="app__form" data-screen-label={screen}>
            <div className={"app__formInner" + (screen.startsWith("carrier") ? " app__formInner--wide" : "")}>
              {renderScreen()}
            </div>
          </main>
        </div>
      )}

      {socialProvider && (
        <SocialAuthOverlay
          provider={socialProvider}
          onCancel={() => setSocialProvider(null)}
          onComplete={handleSocialComplete}
        />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Navigate the flow">
          <TweakSelect
            label="Screen"
            value={tweaks.screen}
            onChange={(v) => setTweak("screen", v)}
            options={SCREENS.map((s) => ({ value: s.id, label: s.label }))}
          />
          <TweakRadio
            label="Default role"
            value={data.role}
            onChange={(v) => setData({ role: v })}
            options={[
              { value: "shipper", label: "Shipper" },
              { value: "carrier", label: "Carrier" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Try social sign-up">
          <TweakButton onClick={() => setSocialProvider("google")}>Continue with Google</TweakButton>
          <TweakButton onClick={() => setSocialProvider("apple")}>Continue with Apple</TweakButton>
          <TweakButton onClick={() => setSocialProvider("facebook")}>Continue with Facebook</TweakButton>
        </TweakSection>
        <TweakSection label="Demo data">
          <TweakButton label="Pre-fill all fields" onClick={() => setData({
            first: "Dale", last: "Kovac", email: "dale@daleshauling.co", phone: "(512) 555 - 0142",
            pw: "Sh1pIt!Long&Strong",
            dot: "342156", dotValidated: true,
            company: "Dale's Hauling Co.", street: "1248 E Cesar Chavez St", city: "Austin", state: "TX", zip: "78702", country: "United States",
            bizType: "llc", yearsInBiz: "6-10", fleet: "2-9", teammates: [{ email: "dispatch@daleshauling.com", role: "dispatcher" }],
            license: "TX 32145687", vin: "1FUJA6CV52LK40217",
            username: "dales-hauling",
            terms: true, marketing: false,
          })}>Pre-fill all fields</TweakButton>
          <TweakButton label="Clear" onClick={() => setData({
            first: "", last: "", email: "", phone: "", pw: "",
            dot: "", dotValidated: false,
            company: "", street: "", city: "", state: "", zip: "", country: "United States",
            bizType: "", yearsInBiz: "", fleet: "", teammates: [],
            license: "", vin: "", username: "",
            terms: false, marketing: false,
          })}>Reset</TweakButton>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
