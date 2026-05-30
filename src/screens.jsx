/* All screens for the uShip login/sign-up flow.
   Visual template — solid blue left + white form card on right — comes
   straight from the Figma "login.fig" file. */

const { useState: useS, useEffect: useE } = React;

// Format raw digits as US phone: (xxx) xxx - xxxx
function formatPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return "(" + d;
  if (d.length < 7) return "(" + d.slice(0, 3) + ") " + d.slice(3);
  return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + " - " + d.slice(6);
}
function handlePhoneChange(setData) {
  return (e) => setData({ phone: formatPhone(e.target.value) });
}

// =================================================================
// CONNECTED BANNER — shown on the create-account form after a user
// completes the social-auth overlay. Confirms what we received from
// the provider so they know which account they're finishing.
// =================================================================
function ConnectedBanner({ connected, onDismiss }) {
  if (!connected) return null;
  const meta = PROVIDER_META[connected.provider];
  if (!meta) return null;
  return (
    <div className="connectedBanner" role="status">
      <span
        className="connectedBanner__badge"
        style={{ background: meta.badgeBg, border: meta.badgeBorder, color: meta.badgeColor }}
      >
        <meta.glyph />
      </span>
      <div className="connectedBanner__text">
        <strong>Connected with {meta.name}</strong> · We pre-filled your name and email from{" "}
        <strong>{connected.account.email}</strong>. Confirm the details below to finish.
      </div>
      <button type="button" className="connectedBanner__close" aria-label="Dismiss" onClick={onDismiss}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

// =================================================================
// PRODUCT PEEK — small mocked card stack used on the Welcome screen
// to give the blue panel some texture (shipper-02 design).
// =================================================================
function ShipmentPeek() {
  return (
    <div className="peek" aria-hidden="true">
      <div className="peek__card peek__card--back">
        <div className="peek__row">
          <span className="peek__id">SHP-08431</span>
          <span className="peek__badge">3 QUOTES</span>
        </div>
        <div className="peek__route">
          <div className="peek__city">
            <div className="peek__cityName">Austin, TX</div>
            <div className="peek__cityZip">78701</div>
          </div>
          <svg className="peek__line" viewBox="0 0 160 14" preserveAspectRatio="none">
            <path d="M2 7 Q 80 -6 158 7" fill="none" stroke="rgb(0,131,187)" strokeWidth="1.6" strokeDasharray="3 4"/>
            <circle cx="2" cy="7" r="2.6" fill="rgb(0,131,187)"/>
            <circle cx="158" cy="7" r="2.6" fill="rgb(0,131,187)"/>
          </svg>
          <div className="peek__city peek__city--end">
            <div className="peek__cityName">Denver, CO</div>
            <div className="peek__cityZip">80202</div>
          </div>
        </div>
        <div className="peek__meta">1 upright piano · 480 lbs · 980 mi</div>
      </div>
      <div className="peek__card peek__card--front">
        <div className="peek__quoteHead">
          <span className="peek__avatar">DH</span>
          <span className="peek__quoteName">
            Dale's Hauling Co.
            <Icon.Shield style={{ width: 12, height: 12, color: "rgb(0,131,187)", marginLeft: 4 }} />
          </span>
          <span className="peek__quotePrice">$675</span>
        </div>
        <div className="peek__quoteFoot">
          <span className="peek__rating">4.9 · 480 deliveries</span>
        </div>
        <div className="peek__quoteBtns">
          <span className="peek__btn peek__btn--ghost">Message</span>
          <span className="peek__btn peek__btn--accept">Accept Quote</span>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// SHIPPER MARKETING — the headline + peek + partners stack
// (shipper-02). Mirrors the carrier marketing for the other role.
// =================================================================
function ShipperHero() {
  return (
    <div className="hero">
      <h1 className="hero__title">Join the best big and bulky movers</h1>
      <p className="hero__sub">Post your shipment, compare quotes from feedback-rated carriers, and track every mile — all in one place.</p>
      <div className="hero__peek"><ShipmentPeek /></div>
      <div className="hero__trust">
        <div className="hero__trustLbl">TRUSTED PARTNER OF</div>
        <div className="hero__trustRow">
          <span>Chairish</span>
          <span>1stdibs</span>
          <span>Etsy</span>
        </div>
      </div>
    </div>
  );
}

function CarrierHero() {
  return (
    <div className="hero">
      <h1 className="hero__title">Find loads that fit your truck.</h1>
      <p className="hero__sub">Bid on shipments along your route, get paid securely through uShip Payments, and build a feedback-rated reputation.</p>
      <div className="hero__lane">
        <div className="hero__lanePill">
          <div className="hero__laneCol">
            <div className="hero__laneCity">Austin, TX</div>
            <div className="hero__laneZip">Pick up Mar 14</div>
          </div>
          <svg className="hero__laneArrow" viewBox="0 0 180 14" preserveAspectRatio="none">
            <path d="M2 7 Q 90 -6 178 7" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 4"/>
            <circle cx="2" cy="7" r="2.6" fill="#fff"/>
            <circle cx="178" cy="7" r="2.6" fill="#fff"/>
          </svg>
          <div className="hero__laneCol hero__laneCol--end">
            <div className="hero__laneCity">Denver, CO</div>
            <div className="hero__laneZip">Deliver Mar 17</div>
          </div>
        </div>
        <div className="hero__bidCard">
          <div>
            <div className="hero__bidLbl">YOUR BID</div>
            <div className="hero__bidVal">$675</div>
          </div>
          <div className="hero__bidRight">
            <div className="hero__bidLbl">TOP BID</div>
            <div className="hero__bidTop">$640</div>
          </div>
        </div>
      </div>
      <div className="hero__trust">
        <div className="hero__trustLbl">CARRIERS HAULING WITH USHIP</div>
        <div className="hero__trustRow">
          <span>Owner-operators</span>
          <span>Fleets</span>
          <span>Auto haulers</span>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// WELCOME (shipper-02 / carrier-06) — role segmented control,
// social row, "or email" divider, single email field, Continue.
// =================================================================
function WelcomeScreen({ data, setData, goto, onProvider }) {
  const isShipper = data.role === "shipper";
  return (
    <>
      <div className="screen__head">
        <h1 className="screen__title">Welcome {isShipper ? "Shipper" : "Transporter"}</h1>
        <p className="screen__sub">
          {isShipper ? "I have stuff I need to get from A to B" : "I have a truck and I want to haul"}
        </p>
      </div>

      <div className="screen__roleSwitch">
        <SegmentedTwo
          value={data.role}
          onChange={(v) => setData({ role: v })}
          options={[
            { value: "shipper", label: "Shipper" },
            { value: "carrier", label: "Transporter" },
          ]}
        />
      </div>

      <div className="screen__body">
        <SocialButtons mode="Sign up" onProvider={onProvider} disabled={isShipper} />
        <OrDivider />
        <Field label="Email">
          <TextInput
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData({ email: e.target.value })}
            autoComplete="email"
          />
        </Field>
        <button
          type="button"
          className="skid-btn skid-btn--primary skid-btn--lg btn--full"
          onClick={() => goto(isShipper ? "shipper-form" : "carrier-1")}
        >
          Continue
        </button>
        <div className="screen__alt">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); goto("login"); }}>Login</a>
        </div>
      </div>
    </>
  );
}

// =================================================================
// LOGIN — single-field email + password form using the same chrome.
// =================================================================
function LoginScreen({ data, setData, goto, onProvider }) {
  return (
    <>
      <div className="screen__head">
        <h1 className="screen__title">Welcome back</h1>
        <p className="screen__sub">Log in to your uShip account.</p>
      </div>

      <div className="screen__body">
        <SocialButtons mode="Continue" onProvider={onProvider} />
        <OrDivider />
        <Field label="Email">
          <TextInput type="email" placeholder="you@example.com" value={data.email}
            onChange={(e) => setData({ email: e.target.value })} autoComplete="email" />
        </Field>
        <Field label="Password" className="screen__pwField">
          <PasswordInput
            value={data.pw}
            onChange={(e) => setData({ pw: e.target.value })}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Field>
        <div className="screen__pwMeta">
          <Checkbox checked={data.remember || false} onChange={(v) => setData({ remember: v })}>
            Keep me signed in
          </Checkbox>
          <a href="#" className="screen__forgot">Forgot password?</a>
        </div>

        <button
          type="button"
          className="skid-btn skid-btn--primary skid-btn--lg btn--full"
          onClick={() => goto("success-login")}
        >
          Log In
        </button>
        <div className="screen__alt">
          New to uShip?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); goto("welcome"); }}>Sign up free</a>
        </div>
      </div>
    </>
  );
}

// =================================================================
// SHIPPER SIGN UP (shipper-01) — Personal/Business toggle then
// First/Last/Password/Email/Phone + agreements + "Join Uship".
// =================================================================
function ShipperFormScreen({ data, setData, goto, back, connected, clearConnected }) {
  return (
    <>
      <div className="screen__head">
        <h1 className="screen__title">Welcome Shipper</h1>
        <p className="screen__sub">I have stuff I need to get from A to B</p>
      </div>

      {connected && <ConnectedBanner connected={connected} onDismiss={clearConnected} />}

      <div className="screen__roleSwitch">
        <SegmentedTwo
          value={data.acctType || "personal"}
          onChange={(v) => setData({ acctType: v })}
          options={[
            { value: "personal", label: "Personal" },
            { value: "business", label: "Business" },
          ]}
        />
      </div>

      <div className="screen__body">
        <div className="row row--2">
          <Field label="First Name">
            <TextInput value={data.first} onChange={(e) => setData({ first: e.target.value })} autoComplete="given-name" />
          </Field>
          <Field label="Last Name">
            <TextInput value={data.last} onChange={(e) => setData({ last: e.target.value })} autoComplete="family-name" />
          </Field>
        </div>

        <Field label="Password" hint="This is helper text">
          <PasswordInput
            value={data.pw}
            onChange={(e) => setData({ pw: e.target.value })}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </Field>

        <div className="row row--email">
          <Field label="Email" hint={<a href="#" className="lnk" onClick={(e) => e.preventDefault()}>We don't spam</a>}>
            <TextInput type="email" value={data.email} onChange={(e) => setData({ email: e.target.value })} autoComplete="email" />
          </Field>
          <Field label="Phone Number">
            <TextInput type="tel" value={data.phone} placeholder="(575) 555 - 1234"
              inputMode="numeric" maxLength={16}
              onChange={handlePhoneChange(setData)} autoComplete="tel" />
          </Field>
        </div>

        <div className="screen__checks">
          <Checkbox checked={data.marketing} onChange={(v) => setData({ marketing: v })}>
            I agree to receive marketing calls, texts, and voicemails—including those using AI or automated systems—from uShip at the number I provide. Consent isn't required to purchase. Msg &amp; data rates may apply. Reply STOP to opt out. (Optional)
          </Checkbox>
          <Checkbox checked={data.terms} onChange={(v) => setData({ terms: v })}>
            I agree to the terms of uShip's{" "}
            <a href="#" className="lnk" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>User Agreement</a>{" "}and{" "}
            <a href="#" className="lnk" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>Privacy Policy</a>
          </Checkbox>
        </div>

        <button
          type="button"
          className="skid-btn skid-btn--primary skid-btn--lg btn--full"
          onClick={() => goto("success-shipper")}
          disabled={!data.terms}
        >
          Join Uship
        </button>

        <div className="screen__alt">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); goto("login"); }}>Login</a>
        </div>
      </div>
    </>
  );
}

// =================================================================
// CARRIER SHELL — naked layout per Figma. Heading + lead + form
// flows directly on the form column (no card wrapper). A divider
// line separates the body from the FooterNav (handled by .carrierForm__divider).
// =================================================================
function CarrierShell({ step, children }) {
  return (
    <>
      <h1 className="screen__title screen__title--center">Account Creation</h1>
      <Stepper steps={CARRIER_STEPS} current={step} />
      <div className="carrierForm">
        {children}
      </div>
    </>
  );
}

// Inline section used in place of FormCard — just a title + lead + fields,
// no white card around them.
function CarrierSection({ title, lead, children }) {
  return (
    <section className="carrierForm__section">
      {title && <h3 className="carrierForm__title">{title}</h3>}
      {lead && <p className="carrierForm__lead">{lead}</p>}
      <div className="carrierForm__fields">{children}</div>
    </section>
  );
}

function CarrierContact({ data, setData, goto, back, connected, clearConnected }) {
  return (
    <CarrierShell step={1}>
      {connected && <ConnectedBanner connected={connected} onDismiss={clearConnected} />}
      <CarrierSection title="Who is signing up?">
        <div className="row row--2">
          <Field label="First Name">
            <TextInput value={data.first} onChange={(e) => setData({ first: e.target.value })} />
          </Field>
          <Field label="Last Name">
            <TextInput value={data.last} onChange={(e) => setData({ last: e.target.value })} />
          </Field>
        </div>
        <div className="row row--2">
          {connected ? (
            <>
              <Field label="User Name" hint={"Linked to your " + (PROVIDER_META[connected.provider] ? PROVIDER_META[connected.provider].name : "social") + " login"}>
                <TextInput value={data.email} disabled />
              </Field>
              <Field label="Company handle" hint="Dispatchers see this when you bid">
                <TextInput value={data.username} onChange={(e) => setData({ username: e.target.value })}
                  placeholder={data.company ? data.company.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "company-handle"} />
              </Field>
            </>
          ) : (
            <>
              <Field label="User Name" hint="Dispatchers see this when you bid">
                <TextInput value={data.username} onChange={(e) => setData({ username: e.target.value })}
                  placeholder={data.company ? data.company.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "company-handle"} />
              </Field>
              <Field label="Password">
                <PasswordInput
                  value={data.pw}
                  onChange={(e) => setData({ pw: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />
              </Field>
            </>
          )}
        </div>
        <div className="row row--email">
          <Field label="Email" hint={<a href="#" className="lnk" onClick={(e) => e.preventDefault()}>We don't spam</a>}>
            <TextInput type="email" value={data.email} onChange={(e) => setData({ email: e.target.value })} />
          </Field>
          <Field label="Phone Number">
            <TextInput type="tel" value={data.phone} placeholder="(575) 555 - 1234"
              inputMode="numeric" maxLength={16}
              onChange={handlePhoneChange(setData)} />
          </Field>
        </div>
        <div className="carrierForm__checks">
          <Checkbox checked={data.marketing} onChange={(v) => setData({ marketing: v })}>
            I agree to receive marketing calls, texts, and voicemails—including those using AI or automated systems—from uShip at the number I provide. Consent isn't required to purchase. Msg &amp; data rates may apply. Reply STOP to opt out. (Optional)
          </Checkbox>
          <Checkbox checked={data.terms} onChange={(v) => setData({ terms: v })}>
            I agree to the terms of uShip's{" "}
            <a href="#" className="lnk" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>User Agreement</a>{" "}and{" "}
            <a href="#" className="lnk" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>Privacy Policy</a>
          </Checkbox>
        </div>
      </CarrierSection>
      <div className="carrierForm__divider" />
      <FooterNav onBack={() => goto("welcome")} onContinue={() => goto("carrier-2")} />
    </CarrierShell>
  );
}

function CarrierAuthority({ data, setData, goto, back }) {
  const [validated, setValidated] = useS(!!data.dotValidated);
  const [verifyMethod, setVerifyMethod] = useS(data.verifyMethod || "email");
  const [codeSent, setCodeSent] = useS(false);
  const [verified, setVerified] = useS(!!data.dotVerified);

  return (
    <CarrierShell step={2}>
      <CarrierSection title="Do you have a MC/DOT?"
        lead={<>uShip requires all carriers on our platform to hold a valid DOT number. <a href="#" className="lnk">Learn More</a></>}
      >
        <Field label="DOT number">
          <div className="inputAttach">
            <input
              className="skid-input inputAttach__input"
              value={data.dot}
              placeholder="12345"
              onChange={(e) => { setData({ dot: e.target.value }); setValidated(false); }}
            />
            <button
              type="button"
              className="skid-btn skid-btn--secondary skid-btn--lg inputAttach__btn"
              onClick={() => { setValidated(true); setData({ dotValidated: true }); }}
            >
              Validate
            </button>
          </div>
        </Field>

        {validated && (
          <>
            <p className="carrierForm__hint">We found the following company information associated with this DOT:</p>
            <div className="dotResult">
              <div className="dotResult__co">
                <span className="dotResult__icon"><Icon.Building /></span>
                <div>
                  <div className="dotResult__name">Example Company Name LLC</div>
                  <div className="dotResult__addr">123 Example Street, Austin TX 78702</div>
                </div>
              </div>
              <div className="dotResult__via">
                <div>Info provided by<br />Carrier Details</div>
                <CarrierDetailsMark />
              </div>
            </div>

            <div className="carrierForm__sub">
              <div className="carrierForm__subTitle">Please select a method of verification to continue<span className="field__required">*</span></div>
              <div className="radioStack">
                <Radio name="verify" checked={verifyMethod === "email"} onChange={() => setVerifyMethod("email")}>
                  Email a code to <strong>dispatch@examplecompany.com</strong>
                </Radio>
                <Radio name="verify" checked={verifyMethod === "phone"} onChange={() => setVerifyMethod("phone")}>
                  Text a code to <strong>(512) 555&nbsp;–&nbsp;0142</strong>
                </Radio>
              </div>
              <button type="button" className="skid-btn skid-btn--secondary skid-btn--md" onClick={() => setCodeSent(true)}>
                {codeSent ? "Resend Verification" : "Send Verification"}
              </button>
            </div>

            <Field label="4 digit-code">
              <div className="inputAttach">
                <input className="skid-input inputAttach__input" placeholder={codeSent ? "Enter code" : "Send code first"} />
                <button
                  type="button"
                  className="skid-btn skid-btn--secondary skid-btn--lg inputAttach__btn"
                  disabled={!codeSent}
                  onClick={() => { setVerified(true); setData({ dotVerified: true }); }}
                >
                  Validate
                </button>
              </div>
            </Field>

            {verified && (
              <div className="skid-alert skid-alert--success" role="status">
                <span className="skid-alert__icon"><Icon.CheckCircle /></span>
                <div className="skid-alert__body">
                  <div className="skid-alert__title">DOT verified</div>
                  <div className="skid-alert__text">Example Company Name LLC is confirmed. You're all set to continue.</div>
                </div>
              </div>
            )}
          </>
        )}
      </CarrierSection>
      <div className="carrierForm__divider" />
      <FooterNav onBack={() => goto("carrier-1")} onContinue={() => goto("carrier-3")} disabled={!verified} />
    </CarrierShell>
  );
}

const FLEET_OPTIONS = [
  {
    value: "1",
    num: "1", unit: "truck",
    title: "Solo driver", kicker: "Owner-operator",
    feats: ["Browse & bid on loads", "Get paid per shipment", "No setup required"],
  },
  {
    value: "2-9",
    num: "2–9", unit: "trucks",
    title: "Small fleet", kicker: "Marketplace carrier",
    feats: ["Everything in Solo", "Add up to 9 drivers", "Shared saved searches"],
  },
  {
    value: "10+",
    num: "10+", unit: "trucks",
    title: "Larger fleet", kicker: "Partner carrier",
    feats: ["API & bulk booking", "Dispatch & analytics", "Dedicated account manager"],
  },
];

function FleetCards({ value, onChange }) {
  return (
    <div className="fleetCards" role="radiogroup" aria-label="How big is your operation?">
      {FLEET_OPTIONS.map((o) => {
        const selected = value === o.value;
        return (
          <button
            type="button"
            key={o.value}
            role="radio"
            aria-checked={selected}
            className={"fleetCard" + (selected ? " fleetCard--selected" : "")}
            onClick={() => onChange(o.value)}
          >
            <span className="fleetCard__radio" aria-hidden="true" />
            <span className="fleetCard__head">
              <span className="fleetCard__num">{o.num}</span>
              <span className="fleetCard__unit">{o.unit}</span>
            </span>
            <span className="fleetCard__title">{o.title}</span>
            <span className="fleetCard__kicker">{o.kicker}</span>
            <span className="fleetCard__rule" />
            <span className="fleetCard__feats">
              {o.feats.map((f) => (
                <span className="fleetCard__feat" key={f}>
                  <Icon.Check className="fleetCard__check" />
                  <span>{f}</span>
                </span>
              ))}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TeammateInvites({ data, setData }) {
  const [email, setEmail] = useS("");
  const [role, setRole] = useS("driver");
  const team = data.teammates || [];
  const isSmall = data.fleet === "2-9";
  const cap = isSmall ? 9 : Infinity;
  const remaining = cap - team.length;
  const planName = isSmall ? "Small fleet" : "Larger fleet";
  const valid = /\S+@\S+\.\S+/.test(email);
  const canInvite = valid && remaining > 0;

  const ROLE_LABEL = { driver: "Driver", dispatcher: "Dispatcher", admin: "Admin" };

  const send = () => {
    if (!canInvite) return;
    setData({ teammates: [...team, { email: email.trim(), role }] });
    setEmail("");
    setRole("driver");
  };
  const remove = (i) => setData({ teammates: team.filter((_, n) => n !== i) });

  return (
    <div className="teamInvite">
      <div className="carrierForm__divider" />
      <div className="teamInvite__head">
        <div className="teamInvite__title">Tell us who to add to your business</div>
        <div className="teamInvite__sub">You can add or remove teammates anytime from your dashboard.</div>
      </div>

      {team.length > 0 &&
      <ul className="teamInvite__list">
        {team.map((t, i) =>
        <li className="teamInvite__item" key={t.email + i}>
            <span className="teamInvite__avatar" aria-hidden="true">{t.email[0].toUpperCase()}</span>
            <span className="teamInvite__itemMail">{t.email}</span>
            <span className="teamInvite__role">{ROLE_LABEL[t.role]}</span>
            <button type="button" className="teamInvite__remove" aria-label={"Remove " + t.email} onClick={() => remove(i)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        )}
      </ul>
      }

      <div className="teamInvite__row">
        <Field label="Teammate email">
          <div className="inputIcon">
            <span className="inputIcon__icon" aria-hidden="true"><Icon.Mail /></span>
            <TextInput type="email" value={email} placeholder="name@company.com"
              className="inputIcon__input"
              disabled={remaining <= 0}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
        </Field>
        <Field label="Role">
          <Select value={role} disabled={remaining <= 0} onChange={(e) => setRole(e.target.value)}>
            <option value="driver">Driver</option>
            <option value="dispatcher">Dispatcher</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
        <button type="button" className="skid-btn skid-btn--secondary skid-btn--lg teamInvite__send"
          onClick={send} disabled={!canInvite}>
          <Icon.UserPlus />
          <span>Send invite</span>
        </button>
      </div>

      <div className="teamInvite__seats">
        {isSmall
          ? `${Math.max(remaining, 0)} of 9 teammate seats remaining on ${planName}.`
          : `Unlimited teammate seats on ${planName}.`}
      </div>
    </div>
  );
}

function CarrierCompany({ data, setData, goto, back }) {
  return (
    <CarrierShell step={3}>
      <CarrierSection title="Tell us about your business."
        lead={<>uShip requires all carriers on our platform to hold a valid DOT number. <a href="#" className="lnk">Learn More</a></>}
      >
        <div className="carrierForm__q">
          <div className="carrierForm__qTitle">How big is your operation?</div>
          <div className="carrierForm__qSub">We'll tailor your tools to your fleet size. You can upgrade any time.</div>
          <FleetCards value={data.fleet} onChange={(v) => setData({ fleet: v })} />
        </div>
        <Field label="Company Name">
          <TextInput value={data.company} onChange={(e) => setData({ company: e.target.value })} />
        </Field>
        <Field label="Street Address" hint="Please enter the street address used on the account holder's license.">
          <TextInput value={data.street} onChange={(e) => setData({ street: e.target.value })} />
        </Field>
        <div className="row row--2">
          <Field label="City">
            <TextInput value={data.city} onChange={(e) => setData({ city: e.target.value })} />
          </Field>
          <Field label="State">
            <TextInput value={data.state} onChange={(e) => setData({ state: e.target.value })} />
          </Field>
        </div>
        <div className="row row--2">
          <Field label="Zip Code">
            <TextInput value={data.zip} onChange={(e) => setData({ zip: e.target.value })} />
          </Field>
          <Field label="Country">
            <Select value={data.country} placeholder="Select one"
              onChange={(e) => setData({ country: e.target.value })}>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="Mexico">Mexico</option>
            </Select>
          </Field>
        </div>
        {(data.fleet === "2-9" || data.fleet === "10+") &&
        <TeammateInvites data={data} setData={setData} />
        }
      </CarrierSection>
      <div className="carrierForm__divider" />
      <FooterNav onBack={() => goto("carrier-2")} onContinue={() => goto("carrier-4")} />
    </CarrierShell>
  );
}

function CarrierTrustd({ data, setData, goto, back }) {
  return (
    <CarrierShell step={4}>
      <CarrierSection title="Real-time digital identity verification"
        lead="Trustd allows all parties within the supply chain to prove their credentials by issuing verified digital business profiles."
      >
        <div className="row row--2">
          <Field label="Driver License">
            <TextInput value={data.license} onChange={(e) => setData({ license: e.target.value })} />
          </Field>
          <Field label="Vehicle identification number">
            <TextInput value={data.vin} onChange={(e) => setData({ vin: e.target.value })} />
          </Field>
        </div>
      </CarrierSection>
      <div className="carrierForm__divider" />
      <FooterNav onBack={() => goto("carrier-3")} onContinue={() => goto("success-carrier")} continueLabel="Create account" />
    </CarrierShell>
  );
}

// (CarrierAccount step removed — username/password live in Contact Information now.)

// =================================================================
// SUCCESS / DONE — small confirmation screen at the end of each flow
// =================================================================
function SuccessScreen({ kind, goto }) {
  const copy = {
    "success-login": {
      title: "You're signed in.",
      sub: "Redirecting you to your dashboard…",
      cta: "Go to dashboard",
      next: "shipments",
    },
    "success-shipper": {
      title: "Welcome to uShip.",
      sub: "Your shipper account is ready. Let's post your first shipment.",
      cta: "Post a shipment",
      next: "ship",
    },
    "success-carrier": {
      title: "Carrier account verified.",
      sub: "We've created your uShip carrier profile. You can start bidding on loads along your route right away.",
      cta: "Browse loads",
      next: "loads",
    },
  }[kind] || { title: "Done.", sub: "", cta: "Continue", next: "" };

  return (
    <div className="success">
      <div className="success__mark">
        <Icon.Check />
      </div>
      <h1 className="screen__title">{copy.title}</h1>
      <p className="screen__sub">{copy.sub}</p>
      <button type="button" className="skid-btn skid-btn--primary skid-btn--lg btn--full success__cta" onClick={() => goto(copy.next === "loads" ? "loadboard" : "welcome")}>
        {copy.cta}
      </button>
      <a href="#" className="success__back" onClick={(e) => { e.preventDefault(); goto("welcome"); }}>Back to start</a>
    </div>
  );
}

Object.assign(window, {
  WelcomeScreen, LoginScreen, ShipperFormScreen,
  CarrierContact, CarrierAuthority, CarrierCompany, CarrierTrustd,
  SuccessScreen, ShipperHero, CarrierHero,
});
