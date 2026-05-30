/* uShip page chrome — Header, BluePanel, Stepper, and form primitives.
   Now built on the Skid design system (skid/components.css). */

const { useState: useStateChrome } = React;

// =================================================================
// HEADER — Figma "Property 1=Shipper" component (uShip-blue logo,
// nav tabs, account chip, help icon).
// =================================================================
function AppHeader({ onLogo, loggedIn = false, accountName = "Shipper Name", activeNav = null }) {
  return (
    <header className="appHeader">
      <div className="appHeader__left">
        <a href="#" className="appHeader__logo" aria-label="uShip home"
          onClick={(e) => { e.preventDefault(); if (onLogo) onLogo(); }}>
          <UShipLogo height={36} />
        </a>
        <nav className="appHeader__nav" aria-label="Primary">
          {loggedIn ? (
            <>
              <a href="#" className={"appHeader__tab" + (activeNav === "shipments" ? " is-active" : "")}>
                <Icon.Search />
                <span>Find Shipments</span>
              </a>
              <a href="#" className="appHeader__tab">
                <span>My Quotes</span>
              </a>
              <a href="#" className="appHeader__tab">
                <Icon.Box />
                <span>My Shipments</span>
              </a>
            </>
          ) : (
            <>
              <a href="#" className={"appHeader__tab" + (activeNav === "shipments" ? " is-active" : "")}>
                <Icon.Box />
                <span>My Shipments</span>
              </a>
              <a href="#" className={"appHeader__tab" + (activeNav === "ship" ? " is-active" : "")}>
                <Icon.ArrowRight />
                <span>Ship</span>
              </a>
            </>
          )}
        </nav>
      </div>
      <div className="appHeader__right">
        {loggedIn ? (
          <button type="button" className="appHeader__account">
            <span className="appHeader__avatar" aria-hidden="true">
              <span>{accountName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
              <span className="appHeader__avatarDot" />
            </span>
            <span className="appHeader__name">{accountName}</span>
            <Icon.ChevronDown />
          </button>
        ) : (
          <span className="appHeader__avatar appHeader__avatar--empty" aria-label="Not signed in" role="img">
            <Icon.User />
          </span>
        )}
        <span className="appHeader__sep" aria-hidden="true" />
        <button type="button" className="appHeader__help" aria-label="Help">
          <Icon.Help />
        </button>
      </div>
    </header>);

}

// =================================================================
// BLUE LEFT PANEL — solid uShip-blue marketing surface used across
// every screen in the Figma flow. Children = optional content
// (Trustd verify card, marketing hero, product peek, etc.).
// =================================================================
function BluePanel({ children, padding = true }) {
  return (
    <aside className={"bluePanel" + (padding ? " bluePanel--pad" : "")}>
      {children}
    </aside>);

}

// =================================================================
// STEPPER — uses Skid's `.skid-step-indicator` (labeled variant)
// for the 5-step carrier wizard.
// =================================================================
const CARRIER_STEPS = [
"Contact Information",
"Authority",
"Company Details",
"Trustd"];


function Stepper({ steps = CARRIER_STEPS, current = 1 }) {
  return (
    <div className="skid-step-indicator stepper" aria-label={`Step ${current} of ${steps.length}`}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const state = idx < current ? "completed" : idx === current ? "active" : "todo";
        return (
          <React.Fragment key={label}>
            <div className={"skid-step-indicator__step skid-step-indicator__step--" + state}>
              <div className="skid-step-indicator__dot">
                {state === "completed" ? <Icon.Check /> : <span>{idx}</span>}
              </div>
              <div className="skid-step-indicator__label">{label}</div>
            </div>
            {i < steps.length - 1 &&
            <div className={"skid-step-indicator__line" + (idx < current ? " skid-step-indicator__line--complete" : "")} aria-hidden="true" />
            }
          </React.Fragment>);

      })}
    </div>);

}

// =================================================================
// CARD — `.skid-card` with extra padding. Used for each carrier
// step body in the Figma.
// =================================================================
function FormCard({ title, lead, children, className = "" }) {
  return (
    <div className={"skid-card skid-card--shadow formCard " + className}>
      <div className="skid-card__pad formCard__pad">
        {title && <h3 className="formCard__title">{title}</h3>}
        {lead && <p className="formCard__lead">{lead}</p>}
        {children}
      </div>
    </div>);

}

// =================================================================
// FIELD — uses Skid's `.skid-field`, `.skid-field__label`,
// `.skid-field__helper` for label + helper text. We bump label
// font up to 14px to match the Figma's "field label" treatment.
// =================================================================
function Field({ label, hint, error, children, className = "", required = false, htmlFor }) {
  return (
    <div className={"skid-field field " + className + (error ? " skid-field--error" : "")}>
      <label className="skid-field__label" htmlFor={htmlFor}>
        {label}
        {required && <span className="field__required" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <div className="skid-field__helper field__hint">{hint}</div>}
      {error && <div className="skid-field__helper">{error}</div>}
    </div>);

}

function TextInput({ className = "", ...p }) {
  return <input className={"skid-input " + className} {...p} />;
}

function Select({ className = "", value, onChange, children, placeholder, ...p }) {
  return (
    <select
      className={"skid-input skid-select " + className}
      value={value}
      onChange={onChange}
      data-placeholder={value ? undefined : "true"}
      {...p}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children}
    </select>
  );
}

function PasswordInput({ value, onChange, placeholder, autoComplete = "current-password", id }) {
  const [show, setShow] = useStateChrome(false);
  return (
    <div className="pwField">
      <input
        id={id}
        className="skid-input pwField__input"
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete} />
      
      <button
        type="button"
        className="pwField__toggle"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}>
        
        {show ? <Icon.EyeOff /> : <Icon.Eye />}
      </button>
    </div>);

}

function Checkbox({ checked, onChange, children, error = false }) {
  return (
    <label className={"skid-check check" + (error ? " skid-check--error" : "")}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="skid-check__box" aria-hidden="true" />
      <span className="check__lbl">{children}</span>
    </label>);

}

function Radio({ checked, onChange, children, name }) {
  return (
    <label className="skid-radio radio">
      <input type="radio" name={name} checked={checked} onChange={onChange} />
      <span className="skid-radio__circle" aria-hidden="true" />
      <span>{children}</span>
    </label>);

}

function SegmentedTwo({ value, options, onChange, size = "md" }) {
  return (
    <div className={"skid-segmented segmented segmented--" + size} role="tablist">
      {options.map((opt) =>
      <button
        key={opt.value}
        type="button"
        role="tab"
        aria-selected={value === opt.value}
        className="skid-segmented__seg"
        onClick={() => onChange(opt.value)}>
          {opt.label}
        </button>
      )}
    </div>);

}

// =================================================================
// FOOTER NAV — Back (blue outline) + Continue (green) row at the
// bottom of every carrier step. Uses Skid buttons.
// =================================================================
function FooterNav({ onBack, onContinue, continueLabel = "Continue", disabled = false, hideBack = false }) {
  return (
    <div className="footerNav">
      {!hideBack &&
      <button type="button" className="skid-btn skid-btn--tertiary skid-btn--lg footerNav__back" onClick={onBack}>
          <Icon.ChevronLeft />
          <span>Back</span>
        </button>
      }
      <span className="footerNav__spacer" />
      <button type="submit" className="skid-btn skid-btn--primary skid-btn--lg footerNav__continue" onClick={onContinue} disabled={disabled}>
        {continueLabel}
      </button>
    </div>);

}

// =================================================================
// SOCIAL ROW — Continue with Google / Apple / Facebook block from
// shipper-02 + carrier-06.
// =================================================================
function SocialButtons({ mode = "Continue", onProvider, disabled = false }) {
  const fire = (p) => { if (!disabled && onProvider) onProvider(p); };
  return (
    <div className="social">
      <button type="button" className="social__btn social__btn--google" onClick={() => fire("google")}>
        <GoogleG />
        <span>{mode} with Google</span>
      </button>
      <div className="social__row">
        <button type="button" className="social__btn social__btn--apple" onClick={() => fire("apple")}>
          <AppleGlyph />
          <span>Apple</span>
        </button>
        <button type="button" className="social__btn social__btn--fb" onClick={() => fire("facebook")}>
          <FacebookGlyph />
          <span>Facebook</span>
        </button>
      </div>
    </div>);

}

function OrDivider({ label = "or email" }) {
  return (
    <div className="orDiv">
      <span className="orDiv__line" />
      <span className="orDiv__lbl">{label}</span>
      <span className="orDiv__line" />
    </div>);

}

Object.assign(window, {
  AppHeader, BluePanel, Stepper, CARRIER_STEPS,
  FormCard, Field, TextInput, Select, PasswordInput, Checkbox, Radio, SegmentedTwo,
  FooterNav, SocialButtons, OrDivider
});